import type { TYPES } from '@visactor/vtable';
export type RowData = number | string;
export type RowObject = Record<string, RowData>;
/**
 * 将 dataSource中的{field1:xx1,field2:xx2,field3:xx3} 转换成 [xx1,xx2,xx3]
 */
export function translateRowObjToArray(dataSource: RowObject[], columns: TYPES.CellInfo[]) {
  return dataSource.map(item => {
    return columns.map(column => {
      return item[column.field as string];
    });
  });
}

/**
 * 将 dataSource中的[xx1,xx2,xx3] 转换成 {field1:xx1,field2:xx2,field3:xx3}
 */
export function translateRowArrayToObj(dataSource: RowData[][], columns: TYPES.CellInfo[]) {
  return dataSource.map(item => {
    return columns.reduce((pre, cur, index) => {
      pre[cur.field as string] = item[index];
      return pre;
    }, {} as RowObject);
  });
}
