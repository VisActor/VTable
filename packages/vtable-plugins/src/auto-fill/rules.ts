/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IAutoFillRule, ICellData, Nullable } from './types';

import {
  chineseToNumber,
  fillChnNumber,
  fillChnWeek,
  fillCopy,
  fillExtendNumber,
  fillLoopSeries,
  fillSeries,
  getLoopSeriesInfo,
  isChnNumber,
  isChnWeek2,
  isChnWeek3,
  isEqualDiff,
  isLoopSeries,
  matchExtendNumber
} from './utils/fill';
import { APPLY_TYPE, DATA_TYPE, Direction } from './types';
import { converterManager, DateConverter } from './series-converters';
import { CellValueType } from './types';
export const dateRule: IAutoFillRule = {
  type: DATA_TYPE.DATE,
  priority: 1100,
  match: (cellData: any, accessor: any) => {
    return typeof cellData?.v === 'string' && converterManager.getConverter(cellData.v) instanceof DateConverter;
  },
  isContinue: (prev: any, cur: any) => {
    if (prev.type === DATA_TYPE.DATE) {
      return true;
    }
    return false;
  },
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;
      const converter = converterManager.getConverter(data[0]?.v);
      if (direction === Direction.LEFT || direction === Direction.UP) {
        data.reverse();
        return fillSeries(data, len, direction, converter).reverse();
      }
      return fillSeries(data, len, direction, converter);
    }
  }
};

export const numberRule: IAutoFillRule = {
  type: DATA_TYPE.NUMBER,
  priority: 1000,
  match: (cellData: any) => typeof cellData?.v === 'number' || cellData?.t === CellValueType.NUMBER,
  isContinue: (prev: any, cur: any) => {
    if (prev.type === DATA_TYPE.NUMBER) {
      return true;
    }
    return false;
  },
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;
      if (direction === Direction.LEFT || direction === Direction.UP) {
        data.reverse();
        return fillSeries(data, len, direction).reverse();
      }
      return fillSeries(data, len, direction);
    }
  }
};

export const otherRule: IAutoFillRule = {
  type: DATA_TYPE.OTHER,
  priority: 0,
  match: () => true,
  isContinue: (prev: any, cur: any) => {
    if (prev.type === DATA_TYPE.OTHER) {
      return true;
    }
    return false;
  }
};

export const extendNumberRule: IAutoFillRule = {
  type: DATA_TYPE.EXTEND_NUMBER,
  priority: 900,
  match: cellData => matchExtendNumber(`${(cellData as any)?.v ?? ''}` || '').isExtendNumber,
  isContinue: (prev: any, cur: any) => {
    if (prev.type === DATA_TYPE.EXTEND_NUMBER) {
      const { beforeTxt, afterTxt } = matchExtendNumber(`${(prev.cellData as any)?.v ?? ''}` || '');
      const { beforeTxt: curBeforeTxt, afterTxt: curAfterTxt } = matchExtendNumber(`${(cur as any)?.v ?? ''}` || '');
      if (beforeTxt === curBeforeTxt && afterTxt === curAfterTxt) {
        return true;
      }
    }
    return false;
  },
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;
      const isReverse = direction === Direction.UP || direction === Direction.LEFT;

      let step;
      if (data.length === 1) {
        step = isReverse ? -1 : 1;
        return reverseIfNeed(fillExtendNumber(data, len, step), isReverse);
      }
      const dataNumArr = [];

      for (let i = 0; i < data.length; i++) {
        const txt = `${data[i]?.v}`;
        txt && dataNumArr.push(Number(matchExtendNumber(txt).matchTxt));
      }

      if (isReverse) {
        data.reverse();
        dataNumArr.reverse();
      }

      if (isEqualDiff(dataNumArr)) {
        step = dataNumArr[1] - dataNumArr[0];
        return reverseIfNeed(fillExtendNumber(data, len, step), isReverse);
      }
      return fillCopy(data, len);
    }
  }
};

export const chnNumberRule: IAutoFillRule = {
  type: DATA_TYPE.CHN_NUMBER,
  priority: 830,
  match: cellData => {
    if (isChnNumber(`${(cellData as any)?.v ?? ''}` || '')) {
      return true;
    }
    return false;
  },
  isContinue: (prev: any, cur: any) => {
    if (prev.type === DATA_TYPE.CHN_NUMBER) {
      return true;
    }
    return false;
  },
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;

      const isReverse = direction === Direction.LEFT || direction === Direction.UP;
      if (data.length === 1) {
        let step;
        if (!isReverse) {
          step = 1;
        } else {
          step = -1;
        }
        return reverseIfNeed(fillChnNumber(data, len, step), isReverse);
      }
      let hasWeek = false;
      for (let i = 0; i < data.length; i++) {
        const formattedValue = data[i]?.v;

        if (formattedValue === '日') {
          hasWeek = true;
          break;
        }
      }

      const dataNumArr = [];
      let weekIndex = 0;
      for (let i = 0; i < data.length; i++) {
        const formattedValue = `${data[i]?.v}`;
        if (formattedValue === '日') {
          if (i === 0) {
            dataNumArr.push(0);
          } else {
            weekIndex++;
            dataNumArr.push(weekIndex * 7);
          }
        } else if (hasWeek && chineseToNumber(formattedValue) > 0 && chineseToNumber(formattedValue) < 7) {
          dataNumArr.push(chineseToNumber(formattedValue) + weekIndex * 7);
        } else {
          dataNumArr.push(chineseToNumber(formattedValue));
        }
      }

      if (isReverse) {
        data.reverse();
        dataNumArr.reverse();
      }

      if (isEqualDiff(dataNumArr)) {
        // Always fill with sequence of Chinese lowercase numbers
        const step = dataNumArr[1] - dataNumArr[0];
        return reverseIfNeed(fillChnNumber(data, len, step), isReverse);
      }
      // Not an arithmetic progression, copy data
      return fillCopy(data, len);
    }
  }
};

export const chnWeek2Rule: IAutoFillRule = {
  type: DATA_TYPE.CHN_WEEK2,
  priority: 820,
  match: cellData => {
    if (isChnWeek2(`${(cellData as any)?.v ?? ''}` || '')) {
      return true;
    }
    return false;
  },
  isContinue: (prev: any, cur: any) => prev.type === DATA_TYPE.CHN_WEEK2,
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;

      const isReverse = direction === Direction.LEFT || direction === Direction.UP;
      if (data.length === 1) {
        let step;
        if (!isReverse) {
          step = 1;
        } else {
          step = -1;
        }

        return reverseIfNeed(fillChnWeek(data, len, step, 1), isReverse);
      }
      const dataNumArr = [];
      let weekIndex = 0;

      for (let i = 0; i < data.length; i++) {
        const formattedValue = `${data[i]?.v}`;
        const lastTxt = formattedValue?.substr(formattedValue.length - 1, 1);
        if (formattedValue === '周日') {
          if (i === 0) {
            dataNumArr.push(0);
          } else {
            weekIndex++;
            dataNumArr.push(weekIndex * 7);
          }
        } else {
          dataNumArr.push(chineseToNumber(lastTxt) + weekIndex * 7);
        }
      }

      if (isReverse) {
        data.reverse();
        dataNumArr.reverse();
      }

      if (isEqualDiff(dataNumArr)) {
        const step = dataNumArr[1] - dataNumArr[0];
        return reverseIfNeed(fillChnWeek(data, len, step, 1), isReverse);
      }
      return fillCopy(data, len);
    }
  }
};

export const chnWeek3Rule: IAutoFillRule = {
  type: DATA_TYPE.CHN_WEEK3,
  priority: 810,
  match: cellData => isChnWeek3(`${(cellData as any)?.v ?? ''}` || ''),
  isContinue: (prev: any, cur: any) => prev.type === DATA_TYPE.CHN_WEEK3,
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;

      const isReverse = direction === Direction.LEFT || direction === Direction.UP;
      if (data.length === 1) {
        let step;
        if (!isReverse) {
          step = 1;
        } else {
          step = -1;
        }

        return reverseIfNeed(fillChnWeek(data, len, step, 2), isReverse);
      }
      const dataNumArr = [];
      let weekIndex = 0;

      for (let i = 0; i < data.length; i++) {
        const formattedValue = `${data[i]?.v}`;
        if (formattedValue) {
          const lastTxt = formattedValue.substr(formattedValue.length - 1, 1);
          if (formattedValue === '星期日') {
            if (i === 0) {
              dataNumArr.push(0);
            } else {
              weekIndex++;
              dataNumArr.push(weekIndex * 7);
            }
          } else {
            dataNumArr.push(chineseToNumber(lastTxt) + weekIndex * 7);
          }
        }
      }

      if (isReverse) {
        data.reverse();
        dataNumArr.reverse();
      }

      if (isEqualDiff(dataNumArr)) {
        const step = dataNumArr[1] - dataNumArr[0];
        return reverseIfNeed(fillChnWeek(data, len, step, 2), isReverse);
      }
      return fillCopy(data, len);
    }
  }
};

export const loopSeriesRule: IAutoFillRule = {
  type: DATA_TYPE.LOOP_SERIES,
  priority: 800,
  match: cellData => isLoopSeries(`${(cellData as any)?.v ?? ''}` || ''),
  isContinue: (prev: any, cur: any) => {
    if (prev.type === DATA_TYPE.LOOP_SERIES) {
      return (
        getLoopSeriesInfo(`${(prev.cellData as any)?.v ?? ''}` || '').name ===
        getLoopSeriesInfo(`${(cur as any)?.v ?? ''}` || '').name
      );
    }
    return false;
  },
  applyFunctions: {
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any) => {
      const { data } = dataWithIndex;
      const isReverse = direction === Direction.LEFT || direction === Direction.UP;
      const { series } = getLoopSeriesInfo(`${data[0]?.v}` || '');
      if (data.length === 1) {
        let step;
        if (!isReverse) {
          step = 1;
        } else {
          step = -1;
        }

        return reverseIfNeed(fillLoopSeries(data, len, step, series), isReverse);
      }
      const dataNumArr = [];
      let cycleIndex = 0;
      for (let i = 0; i < data.length; i++) {
        const formattedValue = `${data[i]?.v}`;
        if (formattedValue) {
          if (formattedValue === series[0]) {
            if (i === 0) {
              dataNumArr.push(0);
            } else {
              cycleIndex++;
              dataNumArr.push(cycleIndex * series.length);
            }
          } else {
            dataNumArr.push(series.indexOf(formattedValue) + cycleIndex * 7);
          }
        }
      }

      if (isReverse) {
        data.reverse();
        dataNumArr.reverse();
      }

      if (isEqualDiff(dataNumArr)) {
        const step = dataNumArr[1] - dataNumArr[0];
        return reverseIfNeed(fillLoopSeries(data, len, step, series), isReverse);
      }
      return fillCopy(data, len);
    }
  }
};

export function reverseIfNeed<T>(data: T[], reverse: boolean): T[] {
  return reverse ? data.reverse() : data;
}

export const formulaRule: IAutoFillRule = {
  type: DATA_TYPE.FORMULA,
  priority: 1200,
  match: (cellData: any, accessor: any) => {
    // Check if cell contains a formula (starts with =)
    return typeof cellData?.v === 'string' && cellData.v.startsWith('=');
  },
  isContinue: (prev: any, cur: any) => {
    // Continue if both are formulas
    if (prev.type === DATA_TYPE.FORMULA && cur?.v?.startsWith('=')) {
      return true;
    }
    return false;
  },
  applyFunctions: {
    [APPLY_TYPE.COPY]: (dataWithIndex: any, len: any, direction: any, copyDataPiece: any, location?: any) => {
      const { data } = dataWithIndex;
      return fillCopy(data, len);
    },
    [APPLY_TYPE.SERIES]: (dataWithIndex: any, len: any, direction: any, copyDataPiece: any, location?: any) => {
      const { data } = dataWithIndex;

      // For formulas, series fill means adjusting cell references
      if (data.length === 1) {
        // Single formula - adjust references based on direction
        return adjustFormulaReferences(data, len, direction, location);
      }

      // Multiple formulas - check if they follow a pattern
      const adjustedFormulas = adjustFormulaReferencesInSeries(data, len, direction, location);
      if (adjustedFormulas) {
        return adjustedFormulas;
      }

      // If no clear pattern, fall back to copy
      return fillCopy(data, len);
    }
  }
};

/**
 * Adjust formula cell references for auto-fill
 */
function adjustFormulaReferences(
  formulas: any[],
  len: number,
  direction: Direction,
  location?: any
): Array<Nullable<ICellData>> {
  const result: Array<Nullable<ICellData>> = [];
  const baseFormula = formulas[0]?.v || '';

  for (let i = 0; i < len; i++) {
    let newFormula = baseFormula;

    // Calculate offset based on direction and position
    let rowOffset = 0;
    let colOffset = 0;

    switch (direction) {
      case Direction.DOWN:
        rowOffset = i + 1;
        break;
      case Direction.UP:
        rowOffset = -(i + 1);
        break;
      case Direction.RIGHT:
        colOffset = i + 1;
        break;
      case Direction.LEFT:
        colOffset = -(i + 1);
        break;
    }

    // Adjust cell references in formula
    newFormula = adjustCellReferencesInFormula(baseFormula, rowOffset, colOffset);

    result.push({
      v: newFormula,
      t: formulas[0]?.t
    });
  }

  return result;
}

/**
 * Adjust formula references in a series pattern
 */
function adjustFormulaReferencesInSeries(
  formulas: any[],
  len: number,
  direction: Direction,
  location?: any
): Array<Nullable<ICellData>> | null {
  if (formulas.length < 2) {
    return null;
  }

  // Extract and analyze the pattern in existing formulas
  const baseFormula1 = formulas[0]?.v || '';
  const baseFormula2 = formulas[1]?.v || '';

  // Try to detect the pattern difference
  const pattern = detectFormulaPattern(baseFormula1, baseFormula2);
  if (!pattern) {
    return null;
  }

  const result: Array<Nullable<ICellData>> = [];

  // Generate formulas following the detected pattern
  for (let i = 0; i < len; i++) {
    let newFormula = baseFormula1;

    // Apply pattern multiplier based on position
    const multiplier = i + 1;
    newFormula = applyFormulaPattern(newFormula, pattern, multiplier, direction);

    result.push({
      v: newFormula,
      t: formulas[0]?.t
    });
  }

  return result;
}

/**
 * Detect the pattern between two formulas
 */
function detectFormulaPattern(formula1: string, formula2: string): { rowOffset: number; colOffset: number } | null {
  // Simple pattern detection - look for cell reference differences
  const cellRefRegex = /\$?([A-Z]+)\$?(\d+)/g;
  const matches1 = [...formula1.matchAll(cellRefRegex)];
  const matches2 = [...formula2.matchAll(cellRefRegex)];

  if (matches1.length !== matches2.length || matches1.length === 0) {
    return null;
  }

  // Calculate average offset
  let totalRowOffset = 0;
  let totalColOffset = 0;
  let validMatches = 0;

  for (let i = 0; i < matches1.length; i++) {
    const col1 = matches1[i][1];
    const row1 = parseInt(matches1[i][2], 10);
    const col2 = matches2[i][1];
    const row2 = parseInt(matches2[i][2], 10);

    const colOffset = columnToNumber(col2) - columnToNumber(col1);
    const rowOffset = row2 - row1;

    if (Math.abs(colOffset) < 100 && Math.abs(rowOffset) < 10000) {
      // Sanity check
      totalColOffset += colOffset;
      totalRowOffset += rowOffset;
      validMatches++;
    }
  }

  if (validMatches === 0) {
    return null;
  }

  return {
    rowOffset: totalRowOffset / validMatches,
    colOffset: totalColOffset / validMatches
  };
}

/**
 * Apply pattern to formula
 */
function applyFormulaPattern(
  formula: string,
  pattern: { rowOffset: number; colOffset: number },
  multiplier: number,
  direction: Direction
): string {
  const cellRefRegex = /\$?([A-Z]+)\$?(\d+)/g;

  return formula.replace(cellRefRegex, (match, colStr, rowStr) => {
    const isColAbsolute = match.startsWith('$') && match.indexOf(colStr) > 0;
    const isRowAbsolute = match.includes('$' + rowStr);

    let newCol = colStr;
    let newRow = rowStr;

    if (!isColAbsolute && pattern.colOffset !== 0) {
      const colNum = columnToNumber(colStr);
      const newColNum = colNum + pattern.colOffset * multiplier;
      newCol = numberToColumn(newColNum);
    }

    if (!isRowAbsolute && pattern.rowOffset !== 0) {
      const rowNum = parseInt(rowStr, 10);
      const newRowNum = rowNum + pattern.rowOffset * multiplier;
      newRow = newRowNum.toString();
    }

    // Reconstruct reference with original absolute references preserved
    let result = '';
    if (isColAbsolute) {
      result += '$';
    }
    result += newCol;
    if (isRowAbsolute) {
      result += '$';
    }
    result += newRow;

    return result;
  });
}

/**
 * Adjust cell references in formula
 */
function adjustCellReferencesInFormula(formula: string, rowOffset: number, colOffset: number): string {
  const cellRefRegex = /\$?([A-Z]+)\$?(\d+)/g;

  return formula.replace(cellRefRegex, (match, colStr, rowStr) => {
    const isColAbsolute = match.startsWith('$') && match.indexOf(colStr) > 0;
    const isRowAbsolute = match.includes('$' + rowStr);

    let newCol = colStr;
    let newRow = rowStr;

    if (!isColAbsolute && colOffset !== 0) {
      const colNum = columnToNumber(colStr);
      const newColNum = colNum + colOffset;
      newCol = numberToColumn(newColNum);
    }

    if (!isRowAbsolute && rowOffset !== 0) {
      const rowNum = parseInt(rowStr, 10);
      const newRowNum = rowNum + rowOffset;
      newRow = newRowNum.toString();
    }

    // Reconstruct reference with original absolute references preserved
    let result = '';
    if (isColAbsolute) {
      result += '$';
    }
    result += newCol;
    if (isRowAbsolute) {
      result += '$';
    }
    result += newRow;

    return result;
  });
}

/**
 * Convert column letter to number (A=1, B=2, etc.)
 */
function columnToNumber(col: string): number {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return result;
}

/**
 * Convert column number to letter (1=A, 2=B, etc.)
 */
function numberToColumn(num: number): string {
  let result = '';
  while (num > 0) {
    num--;
    result = String.fromCharCode('A'.charCodeAt(0) + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}
