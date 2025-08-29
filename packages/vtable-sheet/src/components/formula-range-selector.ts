/**
 * 公式范围选择器
 * 实现Excel风格的公式输入体验：用户输入"=sum("后，选择单元格范围自动插入A1引用
 */

export interface FunctionParamPosition {
  start: number;
  end: number;
}

export class FormulaRangeSelector {
  private inRangeSelectionMode = false;
  private functionParamPosition: FunctionParamPosition | null = null;
  private supportedFunctions = [
    'SUM',
    'AVERAGE',
    'MAX',
    'MIN',
    'COUNT',
    'COUNTA',
    'IF',
    'AND',
    'OR',
    'NOT',
    'ROUND',
    'FLOOR',
    'CEILING',
    'ABS',
    'SQRT',
    'POWER',
    'MOD',
    'INT',
    'RAND',
    'TODAY',
    'NOW',
    'YEAR',
    'MONTH',
    'DAY',
    'HOUR',
    'MINUTE',
    'SECOND'
  ];

  /**
   * 检测函数参数位置
   * @param formula 公式内容
   * @param cursorPosition 光标位置
   * @returns 是否在函数参数位置
   */
  detectFunctionParameterPosition(formula: string, cursorPosition: number): boolean {
    if (!formula.startsWith('=')) {
      this.inRangeSelectionMode = false;
      this.functionParamPosition = null;
      return false;
    }

    // 匹配函数调用模式：=FUNCTION_NAME(
    const functionRegex = /^=([A-Z]+)\s*\(/i;
    const match = formula.match(functionRegex);

    if (!match) {
      this.inRangeSelectionMode = false;
      this.functionParamPosition = null;
      return false;
    }

    const functionName = match[1].toUpperCase();
    const functionStart = match.index!;
    const openParenIndex = formula.indexOf('(', functionStart);

    // 检查是否是支持的函数
    if (!this.supportedFunctions.includes(functionName)) {
      this.inRangeSelectionMode = false;
      this.functionParamPosition = null;
      return false;
    }

    // 检查光标是否在函数参数位置
    if (cursorPosition > openParenIndex) {
      this.inRangeSelectionMode = true;
      this.functionParamPosition = {
        start: openParenIndex + 1,
        end: cursorPosition
      };
      return true;
    }
    this.inRangeSelectionMode = false;
    this.functionParamPosition = null;
    return false;
  }

  /**
   * 检查是否在范围选择模式
   */
  isInRangeSelectionMode(): boolean {
    return this.inRangeSelectionMode;
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

      if (startAddr === endAddr) {
        ranges.push(startAddr);
      } else {
        ranges.push(`${startAddr}:${endAddr}`);
      }
    }

    return ranges.join(',');
  }

  /**
   * 在函数参数位置插入A1引用
   * @param formulaInput 公式输入框
   * @param a1Notation A1格式的单元格引用
   */
  insertA1ReferenceInFunction(formulaInput: HTMLInputElement, a1Notation: string): void {
    if (!this.functionParamPosition) {
      return;
    }

    const currentValue = formulaInput.value;
    const cursorPos = formulaInput.selectionStart || 0;

    // 在函数参数位置插入A1引用
    const beforeParam = currentValue.slice(0, this.functionParamPosition.start);
    const afterParam = currentValue.slice(this.functionParamPosition.end);

    // 是否需要在前后补逗号（避免首尾多余逗号）
    const trimmedBefore = beforeParam.trimEnd();
    const trimmedAfter = afterParam.trimStart();

    const needsCommaBefore = trimmedBefore.length > 0 && !trimmedBefore.endsWith('(') && !trimmedBefore.endsWith(',');

    const needsCommaAfter = trimmedAfter.length > 0 && !trimmedAfter.startsWith(',') && !trimmedAfter.startsWith(')');

    const newValue =
      beforeParam + (needsCommaBefore ? ',' : '') + a1Notation + (needsCommaAfter ? ',' : '') + afterParam;
    formulaInput.value = newValue;

    // 设置光标位置到插入内容之后
    const newCursorPos = this.functionParamPosition.start + (needsCommaBefore ? 1 : 0) + a1Notation.length;
    formulaInput.setSelectionRange(newCursorPos, newCursorPos);

    // 更新函数参数位置
    this.functionParamPosition = {
      start: newCursorPos,
      end: newCursorPos
    };

    // 触发输入事件以更新高亮
    formulaInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /**
   * 处理单元格选择变化
   * @param selections 当前选择范围
   * @param formulaInput 公式输入框
   * @param addressFromCoord 坐标转地址函数
   */
  handleSelectionChanged(
    selections: any[],
    formulaInput: HTMLInputElement,
    addressFromCoord: (row: number, col: number) => string
  ): void {
    if (!this.inRangeSelectionMode || !selections || selections.length === 0) {
      return;
    }

    const a1Notation = this.selectionsToA1Notation(selections, addressFromCoord);
    if (a1Notation) {
      this.insertA1ReferenceInFunction(formulaInput, a1Notation);
    }
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.inRangeSelectionMode = false;
    this.functionParamPosition = null;
  }
}
