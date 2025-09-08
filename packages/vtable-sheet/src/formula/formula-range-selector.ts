/**
 * 公式范围选择器
 * 实现Excel风格的公式输入体验：用户输入"=sum("后，选择单元格范围自动插入A1引用
 */

import { FormulaThrottle } from '..';
import type { FormulaManager } from '../managers/formula-manager';
import type { CellRange, CellValueChangedEvent, FormulaCell } from '../ts-types';
import { detectFunctionParameterPosition } from './formula-helper';

export interface FunctionParamPosition {
  start: number;
  end: number;
}

export class FormulaRangeSelector {
  private formulaManager: FormulaManager;
  constructor(formulaManager: FormulaManager) {
    this.formulaManager = formulaManager;
  }

  /**
   * 将选择范围转换为A1格式
   * @param selections 选择范围数组
   * @param addressFromCoord 坐标转地址函数
   * @returns A1格式字符串
   */
  selectionsToA1Notation(selections: any[], addressFromCoord: (row: number, col: number) => string): string {
    if (!selections || selections.length === 0) {
      return '';
    }

    const ranges: string[] = [];

    for (const range of selections) {
      const startAddr = addressFromCoord(range.startRow, range.startCol);
      const endAddr = addressFromCoord(range.endRow, range.endCol);

      // 如果是单个单元格（start和end相同）
      if (range.startRow === range.endRow && range.startCol === range.endCol) {
        ranges.push(startAddr);
      } else {
        // 如果是范围，使用冒号分隔
        ranges.push(`${startAddr}:${endAddr}`);
      }
    }

    return ranges.join(',');
  }

  insertA1ReferenceInFunction(formulaInput: HTMLInputElement, a1Notation: string, isCtrlAddSelection: boolean): void {
    if (!this.formulaManager.inputIsParamMode.inParamMode) {
      return;
    }

    const currentValue = formulaInput.value;
    const cursorPos = this.formulaManager.lastKnownCursorPosInFormulaInput;

    // 找到当前光标所处的参数位置
    const argPosition = this.findCurrentArgumentPosition(currentValue, cursorPos);

    // 在函数参数位置插入或替换A1引用
    let newValue;

    if (argPosition) {
      if (isCtrlAddSelection) {
        // Ctrl模式：追加而非替换
        const currentArg = currentValue.substring(argPosition.start, argPosition.end).trim();

        if (currentArg) {
          // 如果当前参数不为空，追加逗号和新引用
          newValue =
            currentValue.slice(0, argPosition.end) +
            (currentValue[argPosition.end - 1] === ',' ? ' ' : ', ') +
            a1Notation +
            currentValue.slice(argPosition.end);
        } else {
          // 如果当前参数为空，直接插入新引用
          newValue = currentValue.slice(0, argPosition.start) + a1Notation + currentValue.slice(argPosition.end);
        }
      } else {
        // 替换模式：完全替换当前参数
        newValue = currentValue.slice(0, argPosition.start) + a1Notation + currentValue.slice(argPosition.end);
      }
    } else {
      // 防止newValue未定义
      newValue = currentValue;
    }

    formulaInput.value = newValue;
    // 首先设置公式内容
    this.formulaManager.setCellContent(
      {
        sheet: this.formulaManager.sheet.getActiveSheet().getKey(),
        row: this.formulaManager.sheet.getActiveSheet().editingCell.row,
        col: this.formulaManager.sheet.getActiveSheet().editingCell.col
      },
      newValue
    );
    // 设置光标位置到插入内容之后
    const newCursorPos = isCtrlAddSelection
      ? this.formulaManager.lastKnownCursorPosInFormulaInput + (newValue.length - currentValue.length)
      : argPosition
      ? argPosition.start + a1Notation.length
      : cursorPos;

    formulaInput.setSelectionRange(newCursorPos, newCursorPos);
    setTimeout(() => {
      // 确保光标位置在可视区域内
      this.ensureCursorVisible(formulaInput, newCursorPos);
    });
    // 更新函数参数位置
    this.formulaManager.inputIsParamMode.functionParamPosition = {
      start: newCursorPos,
      end: newCursorPos
    };

    // 触发输入事件以更新高亮
    const inputEvent = new Event('input', { bubbles: true });
    Object.defineProperty(inputEvent, 'isFormulaInsertion', { value: true });
    formulaInput.dispatchEvent(inputEvent);
  }
  /**
   * 找到光标所在的参数位置
   * @param formula 公式文本
   * @param cursorPos 光标位置
   * @returns 参数的起始和结束位置
   */
  private findCurrentArgumentPosition(formula: string, cursorPos: number): { start: number; end: number } | null {
    // 检查公式格式是否有效
    let i = formula.indexOf('(');
    if (i === -1) {
      return null;
    }

    let nestLevel = 0;
    let inQuote = false;
    let argumentStart = -1;
    let argumentEnd = -1;

    // 特殊处理：光标在括号后面
    if (cursorPos === i + 1) {
      return {
        start: i + 1,
        end: i + 1
      };
    }

    // 特殊处理：光标在逗号后面
    if (cursorPos > 0 && formula[cursorPos - 1] === ',') {
      return {
        start: cursorPos,
        end: cursorPos
      };
    }

    // 检查光标是否在函数调用内部
    if (cursorPos <= i || cursorPos > formula.length) {
      return null;
    }

    // 第一步：找到当前参数的起始位置
    nestLevel = 1; // 已经找到第一个左括号
    argumentStart = i + 1;

    for (i = argumentStart; i < cursorPos; i++) {
      const char = formula[i];

      // 处理引号内的内容
      if (char === '"' && (i === 0 || formula[i - 1] !== '\\')) {
        inQuote = !inQuote;
        continue;
      }

      // 如果在引号内，忽略所有特殊字符
      if (inQuote) {
        continue;
      }

      if (char === '(') {
        nestLevel++;
      } else if (char === ')') {
        nestLevel--;
        if (nestLevel === 0) {
          // 如果已经回到最外层，则结束搜索
          break;
        }
      } else if (char === ',' && nestLevel === 1) {
        // 如果是当前函数层级的参数分隔符，更新参数开始位置
        argumentStart = i + 1;
      }
    }

    // 特殊处理：光标在空参数区域
    const paramContentBefore = formula.substring(argumentStart, cursorPos).trim();
    if (paramContentBefore === '') {
      return {
        start: argumentStart,
        end: cursorPos
      };
    }

    // 第二步：找到当前参数的结束位置
    // 重置状态，重新计算光标所在位置的嵌套级别
    nestLevel = 0;
    inQuote = false;

    for (i = 0; i < cursorPos; i++) {
      if (formula[i] === '"' && (i === 0 || formula[i - 1] !== '\\')) {
        inQuote = !inQuote;
        continue;
      }
      if (inQuote) {
        continue;
      }

      if (formula[i] === '(') {
        nestLevel++;
      }
      if (formula[i] === ')') {
        nestLevel--;
      }
    }

    // 从光标位置向后查找参数结束位置
    argumentEnd = formula.length;
    for (i = cursorPos; i < formula.length; i++) {
      const char = formula[i];

      if (char === '"' && (i === 0 || formula[i - 1] !== '\\')) {
        inQuote = !inQuote;
        continue;
      }
      if (inQuote) {
        continue;
      }

      if (char === '(') {
        nestLevel++;
      } else if (char === ')') {
        nestLevel--;
        // 如果回到了函数最外层括号
        if (nestLevel === 0) {
          argumentEnd = i;
          break;
        }
      } else if (char === ',' && nestLevel === 1) {
        // 找到下一个同级参数的分隔符
        argumentEnd = i;
        break;
      }
    }

    // 特殊处理：末尾空参数或右括号前的参数
    const paramContentAfter = formula.substring(cursorPos, argumentEnd).trim();
    if (paramContentAfter === '' && cursorPos < argumentEnd) {
      // 如果光标后面到结束位置都是空白，则将结束位置设置为光标位置
      argumentEnd = cursorPos;
    }

    // 确保找到的区间有效
    if (argumentStart > -1 && argumentEnd >= argumentStart) {
      return {
        start: argumentStart,
        end: argumentEnd
      };
    }

    return null;
  }
  /**
   * 处理单元格选择变化
   * @param selections 当前选择范围
   * @param formulaInput 公式输入框
   * @param addressFromCoord 坐标转地址函数
   */
  handleSelectionChanged(
    selections: CellRange[],
    formulaInput: HTMLInputElement,
    isCtrlAddSelection: boolean,
    addressFromCoord: (row: number, col: number) => string
  ): void {
    if (!this.formulaManager.inputIsParamMode.inParamMode || !selections || selections.length === 0) {
      return;
    }

    const a1Notation = this.selectionsToA1Notation(selections, addressFromCoord);
    if (a1Notation) {
      this.insertA1ReferenceInFunction(formulaInput, a1Notation, isCtrlAddSelection);
    }
  }

  /**
   * 处理单元格值变更事件
   * @param event 事件
   */
  handleCellValueChanged(event: CellValueChangedEvent): void {
    console.log('handleCellValueChanged', event);
    const activeWorkSheet = this.formulaManager.sheet.getActiveSheet();
    const formulaManager = this.formulaManager.sheet.formulaManager;

    if (!activeWorkSheet || this.formulaManager.formulaWorkingOnCell) {
      return;
    }

    try {
      // 检查新输入的值是否为公式
      const newValue = event.newValue;
      if (typeof newValue === 'string' && newValue.startsWith('=') && newValue.length > 1) {
        try {
          // 检查是否包含循环引用
          const currentCellAddress = activeWorkSheet.addressFromCoord(event.row, event.col);
          // 使用正则表达式来精确匹配单元格引用
          const cellRegex = new RegExp(`(^|[^A-Za-z0-9])${currentCellAddress}([^A-Za-z0-9]|$)`);
          if (cellRegex.test(newValue)) {
            console.warn('Circular reference detected:', newValue, 'contains', currentCellAddress);
            this.formulaManager.isUpdatingFromFormula = true;
            activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, '#CYCLE!', true, false);
            this.formulaManager.isUpdatingFromFormula = false;
            this.formulaManager.formulaWorkingOnCell = null;
            return;
          }

          // 首先设置公式内容
          formulaManager.setCellContent(
            {
              sheet: activeWorkSheet.getKey(),
              row: event.row,
              col: event.col
            },
            newValue
          );

          // 获取计算结果
          const result = formulaManager.getCellValue({
            sheet: activeWorkSheet.getKey(),
            row: event.row,
            col: event.col
          });
          // // 检查当前单元格是否正在编辑（是否在公式栏中编辑）
          // const formulaInput = this.formulaManager.inputingElement;
          // const isEditing = document.activeElement === formulaInput;

          // 更新单元格显示 - 如果正在编辑则显示公式，否则显示计算结果
          this.formulaManager.isUpdatingFromFormula = true;
          // activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, isEditing ? newValue : result.value);
          activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, result.value, true, false);
          this.formulaManager.isUpdatingFromFormula = false;
          this.formulaManager.formulaWorkingOnCell = null;
        } catch (error) {
          console.warn('Formula processing error:', error);
          // 显示错误状态
          this.formulaManager.isUpdatingFromFormula = true;
          activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, '#ERROR!', true, false);
          this.formulaManager.isUpdatingFromFormula = false;
          this.formulaManager.formulaWorkingOnCell = null;
        }
      } else {
        // 非公式值，同步到HyperFormula
        formulaManager.setCellContent(
          {
            sheet: activeWorkSheet.getKey(),
            row: event.row,
            col: event.col
          },
          newValue
        );
      }

      // 使用FormulaThrottle来优化公式重新计算
      const formulaThrottle = FormulaThrottle.getInstance();
      // 判断是否需要立即更新
      const needImmediateUpdate = this.hasFormulaDependents({
        sheet: activeWorkSheet.getKey(),
        row: event.row,
        col: event.col
      });
      if (needImmediateUpdate) {
        // 更新依赖的公式
        const dependents = formulaManager.getCellDependents({
          sheet: activeWorkSheet.getKey(),
          row: event.row,
          col: event.col
        });

        // 重新计算依赖该单元格的所有公式
        dependents.forEach(dependent => {
          const result = formulaManager.getCellValue(dependent);
          this.formulaManager.isUpdatingFromFormula = true;
          if (activeWorkSheet) {
            activeWorkSheet.setCellValue(dependent.row, dependent.col, result.value);
          }
          this.formulaManager.isUpdatingFromFormula = false;
        });
        // 立即执行完整重新计算
        formulaThrottle.immediateRebuildAndRecalculate(formulaManager);
      } else {
        // 使用节流方式进行公式计算
        formulaThrottle.throttledRebuildAndRecalculate(formulaManager);
      }

      // // 如果当前编辑的单元格就是选中的单元格，更新 fx 输入框
      // const selection = this.activeWorkSheet.getSelection();
      // if (selection && selection.startRow === event.row && selection.startCol === event.col) {
      //   this.updateFormulaBar();
      // }
    } catch (error) {
      console.error('Error in handleCellValueChanged:', error);
    }
  }

  /**
   * 处理范围选择模式下的单元格选中事件
   */
  handleSelectionChangedForRangeMode(event: any): void {
    console.log('handleSelectionChangedForRangeMode', event);
    const activeWorkSheet = this.formulaManager.sheet.getActiveSheet();
    const formulaWorkingOnCell = this.formulaManager.formulaWorkingOnCell;
    const formulaManager = this.formulaManager.sheet.formulaManager;
    if (!activeWorkSheet || !formulaWorkingOnCell) {
      return;
    }

    // const formulaInput = this.formulaInput;
    const formulaInput = this.formulaManager.inputingElement;
    // if (!formulaInput || this.formulaManager.isUpdatingFromFormula) {
    //   return;
    // }
    // TODO 尝试全部去掉isUpdatingFromFormula的判断和赋值
    if (!formulaInput) {
      return;
    }

    // 不依赖 event.type 字符串，selection-end 已在上层绑定，这里直接处理

    this.formulaManager.inputIsParamMode = detectFunctionParameterPosition(
      formulaInput.value,
      this.formulaManager.lastKnownCursorPosInFormulaInput
    );
    if (!this.formulaManager.inputIsParamMode.inParamMode) {
      return;
    }

    if (document.activeElement !== formulaInput) {
      formulaInput.focus();
    }

    // 获取所有选择范围（支持Ctrl/Cmd多选）
    const selections = activeWorkSheet.getMultipleSelections();
    const todoSelection = selections[selections.length - 1];
    let isCtrlAddSelection = false;
    if (selections?.length > formulaManager.lastSelectionRangesOfHandling?.length) {
      isCtrlAddSelection = true;
    }
    formulaManager.lastSelectionRangesOfHandling = selections;
    if (!selections || selections.length === 0) {
      return;
    }

    // 排除当前编辑单元格，避免形成自引用导致 #CYCLE!
    const editCell = formulaManager.formulaWorkingOnCell;
    // const safeSelections = selections
    //   .map(selection => this.excludeEditCellFromSelection(selection, editCell?.row || 0, editCell?.col || 0))
    //   .filter(selection => selection.startRow >= 0 && selection.startCol >= 0); // 过滤掉无效选择
    const safeSelections = this.formulaManager.sheet.excludeEditCellFromSelection(
      todoSelection,
      editCell?.row || 0,
      editCell?.col || 0
    );

    this.handleSelectionChanged([safeSelections], formulaInput, isCtrlAddSelection, (row: number, col: number) =>
      activeWorkSheet!.addressFromCoord(row, col)
    );

    // 写入后不再刷新公式栏，以免覆盖刚插入的引用
  }

  /**
   * 检查单元格是否有公式依赖
   * @param cell 单元格
   * @returns 是否有公式依赖
   */
  private hasFormulaDependents(cell: FormulaCell): boolean {
    try {
      const dependents = this.formulaManager.getCellDependents(cell);
      return dependents.length > 0;
    } catch (error) {
      console.warn('Error checking formula dependents:', error);
      return false;
    }
  }

  /**
   * 确保光标位置在输入框的可视区域内
   * @param input 输入框元素
   * @param cursorPos 光标位置
   */
  private ensureCursorVisible(input: HTMLInputElement, cursorPos: number): void {
    // 创建一个临时元素来计算光标位置
    const tempSpan = document.createElement('span');
    const inputStyle = window.getComputedStyle(input);

    // 复制输入框的样式到临时元素
    tempSpan.style.font = inputStyle.font;
    tempSpan.style.letterSpacing = inputStyle.letterSpacing;
    tempSpan.style.position = 'absolute';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'pre';

    // 设置文本内容为光标位置前的文本
    tempSpan.textContent = input.value.substring(0, cursorPos);
    document.body.appendChild(tempSpan);

    // 计算光标位置
    const cursorOffset = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // 计算可视区域
    const inputScrollLeft = input.scrollLeft;
    const inputWidth = input.clientWidth;
    const paddingLeft = parseFloat(inputStyle.paddingLeft);
    const paddingRight = parseFloat(inputStyle.paddingRight);
    const visibleWidth = inputWidth - paddingLeft - paddingRight;

    // 调整滚动位置确保光标可见
    if (cursorOffset < inputScrollLeft + paddingLeft) {
      // 光标在可视区域左侧
      input.scrollLeft = Math.max(0, cursorOffset - paddingLeft);
    } else if (cursorOffset > inputScrollLeft + visibleWidth) {
      // 光标在可视区域右侧
      input.scrollLeft = cursorOffset - visibleWidth + paddingRight;
    }
  }
}
