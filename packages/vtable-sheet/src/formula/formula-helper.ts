export const supportedFunctions = [
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
  if (!formula.startsWith('=')) {
    return {
      inParamMode: false,
      functionParamPosition: null
    };
  }

  // 匹配函数调用模式：=FUNCTION_NAME(
  const functionRegex = /^=([A-Za-z]+)\s*\(/i;
  const match = formula.match(functionRegex);

  if (!match) {
    return {
      inParamMode: false,
      functionParamPosition: null
    };
  }

  const functionName = match[1].toUpperCase();
  const functionStart = match.index ? match.index : 0;
  const openParenIndex = formula.indexOf('(', functionStart);

  // 查找对应的右括号位置
  const closeParenIndex = findMatchingCloseParen(formula, openParenIndex);

  // 检查是否是支持的函数
  if (!supportedFunctions.includes(functionName)) {
    return {
      inParamMode: false,
      functionParamPosition: null
    };
  }

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

  return {
    inParamMode: false,
    functionParamPosition: null
  };
}
