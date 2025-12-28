import * as VTable_editors from '@visactor/vtable-editors';
import { FormulaAutocomplete } from './formula-autocomplete';
import type VTableSheet from '../components/vtable-sheet';
import type { EditContext } from '@visactor/vtable-editors';
import { detectFunctionParameterPosition } from './formula-helper';

export class FormulaInputEditor extends VTable_editors.InputEditor {
  private formulaAutocomplete: FormulaAutocomplete | null = null;
  private sheet: VTableSheet | null = null;
  // 定义存储事件处理函数的数组
  private eventHandlers: Array<{ type: string; handler: EventListener }> = [];
  /**
   * 设置 Sheet 实例
   */
  setSheet(sheet: VTableSheet): void {
    this.sheet = sheet;
  }
  getInputElement(): HTMLInputElement {
    return this.element;
  }
  targetIsOnEditor(target: HTMLElement): boolean {
    return target === this.element || target === this.sheet.formulaUIManager.formulaInput;
  }
  /**
   * 创建编辑器元素
   * 重写父类方法以添加自动补全功能
   */
  createElement(): void {
    super.createElement();

    if (this.element && this.sheet) {
      const events = ['click', 'mouseup', 'keyup', 'select', 'input', 'focus'];
      events.forEach(eventType => {
        const handler = (e: Event) => {
          const cursorPos = this.element.selectionStart;
          if (cursorPos !== null && cursorPos !== undefined) {
            this.sheet.formulaManager.lastKnownCursorPosInFormulaInput = cursorPos;
            this.sheet.formulaManager.inputingElement = this.element;
          }
        };

        this.element.addEventListener(eventType, handler);
        this.eventHandlers.push({ type: eventType, handler });
      });

      // 添加输入事件监听
      const inputHandler = (e: Event) => {
        this.handleFormulaInput(e);
      };
      this.element.addEventListener('input', inputHandler);
      this.eventHandlers.push({ type: 'input', handler: inputHandler });

      // 延迟初始化自动补全
      setTimeout(() => {
        this.initAutocomplete();
      }, 50);
    }
  }

  /**
   * 处理公式输入
   */
  private handleFormulaInput(event: Event): void {
    if (!this.sheet || !this.element) {
      return;
    }

    const value = this.element.value;
    // 同步内容到顶部输入栏
    this.sheet.formulaUIManager.formulaInput.value = value;
    // const inputEvent = new Event('input', { bubbles: true });
    // Object.defineProperty(inputEvent, 'isFormulaInsertion', { value: true });
    // this.sheet.formulaUIManager.formulaInput.dispatchEvent(inputEvent);
    // 获取高亮管理器
    const highlightManager = this.sheet.formulaManager.cellHighlightManager;

    if (highlightManager) {
      if (value.startsWith('=')) {
        highlightManager.highlightFormulaCells(value);
      } else {
        highlightManager.clearHighlights();
      }
    }
  }

  /**
   * 初始化自动补全
   */
  private initAutocomplete(): void {
    if (!this.sheet || !this.element) {
      return;
    }

    // 清理之前的实例
    if (this.formulaAutocomplete) {
      this.formulaAutocomplete.release();
      this.formulaAutocomplete = null;
    }

    const tableContainer = this.sheet.getContentElement();

    this.formulaAutocomplete = new FormulaAutocomplete(tableContainer, this.sheet);

    // 自定义定位逻辑
    const customPositioning = () => {
      if (!this.formulaAutocomplete || !this.element) {
        return;
      }

      // 获取编辑器元素和容器的位置信息
      const inputRect = this.element.getBoundingClientRect();
      const containerRect = tableContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 计算相对于表格容器的位置
      const relativeLeft = inputRect.left - containerRect.left;

      // 计算下拉框的最大高度和理想宽度
      const maxDropdownHeight = 250; // 最大高度限制
      const idealWidth = Math.max(300, inputRect.width); // 理想宽度

      // 计算下拉框在下方显示时的顶部位置
      let relativeTop = inputRect.bottom - containerRect.top + 2;

      // 检查是否有足够空间在下方显示下拉框
      const spaceBelow = windowHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      // 判断应该将下拉框放在输入框的上方还是下方
      if (spaceBelow < maxDropdownHeight && spaceAbove > spaceBelow) {
        // 空间不足且上方空间更大，则放在上方
        relativeTop = inputRect.top - containerRect.top - maxDropdownHeight - 2;
      }

      // 确保下拉框不会超出容器底部
      const bottomOverflow = relativeTop + maxDropdownHeight - containerRect.height;
      if (bottomOverflow > 0) {
        relativeTop = Math.max(0, relativeTop - bottomOverflow);
      }

      // 确保下拉框不会超出容器顶部
      if (relativeTop < 0) {
        relativeTop = 0;
      }

      // 设置下拉框位置和样式
      const dropdown = (this.formulaAutocomplete as any).dropdown;
      if (dropdown) {
        dropdown.style.position = 'absolute';
        dropdown.style.left = `${Math.max(0, relativeLeft)}px`;
        dropdown.style.top = `${relativeTop}px`;
        dropdown.style.width = `${idealWidth}px`;
        dropdown.style.maxHeight = `${maxDropdownHeight}px`;
        dropdown.style.overflowY = 'auto';
        dropdown.style.zIndex = '10000';
        dropdown.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      }
    };

    // 附加自动补全到输入框
    this.formulaAutocomplete.attachTo(
      this.element,
      item => {
        // 当选择项目时的回调函数
        this.handleAutocompleteSelect(item);
      },
      customPositioning
    );
  }

  /**
   * 处理自动补全选择
   */
  private handleAutocompleteSelect(item: any): void {
    if (!this.element || !this.sheet) {
      return;
    }
    this.element.value = '=' + item.value;
    // 同步内容到顶部输入栏
    this.sheet.formulaUIManager.formulaInput.value = this.element.value;

    // 触发高亮更新
    const highlightManager = this.sheet.formulaManager.cellHighlightManager;
    if (highlightManager && this.element.value.startsWith('=')) {
      highlightManager.highlightFormulaCells(this.element.value);
    }
  }

  /**
   * 开始编辑
   * 重写父类方法
   */
  onStart(context: EditContext<string>): void {
    // 获取公式
    const formula = this.sheet.formulaManager.getCellFormula({
      sheet: this.sheet.getActiveSheet()?.getKey() || '',
      row: context.row,
      col: context.col
    });
    if (formula) {
      context.value = formula;
    }
    super.onStart(context);
    this.sheet.formulaManager.inputingElement = this.element;
    // 如果是公式，显示公式而不是计算结果
    if (this.sheet && typeof context.value === 'string') {
      const formula = this.sheet.formulaManager.getCellFormula({
        sheet: this.sheet.getActiveSheet()?.getKey() || '',
        row: context.row,
        col: context.col
      });

      if (formula) {
        this.setValue(formula);
        // 触发高亮
        const highlightManager = this.sheet.formulaManager.cellHighlightManager;
        if (highlightManager) {
          highlightManager.highlightFormulaCells(formula);
        }
      }
    }
  }
  beforeEnd(): void {
    this.sheet.formulaManager.formulaWorkingOnCell = null;
  }
  /**
   * 结束编辑
   * 重写父类方法以清理自动补全
   */
  onEnd(): void {
    if (this.formulaAutocomplete) {
      this.formulaAutocomplete.release();
      this.formulaAutocomplete = null;
    }
    if (this.sheet) {
      const highlightManager = this.sheet.formulaManager.cellHighlightManager;
      if (highlightManager) {
        highlightManager.clearHighlights();
      }
    }
    //解绑所有事件
    // 解绑事件（在需要解绑的地方）
    this.eventHandlers.forEach(({ type, handler }) => {
      this.element.removeEventListener(type, handler);
    });
    super.onEnd();
  }

  /**
   * 获取编辑器的值
   */
  getValue(): string {
    return this.element?.value || '';
  }

  validateValue(
    newValue?: any,
    oldValue?: any,
    position?: VTable_editors.CellAddress,
    table?: any,
    isClickOnTable?: boolean
  ): boolean | VTable_editors.ValidateEnum {
    // 判断点击到表格其他单元格，且输入了公式，则检查公式是否完整
    if (isClickOnTable && newValue && newValue.startsWith('=')) {
      // 如果有sheet实例，使用FormulaManager检查公式完整性
      if (this.sheet) {
        const formulaInput = this.element;
        this.sheet.formulaManager.inputIsParamMode = detectFunctionParameterPosition(
          formulaInput.value,
          this.sheet.formulaManager.lastKnownCursorPosInFormulaInput
        );
        if (this.sheet.formulaManager.inputIsParamMode.inParamMode) {
          // // 如果公式不完整，不退出编辑状态  TODO 这里不应该只判断完整性，如这种情况下按住ctrl连续点选 =SUM(H5) 这种情况应该允许继续编辑输入点选单元格范围
          // if (!formulaManager.isFormulaComplete(newValue)) {

          this.sheet.formulaManager.formulaWorkingOnCell = this.sheet.getActiveSheet()?.editingCell;

          return VTable_editors.ValidateEnum.validateNotExit;
        }
        return VTable_editors.ValidateEnum.validateExit;
      }
      // 如果没有sheet实例，使用简单的括号匹配检查
      const openParenCount = (newValue.match(/\(/g) || []).length;
      const closeParenCount = (newValue.match(/\)/g) || []).length;
      if (openParenCount !== closeParenCount) {
        return VTable_editors.ValidateEnum.validateNotExit;
      }
    }
    return true;
  }

  /**
   * 将选中的单元格范围转换为公式引用字符串
   * 例如：A1:B3
   */
  private getCellRangeString(range: {
    start: { col: number; row: number };
    end: { col: number; row: number };
  }): string {
    if (!range || !range.start || !range.end) {
      return '';
    }

    // 将列索引转换为字母表示（0->A, 1->B, 等）
    const colToLetter = (col: number): string => {
      let letter = '';
      while (col >= 0) {
        letter = String.fromCharCode(65 + (col % 26)) + letter;
        col = Math.floor(col / 26) - 1;
      }
      return letter;
    };

    const startCol = colToLetter(range.start.col);
    const startRow = range.start.row + 1; // 行索引从1开始
    const endCol = colToLetter(range.end.col);
    const endRow = range.end.row + 1;

    // 如果是单个单元格
    if (startCol === endCol && startRow === endRow) {
      return `${startCol}${startRow}`;
    }

    // 如果是范围
    return `${startCol}${startRow}:${endCol}${endRow}`;
  }
}

export const formulaEditor = new FormulaInputEditor();
