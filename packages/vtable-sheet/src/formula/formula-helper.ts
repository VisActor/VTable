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
  const functionStart = match.index!;
  const openParenIndex = formula.indexOf('(', functionStart);

  // 检查是否是支持的函数
  if (!supportedFunctions.includes(functionName)) {
    return {
      inParamMode: false,
      functionParamPosition: null
    };
  }

  // 检查光标是否在函数参数位置
  if (cursorPosition > openParenIndex) {
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
