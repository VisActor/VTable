import * as VTable_editors from '@visactor/vtable-editors';
import { FormulaAutocomplete } from './formula-autocomplete';
import type VTableSheet from './vtable-sheet';
import type { EditContext } from '@visactor/vtable-editors';

export class FormulaInputEditor extends VTable_editors.InputEditor {
  private formulaAutocomplete: FormulaAutocomplete | null = null;
  private sheet: VTableSheet | null = null;

  /**
   * 设置 Sheet 实例
   */
  setSheet(sheet: VTableSheet): void {
    this.sheet = sheet;
  }

  /**
   * 创建编辑器元素
   * 重写父类方法以添加自动补全功能
   */
  createElement(): void {
    super.createElement();

    if (this.element && this.sheet) {
      // 添加输入事件监听
      this.element.addEventListener('input', e => {
        this.handleFormulaInput(e);
      });

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

    // 获取高亮管理器
    const highlightManager = (this.sheet as any).cellHighlightManager;

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
    this.formulaAutocomplete.attachTo(this.element, undefined, customPositioning);
  }

  /**
   * 开始编辑
   * 重写父类方法
   */
  onStart(context: EditContext<string>): void {
    super.onStart(context);

    // 如果是公式，显示公式而不是计算结果
    if (this.sheet && typeof context.value === 'string') {
      const formula = this.sheet.getFormulaManager().getCellFormula({
        sheet: this.sheet.getActiveSheet()?.getKey() || '',
        row: context.row,
        col: context.col
      });

      if (formula) {
        this.setValue(formula);
        // 触发高亮
        const highlightManager = (this.sheet as any).cellHighlightManager;
        if (highlightManager) {
          highlightManager.highlightFormulaCells(formula);
        }
      }
    }
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
      const highlightManager = (this.sheet as any).cellHighlightManager;
      if (highlightManager) {
        highlightManager.clearHighlights();
      }
    }

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
        const formulaManager = this.sheet.getFormulaManager();
        if (formulaManager && typeof formulaManager.isFormulaComplete === 'function') {
          // 如果公式不完整，不退出编辑状态
          if (!formulaManager.isFormulaComplete(newValue)) {
            // 获取当前选中的单元格范围
            // 注意：需要确保VTableSheet类中有getSelectedRange方法
            // 如果没有，可能需要通过其他方式获取选中范围
            const selectedRange = (this.sheet as any).getSelectedRange?.();
            if (selectedRange) {
              // 如果有选中的单元格范围，将其转换为公式引用并附加到当前公式
              const activeSheet = this.sheet.getActiveSheet()?.getKey() || '';
              const rangeRef = `${activeSheet}!${this.getCellRangeString(selectedRange)}`;

              // 检查公式中是否已经包含了这个引用，避免重复添加
              if (!newValue.includes(rangeRef)) {
                // 在光标位置插入单元格引用
                // 这里简单处理，直接追加到公式末尾
                const updatedValue =
                  newValue.endsWith('(') || newValue.endsWith(',') || newValue.endsWith(' ')
                    ? `${newValue}${rangeRef}`
                    : `${newValue},${rangeRef}`;

                // 更新输入框的值
                if (this.element) {
                  this.element.value = updatedValue;
                }
              }
            }
            return VTable_editors.ValidateEnum.validateNotExit;
          }
        } else {
          // 如果没有isFormulaComplete方法，使用简单的括号匹配检查
          const openParenCount = (newValue.match(/\(/g) || []).length;
          const closeParenCount = (newValue.match(/\)/g) || []).length;
          if (openParenCount !== closeParenCount) {
            return VTable_editors.ValidateEnum.validateNotExit;
          }
        }
      } else {
        // 如果没有sheet实例，使用简单的括号匹配检查
        const openParenCount = (newValue.match(/\(/g) || []).length;
        const closeParenCount = (newValue.match(/\)/g) || []).length;
        if (openParenCount !== closeParenCount) {
          return VTable_editors.ValidateEnum.validateNotExit;
        }
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
