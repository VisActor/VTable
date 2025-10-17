/**
 * 生成填充柄自动填充数据，引入big.js是为了处理大数填充的问题，防止溢出，引入lodash为了处理records中值为数字、文本的不同情况
 */
// @ts-ignore no need check
import Big from 'big.js';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import type { RowObject, RowData } from './translateRowObj';
import { translateRowArrayToObj, translateRowObjToArray } from './translateRowObj';
import type { TYPES } from '@visactor/vtable';

const bigFunc = (a: string | number, b: string | number, func: 'plus' | 'minus' | 'times' | 'div') => {
  if (typeof a !== 'number') {
    a = Number(a);
  }
  if (typeof b !== 'number') {
    b = Number(b);
  }
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new Error(`${func}(a, b), a or b is NaN`);
  }

  const bigA = new Big(a);
  return bigA[func](b).toNumber();
};
const add = (a: number | string = 0, b: number | string = 0) => bigFunc(a, b, 'plus');
const minus = (a: number | string = 0, b: number | string = 0) => bigFunc(a, b, 'minus');

/**
 * 将字符串拆为前缀，数字部分，后缀，方便填充柄的自增/减计算
 * @example
 *  splitOnLastNumber('ab12.4c') => ['ab', '12.4', 'c']
 *  splitOnLastNumber('ab12c') => ['ab', '12', 'c']
 *  splitOnLastNumber('abc') => ['abc']
 *  splitOnLastNumber('12abc') => ['','12','abc']
 * @param {string} str
 * @returns {string[]} [prefix, number, suffix]
 */
function splitOnLastNumber(str: string) {
  const regex = /((\d+)(\.\d+)?)(?!.*(\d+)(\.\d+)?)/;
  const match = str.match(regex);
  if (!match || match.index === undefined) {
    return [str];
  } // 无数字时返回原字符串

  const index = match.index;
  const number = match[0];
  const prefix = str.slice(0, index);
  const suffix = str.slice(index + number.length);

  return [prefix, number, suffix].filter(item => item !== '');
}

/**
 * 解析字符串为 prefix, number, suffix三个部分，如"ab12.4c" 将被解析为{ prefix: 'ab', number: 12.4, suffix: 'c', full: 'ab12.4c' }
 * @param {string} value - 需要解析的字符串
 * @returns {Object} { prefix, number, suffix, full }
 *  - prefix: 字符串前缀
 *  - number: 字符串中的数字部分，可能为null
 *  - suffix: 字符串后缀
 *  - full: 原始字符串
 */
const parseValue = (value: RowData) => {
  if (typeof value === 'number') {
    return { prefix: '', number: value, full: value };
  }
  const match = splitOnLastNumber(value);
  const numberIndex = match.findIndex(str => {
    return !isNaN(Number(str)) && str !== '' && !isNaN(parseFloat(str)) && isFinite(Number(str));
  });
  if (match.length === 1) {
    if (numberIndex === 0) {
      // "12"这种类型字符串
      return { prefix: '', number: Number(match[0]), suffix: '', full: value };
    }
    // "ab"这种类型字符串
    return { prefix: value, number: null, suffix: '', full: value };
  } else if (match.length > 1) {
    if (numberIndex === 0) {
      // "12abc"这种字符串
      return { prefix: '', number: Number(match[0]), suffix: match[1], full: value };
    }
    // “ab12.3”或者“ab12.3bc”这种字符串
    return { prefix: match[0], number: Number(match[1]), suffix: match?.[2], full: value };
  }
  return { prefix: null, number: null, suffix: null, full: value };
};

/**
 * VTable模仿excel填充柄
 * @param originalData 表格原始数据，可能为数组形式或者对象形式，比如[[dataIndex1,dataIndex2],[dataIndex1,dataIndex2]],[{dataIndex1,dataIndex2},{dataIndex3,dataIndex4}]
 * @param columns 列信息
 * @param startRange 填充柄选区
 * @param currentEnd 填充柄待填充终点
 * @returns 经填充柄填充后的数据
 */

export const generateAutoFillData = (
  originalData: RowObject[] | RowData[][],
  columns: TYPES.CellInfo[],
  startRange: { startRow: number; startCol: number; endRow: number; endCol: number }, // 初始选区 { startRow, startCol, endRow, endCol }
  currentEnd: { row: number; col: number } // 当前拖拽终点 { row, col },
) => {
  if (!originalData || originalData.length < startRange.endRow - 1) {
    return [];
  }
  // 深拷贝原始数据,并且将行数据转换为数组形式，方便后续处理
  let newData: RowData[][] = [];
  if (Array.isArray(originalData?.[0])) {
    newData = (originalData as RowData[][]).map(row => [...row]);
  } else if (columns.length && isObject(originalData?.[0])) {
    newData = translateRowObjToArray(originalData as RowObject[], columns);
  }
  if (!newData?.length) {
    return originalData;
  }

  // 方向计算
  const verticalDelta = currentEnd.row - startRange.endRow;
  const horizontalDelta = currentEnd.col - startRange.endCol;
  const isVertical = Math.abs(verticalDelta) >= Math.abs(horizontalDelta);
  const fillSteps = isVertical ? verticalDelta : horizontalDelta;

  // 样本数据提取
  const [sampleStartRow, sampleEndRow] = [startRange.startRow, startRange.endRow].sort((a, b) => a - b);
  const [sampleStartCol, sampleEndCol] = [startRange.startCol, startRange.endCol].sort((a, b) => a - b);
  const sampleValues = [];
  for (let r = sampleStartRow; r <= sampleEndRow; r++) {
    for (let c = sampleStartCol; c <= sampleEndCol; c++) {
      sampleValues.push(newData[r][c]);
    }
  }

  // 验证数字序列
  const samples = sampleValues.map(parseValue);
  const validSequence =
    samples.every(s => s.number !== null) &&
    samples.slice(1).every((s, i) => s.prefix === samples[i].prefix) &&
    samples.length < 3 &&
    !(samples.length === 2 && isEqual(samples[0], samples[1]));

  // 计算步长
  let step;
  if (samples.length === 1 && samples[0].number !== null) {
    step = 1;
  } else if (validSequence && samples.length > 1) {
    const numbers = samples.map(s => s.number);
    step = minus(numbers[numbers.length - 1], numbers[numbers.length - 2]);
  }
  // 边界检测
  const positionInEdges = (curPos: { row: number; col: number }) => {
    if (isVertical && verticalDelta > 0) {
      return curPos.row <= currentEnd.row;
    } else if (isVertical && verticalDelta < 0) {
      return curPos.row >= currentEnd.row;
    } else if (!isVertical && horizontalDelta > 0) {
      return curPos.col <= currentEnd.col;
    } else if (!isVertical && horizontalDelta < 0) {
      return curPos.col >= currentEnd.col;
    }
    return false;
  };

  // 执行填充
  const totalSteps = Math.abs(fillSteps);
  const direction = fillSteps > 0 ? 1 : -1;

  const sampLength = samples.length;
  if (samples.length === 1) {
    // 选中单个单元格的填充，有数字直接+1或-1，无数字直接复制文本
    const sample = samples[0];
    for (let i = 1; i <= totalSteps; i++) {
      const pos = {
        row: isVertical ? startRange.endRow + direction * i : startRange.startRow,
        col: isVertical ? startRange.startCol : startRange.endCol + direction * i
      };
      if (pos.row >= 0 && pos.col >= 0 && positionInEdges(pos)) {
        let tempRes = isNumber(sample.number)
          ? `${sample.prefix || ''}${(sample?.number || 0) + (direction > 0 ? i : -i)}${sample.suffix || ''}`
          : sample.full;
        if (isNumber(sample.full)) {
          tempRes = (sample?.number || 0) + (direction > 0 ? i : -i);
        }

        newData[pos.row][pos.col] = tempRes; // 直接复制最后一个值
      }
    }
  } else if (samples.length >= 2) {
    for (let i = 1; i <= totalSteps; i++) {
      let sample;
      const pos: { row: number; col: number } = { row: 0, col: 0 };
      if (direction === 1) {
        // 向下、向右填充计算位置和基准值
        pos.row = isVertical ? startRange.endRow + direction * i : startRange.endRow;
        pos.col = isVertical ? startRange.endCol : startRange.endCol + direction * i;
        sample = samples[(i - 1) % sampLength];
      } else {
        // 向上、向左填充计算位置和基准值
        pos.row = isVertical ? startRange.startRow + direction * i : startRange.startRow;
        pos.col = isVertical ? startRange.startCol : startRange.startCol + direction * i;
        sample = samples[Math.abs(sampLength - i) % sampLength];
      }
      if (pos.row >= 0 && pos.col >= 0 && positionInEdges(pos)) {
        let tempRes;
        if (isNumber(sample.full) || (Number(sample.full) === Number(sample.number) && sampLength === 2)) {
          const deltaLength = sampLength + Math.floor((i - 1) / sampLength) * sampLength;
          tempRes = add(sample?.number || 0, direction > 0 ? (step || 1) * deltaLength : -(step || 1) * deltaLength);
        } else {
          tempRes = validSequence
            ? `${sample.prefix || ''}${add(
                sample?.number || 0,
                direction > 0 ? (step || 1) * sampLength : -(step || 1) * sampLength
              )}${sample.suffix || ''}`
            : isNumber(sample?.number)
            ? `${sample.prefix || ''}${add(
                sample?.number || 0,
                direction > 0 ? Math.floor((i - 1) / sampLength) + 1 : -(Math.floor((i - 1) / sampLength) + 1)
              )}${sample.suffix || ''}`
            : sample.full; // 直接复制最后一个值
        }
        newData[pos.row][pos.col] = tempRes;
      }
    }
  }

  if (Array.isArray(originalData?.[0])) {
    return newData;
  }
  return translateRowArrayToObj(newData, columns);
};
