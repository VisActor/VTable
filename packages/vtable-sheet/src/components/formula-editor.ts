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

    // 此时 this.element 应该已经被创建
    if (this.element && this.sheet) {
      // 延迟初始化自动补全，确保元素已添加到 DOM
      setTimeout(() => {
        this.initAutocomplete();
      }, 50);
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

      const inputRect = this.element.getBoundingClientRect();
      const containerRect = tableContainer.getBoundingClientRect();

      // 计算相对于表格容器的位置
      const relativeLeft = inputRect.left - containerRect.left;
      let relativeTop = inputRect.bottom - containerRect.top + 2;

      // 检查是否超出底部边界
      const dropdownHeight = 300;
      if (relativeTop + dropdownHeight > containerRect.height) {
        relativeTop = inputRect.top - containerRect.top - dropdownHeight - 2;
      }

      // 设置下拉框位置
      const dropdown = (this.formulaAutocomplete as any).dropdown;
      if (dropdown) {
        dropdown.style.position = 'absolute';
        dropdown.style.left = `${relativeLeft}px`;
        dropdown.style.top = `${relativeTop}px`;
        dropdown.style.width = `${Math.max(300, inputRect.width)}px`;
        dropdown.style.zIndex = '10000';
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
    if (this.sheet && typeof context.value === 'string' && !context.value.startsWith('=')) {
      const formula = this.sheet.getFormulaManager().getCellFormula({
        sheet: this.sheet.getActiveSheet()?.getKey() || '',
        row: context.row,
        col: context.col
      });

      if (formula) {
        this.setValue(formula);
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
