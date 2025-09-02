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
    const functionRegex = /^=([A-Za-z]+)\s*\(/i;
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

    // 如果光标正好在括号后面，也认为是参数位置
    if (cursorPosition === openParenIndex + 1) {
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

    // 找到当前光标所处的参数位置
    const argPosition = this.findCurrentArgumentPosition(currentValue, cursorPos);

    // 在函数参数位置插入或替换A1引用
    let newValue;
    if (argPosition) {
      // 替换模式：替换当前参数
      newValue = currentValue.slice(0, argPosition.start) + a1Notation + currentValue.slice(argPosition.end);
    } else {
      // 插入模式：使用原来的逻辑
      const beforeParam = currentValue.slice(0, this.functionParamPosition.start);
      const afterParam = currentValue.slice(this.functionParamPosition.end);

      const trimmedBefore = beforeParam.trimEnd();
      const trimmedAfter = afterParam.trimStart();

      const needsCommaBefore = trimmedBefore.length > 0 && !trimmedBefore.endsWith('(') && !trimmedBefore.endsWith(',');
      const needsCommaAfter = trimmedAfter.length > 0 && !trimmedAfter.startsWith(',') && !trimmedAfter.startsWith(')');

      newValue = beforeParam + (needsCommaBefore ? ',' : '') + a1Notation + (needsCommaAfter ? ',' : '') + afterParam;
    }

    formulaInput.value = newValue;

    // 设置光标位置到插入内容之后
    const newCursorPos = argPosition
      ? argPosition.start + a1Notation.length
      : this.functionParamPosition.start + a1Notation.length + (needsCommaBefore ? 1 : 0);

    formulaInput.setSelectionRange(newCursorPos, newCursorPos);

    // 更新函数参数位置
    this.functionParamPosition = {
      start: newCursorPos,
      end: newCursorPos
    };

    // 触发输入事件以更新高亮，但不触发公式计算
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
    let nestLevel = 0;
    let inQuote = false;
    let argumentStart = -1;
    let argumentEnd = -1;

    // 跳过公式开头的"="和函数名部分
    let i = formula.indexOf('(');
    if (i === -1) {
      return null;
    }

    nestLevel = 1; // 已经找到第一个左括号
    argumentStart = i + 1;

    // 从左括号后开始遍历
    for (i = argumentStart; i < formula.length; i++) {
      const char = formula[i];

      // 处理引号内的内容
      if (char === '"' && formula[i - 1] !== '\\') {
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
        // 如果到达了最外层的右括号，并且光标在这个范围内
        if (nestLevel === 0 && i >= cursorPos) {
          // 光标在参数内，返回光标位置
          argumentEnd = cursorPos;
          break;
        }
      } else if (char === ',' && nestLevel === 1) {
        // 如果是当前函数层级的参数分隔符
        if (i < cursorPos) {
          // 光标在这个逗号之后，更新参数开始位置
          argumentStart = i + 1;
        } else if (i >= cursorPos) {
          // 光标在这个逗号之前，设置参数结束位置为光标位置
          argumentEnd = cursorPos;
          break;
        }
      }
    }

    // 如果没找到结束位置但光标在公式内
    if (argumentEnd === -1 && cursorPos <= formula.length) {
      argumentEnd = cursorPos;
    }

    // 确保光标位置正确
    if (cursorPos >= argumentStart && cursorPos <= formula.length) {
      return {
        start: cursorPos, // 修正：始终返回光标位置作为开始位置
        end: cursorPos // 修正：始终返回光标位置作为结束位置
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
