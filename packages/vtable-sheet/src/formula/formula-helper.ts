export const supportedFunctions = [
  'SUM',
  'AVERAGE',
  'MAX',
  'MIN',
  'COUNT',
  'COUNTA',
  'STDEV',
  'VAR',
  'MEDIAN',
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
 * 查找匹配的右括号
 * @param formula 公式内容
 * @param openParenIndex 左括号的位置
 * @returns 匹配的右括号位置，若未找到则返回-1
 */
function findMatchingCloseParen(formula: string, openParenIndex: number): number {
  let depth = 1; // 括号深度计数

  for (let i = openParenIndex + 1; i < formula.length; i++) {
    if (formula[i] === '(') {
      depth++;
    } else if (formula[i] === ')') {
      depth--;
      if (depth === 0) {
        return i; // 找到匹配的右括号
      }
    }
  }

  return -1; // 未找到匹配的右括号
}

/**
 * 检测函数参数位置
 * @param formula 公式内容
 * @param cursorPosition 光标位置
 * @returns 是否在函数参数位置
 */
export function detectFunctionParameterPosition(
  formula: string,
  cursorPosition: number
): {
  inParamMode: boolean;
  functionParamPosition: {
    start: number;
    end: number;
  } | null;
} {
  // 基本检查
  if (!formula.startsWith('=')) {
    return {
      inParamMode: false,
      functionParamPosition: null
    };
  }

  // 1. 先检查是否在函数参数位置
  // 匹配所有函数调用模式：FUNCTION_NAME(
  const functionRegex = /([A-Za-z]+)\s*\(/g;
  let match;
  let positionBeforeCursor = -1;

  // 查找距离光标最近的左括号
  while ((match = functionRegex.exec(formula)) !== null) {
    const functionName = match[1].toUpperCase();
    const functionStart = match.index;
    const openParenIndex = formula.indexOf('(', functionStart);

    // 如果光标在函数名之后，且这个函数比之前找到的更接近光标
    if (openParenIndex < cursorPosition && openParenIndex > positionBeforeCursor) {
      // 查找对应的右括号位置
      const closeParenIndex = findMatchingCloseParen(formula, openParenIndex);

      // 检查光标是否在函数参数位置（在左括号之后且在右括号之前或没有找到右括号）
      if (cursorPosition > openParenIndex && (closeParenIndex === -1 || cursorPosition <= closeParenIndex)) {
        return {
          inParamMode: true,
          functionParamPosition: {
            start: openParenIndex + 1,
            end: cursorPosition
          }
        };
      }

      // 如果光标正好在括号后面，也认为是参数位置
      if (cursorPosition === openParenIndex + 1) {
        return {
          inParamMode: true,
          functionParamPosition: {
            start: openParenIndex + 1,
            end: cursorPosition
          }
        };
      }

      // 记录这个左括号位置，用于比较
      positionBeforeCursor = openParenIndex;
    }
  }

  // 2. 检查是否在操作符后面 - 也将此视为函数参数模式
  if (cursorPosition > 1 && cursorPosition <= formula.length) {
    const prevChar = formula[cursorPosition - 1];
    if (['+', '-', '*', '/', '=', '>', '<', '&', '|', '^', '(', ','].includes(prevChar)) {
      return {
        inParamMode: true,
        functionParamPosition: {
          start: cursorPosition,
          end: cursorPosition
        }
      };
    }
  }

  // 3. 检查是否在公式开始位置 - 公式开始后也视为可能需要函数输入
  if (cursorPosition === 1 && formula[0] === '=') {
    return {
      inParamMode: true,
      functionParamPosition: {
        start: cursorPosition,
        end: cursorPosition
      }
    };
  }

  // 默认情况，不在任何特殊位置
  return {
    inParamMode: false,
    functionParamPosition: null
  };
}
