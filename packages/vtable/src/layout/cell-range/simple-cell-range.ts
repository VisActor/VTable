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

  const table: any = layout._table;
  const internalProps = table.internalProps || {};
  const isGroupMode = !!internalProps.groupBy;
  const cellRecord = table.getCellRawRecord(col, row);

  if (!cellRecord?.vtableMerge) {
    return;
  }

  const treeTitleStartCol =
    internalProps.groupTitleCheckbox && internalProps.rowSeriesNumber
      ? layout.rowHeaderLevelCount + layout.leftRowSeriesNumberColumnCount
      : layout.rowHeaderLevelCount;
  if (col < treeTitleStartCol) {
    return;
  }
  cellRange.start.col = treeTitleStartCol;
  cellRange.end.col = layout.colCount - 1;
  cellRange.start.row = cellRange.end.row = row;

  // 特殊处理：分组模式下且仅有一列数据列时，分组标题行本质上仍应视为“整行合并”
  // 为了在这种情况下正确展示分组标题文本（尤其是 vtableMerge/vtableMergeName 与 groupTitleFieldFormat），
  // 这里在源记录上补充该单列对应字段的值，避免依赖多列合并逻辑。
  if (isGroupMode && layout.columnObjects?.length === 1) {
    const onlyColumn = layout.columnObjects[0];
    const field = onlyColumn?.field;
    if (field != null) {
      let text = cellRecord.vtableMergeName;
      const groupTitleFieldFormat = internalProps.groupTitleFieldFormat;
      if (typeof groupTitleFieldFormat === 'function') {
        text = groupTitleFieldFormat(cellRecord, col, row, table);
      }
      const current = (cellRecord as any)[field as any];
      if (current == null && text != null) {
        (cellRecord as any)[field as any] = text;
      }
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
