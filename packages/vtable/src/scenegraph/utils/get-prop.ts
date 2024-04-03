import { isValid } from '@visactor/vutils';
import type { StylePropertyFunctionArg } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function getProp(
  name: string,
  cellStyle: any,
  // commonStyle: any,
  col: number,
  row: number,
  _table: BaseTableAPI
) {
  const prop = cellStyle && isValid(cellStyle[name]) ? cellStyle[name] : undefined;
  // to do 处理回调函数
  if (typeof prop === 'function') {
    const arg: StylePropertyFunctionArg = {
      col,
      row,
      table: _table,
      value: _table.getCellValue(col, row),
      dataValue: _table.getCellOriginValue(col, row),
      cellHeaderPaths: _table.getCellHeaderPaths(col, row)
    };
    return prop(arg);
  }
  return prop;
}

export function getRawProp(
  name: string,
  cellStyle: any,
  // commonStyle: any,
  col: number,
  row: number,
  _table: BaseTableAPI
) {
  const prop = cellStyle && isValid(cellStyle[name]) ? cellStyle[name] : undefined;
  if (typeof prop === 'function') {
    return undefined;
  }
  return prop;
}

export function getFunctionalProp(
  name: string,
  cellStyle: any,
  // commonStyle: any,
  col: number,
  row: number,
  _table: BaseTableAPI
) {
  const prop = cellStyle && isValid(cellStyle[name]) ? cellStyle[name] : undefined;
  if (typeof prop === 'function') {
    const arg: StylePropertyFunctionArg = {
      col,
      row,
      table: _table,
      value: _table.getCellValue(col, row),
      dataValue: _table.getCellOriginValue(col, row),
      cellHeaderPaths: _table.getCellHeaderPaths(col, row)
    };
    return prop(arg);
  }
  return undefined;
}
