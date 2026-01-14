/**
 * 公式范围选择器
 * 实现Excel风格的公式输入体验：用户输入"=sum("后，选择单元格范围自动插入A1引用
 */

import { FormulaThrottle } from './formula-throttle';
import type { FormulaManager } from '../managers/formula-manager';
import type { CellRange, FormulaCell } from '../ts-types';
import { detectFunctionParameterPosition } from './formula-helper';
import type { TableEventHandlersEventArgumentMap } from '@visactor/vtable/es/ts-types';

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
      const startAddr = addressFromCoord(range.startCol, range.startRow);
      const endAddr = addressFromCoord(range.endCol, range.endRow);

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
    // 首先检查光标是否在操作符后面
    if (cursorPos > 1 && cursorPos <= formula.length) {
      const prevChar = formula[cursorPos - 1];
      if (['+', '-', '*', '/', '=', '>', '<', '&', '|', '^'].includes(prevChar)) {
        // 光标在操作符后面，将光标位置视为参数的起始和结束位置
        return {
          start: cursorPos,
          end: cursorPos
        };
      }
    }

    // 检查公式是否包含括号
    if (!formula.includes('(')) {
      return null;
    }

    // 从后向前查找最接近光标的左括号
    let lastOpenParenBeforeCursor = -1;
    let nestLevel = 0;
    let inQuote = false;

    // 第一阶段：找到光标所在的函数调用
    for (let i = 0; i < cursorPos; i++) {
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
        lastOpenParenBeforeCursor = i;
      } else if (char === ')') {
        nestLevel--;
      }
    }

    // 如果没有找到左括号或者光标不在任何括号内
    if (lastOpenParenBeforeCursor === -1 || nestLevel <= 0) {
      // 检查是否在公式开始位置
      if (formula.startsWith('=') && cursorPos === 1) {
        return {
          start: cursorPos,
          end: cursorPos
        };
      }

      return null;
    }

    // 特殊处理：光标恰好在左括号后面
    if (cursorPos === lastOpenParenBeforeCursor + 1) {
      return {
        start: cursorPos,
        end: cursorPos
      };
    }

    // 特殊处理：光标在逗号后面
    if (cursorPos > 0 && formula[cursorPos - 1] === ',') {
      return {
        start: cursorPos,
        end: cursorPos
      };
    }

    // 找到当前参数的起始位置
    let argumentStart = lastOpenParenBeforeCursor + 1;
    let argumentEnd = cursorPos;

    // 重置状态
    nestLevel = 1; // 从左括号开始，嵌套级别为1
    inQuote = false;

    // 从找到的左括号位置向光标方向扫描，找到当前参数的起始位置
    for (let i = argumentStart; i < cursorPos; i++) {
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
        if (nestLevel === 0) {
          // 如果回到了函数最外层，则这个右括号后面的内容不再是当前函数的参数
          break;
        }
      } else if (char === ',' && nestLevel === 1) {
        // 如果是当前函数层级的参数分隔符，更新参数开始位置
        argumentStart = i + 1;
      }
    }

    // 重置状态，准备从光标位置向后扫描
    nestLevel = 0;
    inQuote = false;

    // 重新计算光标位置的嵌套级别
    for (let i = 0; i < cursorPos; i++) {
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
    for (let i = cursorPos; i < formula.length; i++) {
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
        // 如果回到了当前函数的右括号
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

    // 处理空参数的情况
    const paramContentBefore = formula.substring(argumentStart, cursorPos).trim();
    const paramContentAfter = formula.substring(cursorPos, argumentEnd).trim();

    if (paramContentBefore === '' && cursorPos === argumentStart) {
      // 光标在参数起始位置，且参数为空
      return {
        start: argumentStart,
        end: argumentStart
      };
    }

    if (paramContentAfter === '' && cursorPos < argumentEnd) {
      // 光标后面到结束位置都是空白
      argumentEnd = cursorPos;
    }

    return {
      start: argumentStart,
      end: argumentEnd
    };
  }
  /**
   * 处理单元格选择变化
   * @param selections 当前选择范围
   * @param formulaInput 公式输入框
   * @param addressFromCoord 坐标转地址函数
   */
  private handleSelectionChanged(
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
  handleCellValueChanged(event: TableEventHandlersEventArgumentMap['change_cell_value']): void {
    const activeWorkSheet = this.formulaManager.sheet.getActiveSheet();
    const formulaManager = this.formulaManager.sheet.formulaManager;

    if (!activeWorkSheet || this.formulaManager.formulaWorkingOnCell) {
      return;
    }

    try {
      // 检查新输入的值是否为公式
      const newValue = event.changedValue;
      if (typeof newValue === 'string' && newValue.startsWith('=') && newValue.length > 1) {
        try {
          // 检查是否包含循环引用
          const currentCellAddress = activeWorkSheet.addressFromCoord(event.col, event.row);
          // 使用正则表达式来精确匹配单元格引用
          const cellRegex = new RegExp(`(^|[^A-Za-z0-9])${currentCellAddress}([^A-Za-z0-9]|$)`);
          if (cellRegex.test(newValue)) {
            console.warn('Circular reference detected:', newValue, 'contains', currentCellAddress);
            activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, '#CYCLE!', true, false);
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
          // activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, isEditing ? newValue : result.value);
          // 不触发事件，避免无限循环 - 我们将在updateDependentCellsCascade中处理所有依赖
          activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, result.value, false, false);
          this.formulaManager.formulaWorkingOnCell = null;
        } catch (error) {
          console.warn('Formula processing error:', error);
          // 显示错误状态
          activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, '#ERROR!', true, false);
          this.formulaManager.formulaWorkingOnCell = null;
        }
      } else {
        // 非公式值，同步到FormulaEngine (MIT兼容)
        formulaManager.setCellContent(
          {
            sheet: activeWorkSheet.getKey(),
            row: event.row,
            col: event.col
          },
          newValue
        );

        // 检查是否需要级联更新依赖单元格
        const needImmediateUpdate = this.hasFormulaDependents({
          sheet: activeWorkSheet.getKey(),
          row: event.row,
          col: event.col
        });

        if (needImmediateUpdate) {
          // 使用FormulaEngine的依赖管理进行级联更新 (MIT兼容)
          this.updateDependentCellsCascade(activeWorkSheet, formulaManager, {
            sheet: activeWorkSheet.getKey(),
            row: event.row,
            col: event.col
          });
        }
      }

      // 使用FormulaThrottle来优化公式重新计算
      const formulaThrottle = FormulaThrottle.getInstance();

      // 判断是否需要立即更新（检查是否有依赖该单元格的公式）
      const needImmediateUpdate = this.hasFormulaDependents({
        sheet: activeWorkSheet.getKey(),
        row: event.row,
        col: event.col
      });

      if (needImmediateUpdate) {
        // 使用FormulaEngine的依赖管理进行级联更新 (MIT兼容)
        this.updateDependentCellsCascade(activeWorkSheet, formulaManager, {
          sheet: activeWorkSheet.getKey(),
          row: event.row,
          col: event.col
        });
        // 立即执行完整重新计算
        formulaThrottle.immediateRebuildAndRecalculate(formulaManager);
      } else {
        // 使用节流方式进行公式计算（用于没有依赖的情况）
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
  handleSelectionChangedForRangeMode(): void {
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

    this.handleSelectionChanged([safeSelections], formulaInput, isCtrlAddSelection, (col: number, row: number) =>
      activeWorkSheet!.addressFromCoord(col, row)
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
   * 使用FormulaEngine的依赖管理进行级联更新 (MIT兼容)
   * @param activeWorkSheet 当前工作表
   * @param formulaManager 公式管理器
   * @param changedCell 发生变化的单元格
   */
  private updateDependentCellsCascade(
    activeWorkSheet: any,
    formulaManager: FormulaManager,
    changedCell: FormulaCell
  ): void {
    try {
      // 获取所有依赖该单元格的单元格（包括间接依赖）
      const allDependents = this.getAllDependentsRecursive(formulaManager, changedCell);

      if (allDependents.length === 0) {
        return;
      }

      // 按依赖顺序排序（确保依赖项先被更新）
      const sortedDependents = this.sortCellsByDependencyOrder(formulaManager, allDependents);

      // 批量更新所有依赖单元格
      for (const dependent of sortedDependents) {
        const result = formulaManager.getCellValue(dependent);
        if (result && activeWorkSheet) {
          // 更新单元格显示值，但不触发事件（避免无限循环）
          activeWorkSheet.tableInstance?.changeCellValue(
            dependent.col,
            dependent.row,
            result.value,
            false, // workOnEditableCell: allow editing any cell
            false // triggerEvent: don't fire events to avoid infinite loops
          );
        }
      }
    } catch (error) {
      console.error('Error in updateDependentCellsCascade:', error);
    }
  }

  /**
   * 递归获取所有依赖单元格（包括间接依赖）
   * @param formulaManager 公式管理器
   * @param cell 起始单元格
   * @param visited 已访问的单元格（防止循环）
   * @returns 所有依赖单元格
   */
  private getAllDependentsRecursive(
    formulaManager: FormulaManager,
    cell: FormulaCell,
    visited: Set<string> = new Set()
  ): FormulaCell[] {
    const cellKey = `${cell.sheet}!${cell.row},${cell.col}`;

    // 防止循环依赖
    if (visited.has(cellKey)) {
      return [];
    }
    visited.add(cellKey);

    const directDependents = formulaManager.getCellDependents(cell);
    let allDependents: FormulaCell[] = [...directDependents];

    // 递归获取间接依赖
    for (const dependent of directDependents) {
      const indirectDependents = this.getAllDependentsRecursive(formulaManager, dependent, visited);
      allDependents = allDependents.concat(indirectDependents);
    }

    return allDependents;
  }

  /**
   * 按依赖顺序对单元格进行排序
   * @param formulaManager 公式管理器
   * @param cells 要排序的单元格
   * @returns 排序后的单元格
   */
  private sortCellsByDependencyOrder(formulaManager: FormulaManager, cells: FormulaCell[]): FormulaCell[] {
    // 创建一个依赖图
    const dependencyGraph = new Map<string, Set<string>>();

    // 为每个单元格构建依赖关系
    for (const cell of cells) {
      const cellKey = `${cell.sheet}!${cell.row},${cell.col}`;
      const precedents = formulaManager.getCellPrecedents(cell);

      const dependencies = new Set<string>();
      for (const precedent of precedents) {
        const precedentKey = `${precedent.sheet}!${precedent.row},${precedent.col}`;
        dependencies.add(precedentKey);
      }

      dependencyGraph.set(cellKey, dependencies);
    }

    // 使用拓扑排序确保依赖项先被处理
    const sorted: FormulaCell[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (cell: FormulaCell) => {
      const cellKey = `${cell.sheet}!${cell.row},${cell.col}`;

      if (visited.has(cellKey)) {
        return;
      }

      if (visiting.has(cellKey)) {
        // 检测到循环依赖，跳过
        console.warn('Circular dependency detected:', cellKey);
        return;
      }

      visiting.add(cellKey);

      // 先访问依赖项
      const dependencies = dependencyGraph.get(cellKey) || new Set();
      for (const depKey of Array.from(dependencies)) {
        const depCell = cells.find(c => `${c.sheet}!${c.row},${c.col}` === depKey);
        if (depCell) {
          visit(depCell);
        }
      }

      visiting.delete(cellKey);
      visited.add(cellKey);
      sorted.push(cell);
    };

    // 对所有单元格进行排序
    for (const cell of cells) {
      if (!visited.has(`${cell.sheet}!${cell.row},${cell.col}`)) {
        visit(cell);
      }
    }

    return sorted;
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

  release(): void {
    //do nothing
  }
}
