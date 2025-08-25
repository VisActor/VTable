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
      this.formulaAutocomplete.destroy();
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
      this.formulaAutocomplete.destroy();
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
}

export const formulaEditor = new FormulaInputEditor();
