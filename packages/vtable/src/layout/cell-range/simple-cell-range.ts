import type { CellRange, TextColumnDefine } from '../../ts-types';
import type { SimpleHeaderLayoutMap } from '../simple-header-layout';

export function getCellRange(col: number, row: number, layout: SimpleHeaderLayoutMap): CellRange {
  if (col === -1 || row === -1) {
    return {
      start: { col, row },
      end: { col, row }
    };
  }
  if (layout._cellRangeMap.has(`$${col}$${row}`)) {
    return layout._cellRangeMap.get(`$${col}$${row}`);
  }
  let cellRange: CellRange = { start: { col, row }, end: { col, row } };
  if (layout.transpose) {
    cellRange = getCellRangeTranspose(col, row, layout);
  } else {
    // hover相关的单元格位置是-1,-1，getCellRange计算有误，先进行判断
    if (layout.headerLevelCount <= row) {
      //如果是body部分 设置了需要合并单元格 这里判断上下是否内容相同 相同的话 将cellRange范围扩大
      if (
        layout.headerLevelCount <= row &&
        (layout.columnObjects[col - layout.leftRowSeriesNumberColumnCount]?.define as TextColumnDefine)?.mergeCell
      ) {
        const value = layout._table.getCellValue(col, row);
        for (let r = row - 1; r >= layout.headerLevelCount; r--) {
          const last_Value = layout._table.getCellValue(col, r);
          if (typeof layout.columnObjects[col - layout.leftRowSeriesNumberColumnCount].define.mergeCell === 'boolean') {
            if (value !== last_Value) {
              break;
            }
          } else {
            if (
              !(layout.columnObjects[col - layout.leftRowSeriesNumberColumnCount].define.mergeCell as Function)(
                value,
                last_Value,
                {
                  source: {
                    col,
                    row
                  },
                  target: {
                    col,
                    row: r
                  },
                  table: layout._table
                }
              )
            ) {
              break;
            }
          }
          cellRange.start.row = r;
        }
        for (let r = row + 1; r < layout.rowCount; r++) {
          const next_Value = layout._table.getCellValue(col, r);
          if (typeof layout.columnObjects[col - layout.leftRowSeriesNumberColumnCount].define.mergeCell === 'boolean') {
            if (value !== next_Value) {
              break;
            }
          } else {
            if (
              !(layout.columnObjects[col - layout.leftRowSeriesNumberColumnCount].define.mergeCell as Function)(
                value,
                next_Value,
                {
                  source: {
                    col,
                    row
                  },
                  target: {
                    col,
                    row: r
                  },
                  table: layout._table
                }
              )
            ) {
              break;
            }
          }
          cellRange.end.row = r;
        }
      }
      getTreeTitleMerge(col, row, cellRange, layout);
      // return cellRange;
    } else {
      //in header
      const id = layout.getCellId(col, row);
      for (let c = col - 1; c >= 0; c--) {
        if (id !== layout.getCellId(c, row)) {
          break;
        }
        cellRange.start.col = c;
      }
      for (let c = col + 1; c < (layout.colCount ?? 0); c++) {
        if (id !== layout.getCellId(c, row)) {
          break;
        }
        cellRange.end.col = c;
      }
      for (let r = row - 1; r >= 0; r--) {
        if (id !== layout.getCellId(col, r)) {
          break;
        }
        cellRange.start.row = r;
      }
      for (let r = row + 1; r < layout.headerLevelCount; r++) {
        if (id !== layout.getCellId(col, r)) {
          break;
        }
        cellRange.end.row = r;
      }
      // return cellRange;
    }
  }
  layout._cellRangeMap.set(`$${col}$${row}`, cellRange);
  return cellRange;
}

function getTreeTitleMerge(col: number, row: number, cellRange: CellRange, layout: SimpleHeaderLayoutMap) {
  if (layout.rowHierarchyType !== 'tree') {
    return;
  }

  const cellRecord = layout._table.getCellRawRecord(col, row);
  if (layout._table.internalProps.rowSeriesNumber?.enableTreeCheckbox) {
    if (cellRecord?.vtableMerge && col >= layout.leftRowSeriesNumberColumnCount) {
      cellRange.start.col = layout.rowHeaderLevelCount + layout.leftRowSeriesNumberColumnCount;
      cellRange.end.col = layout.colCount - 1;
      cellRange.start.row = cellRange.end.row = row;
    }
  } else {
    if (cellRecord?.vtableMerge) {
      cellRange.start.col = layout.rowHeaderLevelCount;
      cellRange.end.col = layout.colCount - 1;
      cellRange.start.row = cellRange.end.row = row;
    }
  }
}

export function getCellRangeTranspose(col: number, row: number, layout: SimpleHeaderLayoutMap): CellRange {
  const result: CellRange = { start: { col, row }, end: { col, row } };
  // hover相关的单元格位置是-1,-1，getCellRange计算有误，先进行判断
  if (layout.headerLevelCount + layout.leftRowSeriesNumberColumnCount <= col || (col === -1 && row === -1)) {
    //如果是body部分 设置了需要合并单元格 这里判断左右是否内容相同 相同的话 将cellRange范围扩大
    if (
      layout.headerLevelCount + layout.leftRowSeriesNumberColumnCount <= col &&
      layout.columnObjects[row]?.define?.mergeCell
    ) {
      const value = layout._table.getCellValue(col, row);
      for (let c = col - 1; c >= layout.headerLevelCount + layout.leftRowSeriesNumberColumnCount; c--) {
        const last_Value = layout._table.getCellValue(c, row);
        if (typeof layout.columnObjects[row].define.mergeCell === 'boolean') {
          if (value !== last_Value) {
            break;
          }
        } else {
          if (
            !(layout.columnObjects[row].define.mergeCell as Function)(value, last_Value, {
              source: {
                col,
                row
              },
              target: {
                col: c,
                row
              },
              table: layout._table
            })
          ) {
            break;
          }
        }
        result.start.col = c;
      }
      for (let c = col + 1; c < (layout.colCount ?? 0); c++) {
        const next_Value = layout._table.getCellValue(c, row);
        if (typeof layout.columnObjects[row].define.mergeCell === 'boolean') {
          if (value !== next_Value) {
            break;
          }
        } else {
          if (
            !(layout.columnObjects[row].define.mergeCell as Function)(value, next_Value, {
              source: {
                col,
                row
              },
              target: {
                col: c,
                row
              },
              table: layout._table
            })
          ) {
            break;
          }
        }
        result.end.col = c;
      }
    }
    return result;
  }
  //in header
  const id = layout.getCellId(col, row);
  for (let r = row - 1; r >= 0; r--) {
    if (id !== layout.getCellId(col, r)) {
      break;
    }
    result.start.row = r;
  }
  for (let r = row + 1; r < (layout.rowCount ?? 0); r++) {
    if (id !== layout.getCellId(col, r)) {
      break;
    }
    result.end.row = r;
  }
  for (let c = col - 1; c >= 0; c--) {
    if (id !== layout.getCellId(c, row)) {
      break;
    }
    result.start.col = c;
  }
  for (let c = col + 1; c < layout.headerLevelCount + layout.leftRowSeriesNumberColumnCount; c++) {
    if (id !== layout.getCellId(c, row)) {
      break;
    }
    result.end.col = c;
  }
  return result;
}
