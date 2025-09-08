import type VTableSheet from '../components/vtable-sheet';
import { FormulaThrottle } from '..';
import type { CellValueChangedEvent, FormulaCell } from '../ts-types';
import { detectFunctionParameterPosition } from './formula-helper';

/**
 * 公式UI管理器
 * 封装公式编辑、显示等UI相关功能
 */
export class FormulaUIManager {
  private sheet: VTableSheet;
  private formulaBarElement: HTMLElement | null = null;
  formulaInput: HTMLInputElement | null = null;
  isFormulaBarShowingResult = false;

  private isEnterKeyPressed = false;

  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
  }

  /**
   * 创建公式栏
   */
  createFormulaBar(): HTMLElement {
    // SVG图标常量
    const cancelIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 ' +
      '6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
      '</svg>';
    const confirmIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>' +
      '</svg>';

    const formulaBar = document.createElement('div');
    formulaBar.className = 'vtable-sheet-formula-bar';

    // 创建单元格地址显示
    const cellAddressBox = document.createElement('div');
    cellAddressBox.className = 'vtable-sheet-cell-address';
    cellAddressBox.textContent = '';
    formulaBar.appendChild(cellAddressBox);

    // 创建fx标志
    const formulaIcon = document.createElement('div');
    formulaIcon.className = 'vtable-sheet-formula-icon';
    formulaIcon.textContent = 'fx';
    formulaIcon.title = '插入函数';
    formulaBar.appendChild(formulaIcon);

    // 创建公式输入框
    const formulaInput = document.createElement('input');
    this.formulaInput = formulaInput;
    formulaInput.className = 'vtable-sheet-formula-input';
    formulaInput.placeholder = '输入公式...';
    // 光标有可能被改变的事件监听。 用于记录光标位置。
    const events = ['click', 'mouseup', 'keyup', 'select', 'input', 'focus'];
    events.forEach(eventType => {
      formulaInput.addEventListener(eventType, e => {
        const cursorPos = formulaInput.selectionStart;
        if (cursorPos !== null && cursorPos !== undefined) {
          console.log('event', e, 'old', this.sheet.formulaManager.lastKnownCursorPosInFormulaInput, 'new', cursorPos);
          this.sheet.formulaManager.lastKnownCursorPosInFormulaInput = cursorPos;
          this.sheet.formulaManager.inputingElement = formulaInput;
        }
      });
    });
    formulaInput.addEventListener('input', e => this.handleFormulaInput(e));
    formulaInput.addEventListener('keydown', e => this.handleFormulaKeydown(e));
    formulaInput.addEventListener('focus', () => {
      this.activateFormulaBar();
      // 当获得焦点时，显示公式而不是计算值
      const activeWorkSheet = this.sheet.getActiveSheet();
      if (activeWorkSheet) {
        const editingCell = activeWorkSheet.editingCell;
        if (editingCell && !this.sheet.formulaManager.formulaWorkingOnCell) {
          const formula = this.sheet.formulaManager.getCellFormula({
            sheet: editingCell.sheet,
            row: editingCell.row,
            col: editingCell.col
          });
          if (formula) {
            this.sheet.formulaManager.formulaWorkingOnCell = editingCell;
            // 显示公式
            const displayFormula = formula.startsWith('=') ? formula : `=${formula}`;
            formulaInput.value = displayFormula;
            // 触发高亮
            this.sheet.formulaManager.cellHighlightManager.highlightFormulaCells(displayFormula);

            // const formulaIfCorrect = this.sheet.formulaManager.isFormulaComplete(formulaInput.value);
            // if (formulaIfCorrect) {
            //   this.sheet.formulaManager.formulaWorkingOnCell = null;
            // } else {
            //   this.sheet.formulaManager.formulaWorkingOnCell = activeWorkSheet.editingCell;
            // }
            this.sheet.formulaManager.inputIsParamMode = detectFunctionParameterPosition(
              formulaInput.value,
              this.sheet.formulaManager.lastKnownCursorPosInFormulaInput
            );
          }
        }
      }
    });

    formulaInput.addEventListener('blur', () => {
      console.log('blur', formulaInput.selectionStart);
      if (this.sheet.formulaManager.formulaWorkingOnCell) {
        return;
      }

      this.deactivateFormulaBar();
      this.sheet.formulaManager.cellHighlightManager.clearHighlights();
      // 当失去焦点时，如果没有确认修改，恢复显示计算值
      const activeWorkSheet = this.sheet.getActiveSheet();
      if (activeWorkSheet) {
        const selection = activeWorkSheet.getSelection();
        if (selection) {
          const result = this.sheet.formulaManager.getCellValue({
            sheet: activeWorkSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });
          this.sheet.formulaManager.isUpdatingFromFormula = true;
          activeWorkSheet.tableInstance?.changeCellValue(
            selection.startCol,
            selection.startRow,
            result.error ? '#ERROR!' : result.value
          );
          this.sheet.formulaManager.isUpdatingFromFormula = false;
        }
      }
    });

    formulaBar.appendChild(formulaInput);

    // 创建操作按钮容器
    const formulaActions = document.createElement('div');
    formulaActions.className = 'vtable-sheet-formula-actions';

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.className = 'vtable-sheet-formula-button vtable-sheet-formula-cancel';
    cancelButton.innerHTML = cancelIcon;
    cancelButton.title = '取消';
    cancelButton.addEventListener('click', () => this.cancelFormulaEdit());
    formulaActions.appendChild(cancelButton);

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.className = 'vtable-sheet-formula-button vtable-sheet-formula-confirm';
    confirmButton.innerHTML = confirmIcon;
    confirmButton.title = '确认';
    confirmButton.addEventListener('click', () => this.confirmFormulaEdit());
    formulaActions.appendChild(confirmButton);

    formulaBar.appendChild(formulaActions);
    this.formulaBarElement = formulaBar;

    return formulaBar;
  }

  /**
   * 激活公式栏
   */
  activateFormulaBar(): void {
    const formulaBar = this.formulaBarElement;
    if (formulaBar) {
      formulaBar.classList.add('active');
    }
  }

  /**
   * 取消激活公式栏
   */
  deactivateFormulaBar(): void {
    const formulaBar = this.formulaBarElement;
    if (formulaBar) {
      formulaBar.classList.remove('active');
    }
    this.sheet.formulaManager.cellHighlightManager.clearHighlights();
  }

  /**
   * 取消公式编辑
   */
  cancelFormulaEdit(): void {
    const formulaInput = this.formulaInput;
    if (formulaInput) {
      this.updateFormulaBar(); // 重置为原始值
    }
  }

  /**
   * 确认公式编辑
   */
  confirmFormulaEdit(): void {
    const formulaInput = this.formulaInput;
    const activeWorkSheet = this.sheet.getActiveSheet();
    if (formulaInput && activeWorkSheet) {
      const selection = activeWorkSheet.editingCell;
      if (!selection) {
        return;
      }

      const value = formulaInput.value;

      // 应用与按Enter键相同的逻辑
      if (value.startsWith('=') && value.length > 1) {
        try {
          // 检查是否包含循环引用
          const currentCellAddress = activeWorkSheet.addressFromCoord(selection.row, selection.col);
          // 使用正则表达式来精确匹配单元格引用
          const cellRegex = new RegExp(`(^|[^A-Za-z0-9])${currentCellAddress}([^A-Za-z0-9]|$)`);
          if (cellRegex.test(value)) {
            console.warn('Circular reference detected:', value, 'contains', currentCellAddress);
            activeWorkSheet.setCellValue(selection.row, selection.col, '#CYCLE!');
            this.sheet.formulaManager.isUpdatingFromFormula = true;
            activeWorkSheet.tableInstance?.changeCellValue(selection.col, selection.row, '#CYCLE!');
            this.sheet.formulaManager.isUpdatingFromFormula = false;
            formulaInput.value = '';
            formulaInput.blur();
            return;
          }

          // 设置公式内容
          this.sheet.formulaManager.setCellContent(
            {
              sheet: activeWorkSheet.getKey(),
              row: selection.row,
              col: selection.col
            },
            value
          );

          // 获取计算结果
          const result = this.sheet.formulaManager.getCellValue({
            sheet: activeWorkSheet.getKey(),
            row: selection.row,
            col: selection.col
          });

          activeWorkSheet.setCellValue(selection.row, selection.col, result.value);
        } catch (error) {
          console.warn('Formula confirmation error:', error);
          // 显示错误状态
          activeWorkSheet.setCellValue(selection.row, selection.col, '#ERROR!');
        }
      } else {
        activeWorkSheet.setCellValue(selection.row, selection.col, value);
      }
    }
  }

  /**
   * 更新公式栏
   */
  updateFormulaBar(): void {
    if (!this.formulaBarElement) {
      return;
    }

    // 如果没有活动的sheet或者没有选中的单元格，则清空公式栏
    const activeWorkSheet = this.sheet.getActiveSheet();
    if (!activeWorkSheet) {
      this.clearFormula();
      return;
    }

    const selection = activeWorkSheet.getSelection();
    if (!selection) {
      this.clearFormula();
      return;
    }

    try {
      // 边界检查
      const rowCount = activeWorkSheet.getRowCount();
      const colCount = activeWorkSheet.getColumnCount();

      if (
        selection.startRow < 0 ||
        selection.startRow >= rowCount ||
        selection.startCol < 0 ||
        selection.startCol >= colCount
      ) {
        this.clearFormula();
        return;
      }

      // 更新单元格地址
      const cellAddressBox = this.formulaBarElement.querySelector('.vtable-sheet-cell-address');
      if (cellAddressBox) {
        cellAddressBox.textContent = activeWorkSheet.addressFromCoord(selection.startRow, selection.startCol);
      }

      // 更新公式输入框
      const formulaInput = this.formulaInput;
      if (formulaInput) {
        // 检查是否在函数参数模式下，如果是则不覆盖公式输入框内容
        this.sheet.formulaManager.inputIsParamMode = detectFunctionParameterPosition(
          formulaInput.value,
          this.sheet.formulaManager.lastKnownCursorPosInFormulaInput
        );
        if (this.sheet.formulaManager.inputIsParamMode.inParamMode) {
          return;
        }

        // 如果公式栏正在显示计算结果，不覆盖内容
        if (this.isFormulaBarShowingResult) {
          return;
        }

        try {
          const formula = this.sheet.formulaManager.getCellFormula({
            sheet: activeWorkSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });

          if (formula) {
            const displayFormula = formula.startsWith('=') ? formula : '=' + formula;
            formulaInput.value = displayFormula;
          } else {
            const cellValue = activeWorkSheet.getCellValue(selection.startRow, selection.startCol);
            formulaInput.value = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
          }
          console.log('222 formulaInput.value', formulaInput.value);
        } catch (e) {
          console.warn('Error updating formula input:', e);
          formulaInput.value = '';
        }
      }
    } catch (e) {
      console.error('Error in updateFormulaBar:', e);
      this.clearFormula();
    }
  }

  /**
   * 处理公式输入
   * @param event 事件
   */
  private handleFormulaInput(event: Event): void {
    const activeWorkSheet = this.sheet.getActiveSheet();
    if (!activeWorkSheet) {
      return;
    }
    const editingCell = activeWorkSheet.editingCell;
    if (!editingCell) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // 如果是公式，高亮引用的单元格
    if (value.startsWith('=')) {
      this.sheet.formulaManager.cellHighlightManager.highlightFormulaCells(value);
    }
    // 如果是公式插入事件，不进行公式计算
    if ((event as any).isFormulaInsertion) {
      return;
    }
    // 检测函数参数位置
    this.sheet.formulaManager.inputIsParamMode = detectFunctionParameterPosition(
      value,
      this.sheet.formulaManager.lastKnownCursorPosInFormulaInput
    );

    // 如果是公式，高亮引用的单元格
    if (value.startsWith('=')) {
      this.sheet.formulaManager.cellHighlightManager.highlightFormulaCells(value);
      // 开始新的公式输入，重置标志
      this.isFormulaBarShowingResult = false;

      // 设置公式内容
      this.sheet.formulaManager.setCellContent(
        {
          sheet: activeWorkSheet.getKey(),
          row: editingCell.row,
          col: editingCell.col
        },
        value
      );
    } else {
      this.sheet.formulaManager.cellHighlightManager.clearHighlights();
    }

    this.sheet.formulaManager.isUpdatingFromFormula = false;

    // //当前input框内是否为公式，并且检查公式的完整性。如果不是完整的，那么不退出编辑状态，且等待用户输入其他内容，或者等待用户进行框选点选单元格设定计算选取
    // const formulaIfCorrect = this.sheet.formulaManager.isFormulaComplete(value);
    // if (formulaIfCorrect) {
    //   this.sheet.formulaManager.formulaWorkingOnCell = null;
    // } else {
    this.sheet.formulaManager.formulaWorkingOnCell = activeWorkSheet.editingCell;
    // }
  }

  /**
   * 处理公式输入框键盘事件
   * @param event 事件
   */
  private handleFormulaKeydown(event: KeyboardEvent): void {
    console.log('handleFormulaKeydown');
    const activeWorkSheet = this.sheet.getActiveSheet();
    if (!activeWorkSheet) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (event.key === 'Enter') {
      const editingCell = activeWorkSheet.editingCell;
      if (!editingCell) {
        return;
      }

      const value = input.value;

      if (value.startsWith('=') && value.length > 1) {
        try {
          // 检查是否包含循环引用
          const currentCellAddress = activeWorkSheet.addressFromCoord(editingCell.row, editingCell.col);
          // 使用正则表达式来精确匹配单元格引用
          const cellRegex = new RegExp(`(^|[^A-Za-z0-9])${currentCellAddress}([^A-Za-z0-9]|$)`);
          if (cellRegex.test(value)) {
            console.warn('Circular reference detected:', value, 'contains', currentCellAddress);
            activeWorkSheet.setCellValue(editingCell.row, editingCell.col, '#CYCLE!');
            this.sheet.formulaManager.isUpdatingFromFormula = true;
            activeWorkSheet.tableInstance?.changeCellValue(editingCell.col, editingCell.row, '#CYCLE!');
            this.sheet.formulaManager.isUpdatingFromFormula = false;
            this.sheet.formulaManager.formulaWorkingOnCell = null;
            input.value = '';
            input.blur();
            return;
          }

          // 设置公式内容
          this.sheet.formulaManager.setCellContent(
            {
              sheet: activeWorkSheet.getKey(),
              row: editingCell.row,
              col: editingCell.col
            },
            value
          );

          // 计算结果并仅写入结果展示（不写入公式文本到单元格显示）
          const result = this.sheet.formulaManager.getCellValue({
            sheet: activeWorkSheet.getKey(),
            row: editingCell.row,
            col: editingCell.col
          });

          this.sheet.formulaManager.isUpdatingFromFormula = true;
          activeWorkSheet.tableInstance?.changeCellValue(
            editingCell.col,
            editingCell.row,
            result.error ? '#ERROR!' : result.value
          );

          // // 在公式栏中显示计算结果
          // input.value = result.error ? '#ERROR!' : String(result.value);
          this.isFormulaBarShowingResult = true;
          console.log('isFormulaBarShowingResult', true);
          input.blur();
          setTimeout(() => {
            this.sheet.formulaManager.isUpdatingFromFormula = false;
            this.sheet.formulaManager.formulaWorkingOnCell = null;
            activeWorkSheet.tableInstance.clearSelected();
            this.sheet.formulaManager.cellHighlightManager.clearHighlights();
            activeWorkSheet.tableInstance.selectCell(editingCell.col, editingCell.row);
          }, 0);
        } catch (error) {
          this.sheet.formulaManager.isUpdatingFromFormula = false;
          console.warn('Formula evaluation error:', error);
          // 显示错误状态
          activeWorkSheet.setCellValue(editingCell.row, editingCell.col, '#ERROR!');
          this.sheet.formulaManager.isUpdatingFromFormula = true;
          activeWorkSheet.tableInstance?.changeCellValue(editingCell.col, editingCell.row, '#ERROR!');
          this.sheet.formulaManager.isUpdatingFromFormula = false;
          this.sheet.formulaManager.formulaWorkingOnCell = null;
        }
      } else {
        // 普通值，直接设置
        activeWorkSheet.setCellValue(editingCell.row, editingCell.col, value);
        this.sheet.formulaManager.isUpdatingFromFormula = true;
        activeWorkSheet.tableInstance?.changeCellValue(editingCell.col, editingCell.row, value);
        this.sheet.formulaManager.isUpdatingFromFormula = false;
        this.sheet.formulaManager.formulaWorkingOnCell = null;
      }

      // 不自动移动到下一行，保持当前位置
      this.isEnterKeyPressed = true;

      // 阻止默认行为
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * 清除单元格地址和公式输入框
   */
  clearFormula(): void {
    const cellAddressBox = this.formulaBarElement?.querySelector('.vtable-sheet-cell-address');
    if (cellAddressBox) {
      cellAddressBox.textContent = '';
    }

    const formulaInput = this.formulaInput;
    if (formulaInput) {
      formulaInput.value = '';
    }
  }
}
