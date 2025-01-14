/* eslint-disable max-depth */
import type { ListTable } from '../ListTable';
import type { CachedDataSource } from '../data';
import { computeColWidth } from '../scenegraph/layout/compute-col-width';
import { computeRowHeight } from '../scenegraph/layout/compute-row-height';
import { isPromise } from '../tools/helper';
import { defaultOrderFn } from '../tools/util';
import type { SortState } from '../ts-types';
import { TABLE_EVENT_TYPE } from './TABLE_EVENT_TYPE';

/**
 * 更改单元格数据 会触发change_cell_value事件
 * @param col
 * @param row
 * @param value 更改后的值
 * @param workOnEditableCell 限制只能更改配置了编辑器的单元格值。快捷键paste这里配置的true，限制只能修改可编辑单元格值
 */
export function listTableChangeCellValue(
  col: number,
  row: number,
  value: string | number | null,
  workOnEditableCell: boolean,
  table: ListTable
) {
  if ((workOnEditableCell && table.isHasEditorDefine(col, row)) || workOnEditableCell === false) {
    const recordIndex = table.getRecordShowIndexByCell(col, row);
    const { field } = table.internalProps.layoutMap.getBody(col, row);
    const beforeChangeValue = table.getCellRawValue(col, row);
    const oldValue = table.getCellOriginValue(col, row);
    if (table.isHeader(col, row)) {
      table.internalProps.layoutMap.updateColumnTitle(col, row, value as string);
    } else {
      table.dataSource.changeFieldValue(value, recordIndex, field, col, row, table);
    }
    const range = table.getCellRange(col, row);
    //改变单元格的值后 聚合值做重新计算
    const aggregators = table.internalProps.layoutMap.getAggregatorsByCell(col, row);
    if (aggregators) {
      if (Array.isArray(aggregators)) {
        for (let i = 0; i < aggregators?.length; i++) {
          aggregators[i].recalculate();
        }
      } else {
        aggregators.recalculate();
      }
      const aggregatorCells = table.internalProps.layoutMap.getAggregatorCellAddress(
        range.start.col,
        range.start.row,
        range.end.col,
        range.end.row
      );
      for (let i = 0; i < aggregatorCells.length; i++) {
        const range = table.getCellRange(aggregatorCells[i].col, aggregatorCells[i].row);
        for (let sCol = range.start.col; sCol <= range.end.col; sCol++) {
          for (let sRow = range.start.row; sRow <= range.end.row; sRow++) {
            table.scenegraph.updateCellContent(sCol, sRow);
          }
        }
      }
    }

    // const cell_value = table.getCellValue(col, row);

    for (let sCol = range.start.col; sCol <= range.end.col; sCol++) {
      for (let sRow = range.start.row; sRow <= range.end.row; sRow++) {
        table.scenegraph.updateCellContent(sCol, sRow);
      }
    }
    if (table.widthMode === 'adaptive' || (table.autoFillWidth && table.getAllColsWidth() <= table.tableNoFrameWidth)) {
      if (table.internalProps._widthResizedColMap.size === 0) {
        //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
        table.scenegraph.recalculateColWidths();
      }
    } else if (!table.internalProps._widthResizedColMap.has(col)) {
      const oldWidth = table.getColWidth(col);
      const newWidth = computeColWidth(col, 0, table.rowCount - 1, table, false);
      if (newWidth !== oldWidth) {
        table.scenegraph.updateColWidth(col, newWidth - oldWidth);
      }
    }
    if (
      table.heightMode === 'adaptive' ||
      (table.autoFillHeight && table.getAllRowsHeight() <= table.tableNoFrameHeight)
    ) {
      if (table.internalProps._heightResizedRowMap.size === 0) {
        table.scenegraph.recalculateRowHeights();
      }
    } else if (table.isAutoRowHeight() && !table.internalProps._heightResizedRowMap.has(row)) {
      const oldHeight = table.getRowHeight(row);
      const newHeight = computeRowHeight(row, 0, table.colCount - 1, table);
      table.scenegraph.updateRowHeight(row, newHeight - oldHeight);
    }
    const changedValue = table.getCellOriginValue(col, row);
    if (oldValue !== changedValue) {
      table.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
        col,
        row,
        rawValue: beforeChangeValue,
        currentValue: oldValue,
        changedValue
      });
    }
    table.scenegraph.updateNextFrame();
  }
}
/**
 * 批量更新多个单元格的数据
 * @param col 粘贴数据的起始列号
 * @param row 粘贴数据的起始行号
 * @param values 多个单元格的数据数组
 * @param workOnEditableCell 是否仅更改可编辑单元格
 */
export function listTableChangeCellValues(
  startCol: number,
  startRow: number,
  values: (string | number)[][],
  workOnEditableCell: boolean,
  table: ListTable
) {
  let pasteColEnd = startCol;
  let pasteRowEnd = startRow;
  // const rowCount = values.length;
  //#region 提前组织好未更改前的数据
  const beforeChangeValues: (string | number)[][] = [];
  const oldValues: (string | number)[][] = [];
  let cellUpdateType: 'normal' | 'sort' | 'group';

  for (let i = 0; i < values.length; i++) {
    if (startRow + i > table.rowCount - 1) {
      break;
    }
    const rowValues = values[i];
    const rawRowValues: (string | number)[] = [];
    const oldRowValues: (string | number)[] = [];
    beforeChangeValues.push(rawRowValues);
    oldValues.push(oldRowValues);
    for (let j = 0; j < rowValues.length; j++) {
      if (startCol + j > table.colCount - 1) {
        break;
      }
      cellUpdateType = getCellUpdateType(startCol + j, startRow + i, table, cellUpdateType);
      const beforeChangeValue = table.getCellRawValue(startCol + j, startRow + i);
      rawRowValues.push(beforeChangeValue);
      const oldValue = table.getCellOriginValue(startCol + j, startRow + i);
      oldRowValues.push(oldValue);
    }
  }
  //#endregion
  for (let i = 0; i < values.length; i++) {
    if (startRow + i > table.rowCount - 1) {
      break;
    }
    pasteRowEnd = startRow + i;
    const rowValues = values[i];
    let thisRowPasteColEnd = startCol;
    for (let j = 0; j < rowValues.length; j++) {
      if (startCol + j > table.colCount - 1) {
        break;
      }
      thisRowPasteColEnd = startCol + j;
      let isCanChange = false;
      if (workOnEditableCell === false) {
        isCanChange = true;
      } else {
        if (table.isHasEditorDefine(startCol + j, startRow + i)) {
          const editor = table.getEditor(startCol + j, startRow + i);
          const oldValue = oldValues[i][j];
          const value = rowValues[j];
          const maybePromiseOrValue = editor?.validateValue?.(value, oldValue) ?? true;
          if (isPromise(maybePromiseOrValue)) {
            //TODO 处理promise的情况
            isCanChange = true;
          } else {
            isCanChange =
              maybePromiseOrValue === true ||
              maybePromiseOrValue === 'validate-exit' ||
              maybePromiseOrValue === 'invalidate-exit';
          }
        }
      }
      // if ((workOnEditableCell && table.isHasEditorDefine(startCol + j, startRow + i)) || workOnEditableCell === false) {
      if (isCanChange) {
        const value = rowValues[j];
        const recordIndex = table.getRecordShowIndexByCell(startCol + j, startRow + i);
        const { field } = table.internalProps.layoutMap.getBody(startCol + j, startRow + i);
        // const beforeChangeValue = table.getCellRawValue(startCol + j, startRow + i);
        // const oldValue = table.getCellOriginValue(startCol + j, startRow + i);
        const beforeChangeValue = beforeChangeValues[i][j];
        const oldValue = oldValues[i][j];
        if (table.isHeader(startCol + j, startRow + i)) {
          table.internalProps.layoutMap.updateColumnTitle(startCol + j, startRow + i, value as string);
        } else {
          table.dataSource.changeFieldValue(value, recordIndex, field, startCol + j, startRow + i, table);
        }
        const changedValue = table.getCellOriginValue(startCol + j, startRow + i);
        if (oldValue !== changedValue) {
          table.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
            col: startCol + j,
            row: startRow + i,
            rawValue: beforeChangeValue,
            currentValue: oldValue,
            changedValue
          });
        }
      }
    }
    pasteColEnd = Math.max(pasteColEnd, thisRowPasteColEnd);
  }

  // const cell_value = table.getCellValue(col, row);
  const startRange = table.getCellRange(startCol, startRow);
  const range = table.getCellRange(pasteColEnd, pasteRowEnd);

  //改变单元格的值后 聚合值做重新计算
  const aggregators = table.internalProps.layoutMap.getAggregatorsByCellRange(
    startRange.start.col,
    startRange.start.row,
    range.end.col,
    range.end.row
  );

  if (aggregators) {
    for (let i = 0; i < aggregators?.length; i++) {
      aggregators[i].recalculate();
    }

    if (cellUpdateType === 'normal') {
      const aggregatorCells = table.internalProps.layoutMap.getAggregatorCellAddress(
        startRange.start.col,
        startRange.start.row,
        range.end.col,
        range.end.row
      );
      for (let i = 0; i < aggregatorCells.length; i++) {
        const range = table.getCellRange(aggregatorCells[i].col, aggregatorCells[i].row);
        for (let sCol = range.start.col; sCol <= range.end.col; sCol++) {
          for (let sRow = range.start.row; sRow <= range.end.row; sRow++) {
            table.scenegraph.updateCellContent(sCol, sRow);
          }
        }
      }
    }
  }

  if (cellUpdateType === 'group') {
    (table.dataSource as CachedDataSource).updateRecordsForGroup([], []);
  }

  if (cellUpdateType === 'sort' || cellUpdateType === 'group') {
    (table.dataSource as any).sortedIndexMap.clear();
    sortRecords(table);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
    return;
  }

  for (let sCol = startRange.start.col; sCol <= range.end.col; sCol++) {
    for (let sRow = startRange.start.row; sRow <= range.end.row; sRow++) {
      table.scenegraph.updateCellContent(sCol, sRow);
    }
  }
  if (table.widthMode === 'adaptive' || (table.autoFillWidth && table.getAllColsWidth() <= table.tableNoFrameWidth)) {
    if (table.internalProps._widthResizedColMap.size === 0) {
      //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
      table.scenegraph.recalculateColWidths();
    }
  } else {
    for (let sCol = startCol; sCol <= range.end.col; sCol++) {
      if (!table.internalProps._widthResizedColMap.has(sCol)) {
        const oldWidth = table.getColWidth(sCol);
        const newWidth = computeColWidth(sCol, 0, table.rowCount - 1, table, false);
        if (newWidth !== oldWidth) {
          table.scenegraph.updateColWidth(sCol, newWidth - oldWidth);
        }
      }
    }
  }
  if (
    table.heightMode === 'adaptive' ||
    (table.autoFillHeight && table.getAllRowsHeight() <= table.tableNoFrameHeight)
  ) {
    table.scenegraph.recalculateRowHeights();
  } else if (table.isAutoRowHeight()) {
    const rows: number[] = [];
    const deltaYs: number[] = [];
    for (let sRow = startRow; sRow <= range.end.row; sRow++) {
      if (table.rowHeightsMap.get(sRow)) {
        // 已经计算过行高的才走更新逻辑
        const oldHeight = table.getRowHeight(sRow);
        const newHeight = computeRowHeight(sRow, 0, table.colCount - 1, table);
        rows.push(sRow);
        deltaYs.push(newHeight - oldHeight);
      }
    }
    table.scenegraph.updateRowsHeight(rows, deltaYs);
  }

  table.scenegraph.updateNextFrame();
}

type CellUpdateType = 'normal' | 'sort' | 'group';
function getCellUpdateType(
  col: number,
  row: number,
  table: ListTable,
  oldCellUpdateType: CellUpdateType | undefined
): CellUpdateType {
  if (oldCellUpdateType === 'group') {
    return oldCellUpdateType;
  }
  if (oldCellUpdateType === 'sort' && !table.options.groupBy) {
    return oldCellUpdateType;
  }
  let cellUpdateType: CellUpdateType = 'normal';
  if (table.options.groupBy) {
    cellUpdateType = 'group';
  } else if (!table.isHeader(col, row) && (table.dataSource as any).lastOrderField) {
    const field = table.getBodyField(col, row);
    if (field === (table.dataSource as any).lastOrderField) {
      cellUpdateType = 'sort';
    }
  }
  return cellUpdateType;
}

export function sortRecords(table: ListTable) {
  let sortState = table.sortState;
  sortState = !sortState || Array.isArray(sortState) ? sortState : [sortState];

  if (sortState) {
    sortState = (sortState as SortState[]).map(item => {
      item.orderFn = table._getSortFuncFromHeaderOption(undefined, item.field) ?? defaultOrderFn;
      //const hd = table.internalProps.layoutMap.headerObjects.find((col: any) => col && col.field === item.field);
      return item;
    });

    table.dataSource.sort(sortState);
  }
}

/**
 * 添加数据 单条数据
 * @param record 数据
 * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
 * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
 * recordIndex 可以通过接口getRecordShowIndexByCell获取
 */
export function listTableAddRecord(record: any, recordIndex: number | number[], table: ListTable) {
  if (table.options.groupBy) {
    (table.dataSource as CachedDataSource).addRecordsForGroup?.([record], recordIndex);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
    table.sortState && sortRecords(table);

    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
  } else if ((table.dataSource as CachedDataSource).rowHierarchyType === 'tree') {
    (table.dataSource as CachedDataSource).addRecordsForTree?.([record], recordIndex);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
    table.sortState && sortRecords(table);

    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
  } else if (table.sortState) {
    table.dataSource.addRecordForSorted(record);
    sortRecords(table);
    table.refreshRowColCount();
    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
  } else {
    recordIndex = recordIndex as number;
    if (recordIndex === undefined || recordIndex > table.dataSource.sourceLength) {
      recordIndex = table.dataSource.sourceLength;
    }
    const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
    table.dataSource.addRecord(record, recordIndex);
    const oldRowCount = table.rowCount;
    table.refreshRowColCount();
    if (table.scenegraph.proxy.totalActualBodyRowCount === 0) {
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
      return;
    }
    const newRowCount = table.transpose ? table.colCount : table.rowCount;
    if (table.pagination) {
      const { perPageCount, currentPage } = table.pagination;
      const startIndex = perPageCount * (currentPage || 0);
      const endIndex = startIndex + perPageCount;
      if (recordIndex < endIndex) {
        //插入当前页或者前面的数据才需要更新 如果是插入的是当前页后面的数据不需要更新场景树
        if (recordIndex < endIndex - perPageCount) {
          // 如果是当页之前的数据 则整个场景树都更新
          table.scenegraph.clearCells();
          table.scenegraph.createSceneGraph();
        } else {
          //如果是插入当前页数据
          const rowNum = recordIndex - (endIndex - perPageCount) + headerCount;
          if (oldRowCount - headerCount === table.pagination.perPageCount) {
            //如果当页数据是满的 则更新插入的部分行
            const updateRows = [];
            for (let row = rowNum; row < newRowCount; row++) {
              if (table.transpose) {
                updateRows.push({ col: row, row: 0 });
              } else {
                updateRows.push({ col: 0, row });
              }
            }
            table.transpose
              ? table.scenegraph.updateCol([], [], updateRows)
              : table.scenegraph.updateRow([], [], updateRows);
          } else {
            //如果当页数据不是满的 则插入新数据
            const addRows = [];
            for (let row = rowNum; row < Math.min(newRowCount, rowNum + 1); row++) {
              if (table.transpose) {
                addRows.push({ col: row, row: 0 });
              } else {
                addRows.push({ col: 0, row });
              }
            }
            table.transpose ? table.scenegraph.updateCol([], addRows, []) : table.scenegraph.updateRow([], addRows, []);
          }
        }
      }
    } else {
      const addRows = [];
      for (let row = recordIndex + headerCount; row < recordIndex + headerCount + 1; row++) {
        if (table.transpose) {
          addRows.push({ col: row, row: 0 });
        } else {
          addRows.push({ col: 0, row });
        }
      }
      const updateRows = [];
      const topAggregationCount = table.internalProps.layoutMap.hasAggregationOnTopCount;
      const bottomAggregationCount = table.internalProps.layoutMap.hasAggregationOnBottomCount;
      for (let row = headerCount; row < headerCount + topAggregationCount; row++) {
        if (table.transpose) {
          updateRows.push({ col: row, row: 0 });
        } else {
          updateRows.push({ col: 0, row });
        }
      }
      for (
        let row = (table.transpose ? table.colCount : table.rowCount) - bottomAggregationCount;
        row < (table.transpose ? table.colCount : table.rowCount);
        row++
      ) {
        if (table.transpose) {
          updateRows.push({ col: row, row: 0 });
        } else {
          updateRows.push({ col: 0, row });
        }
      }
      table.transpose ? table.scenegraph.updateCol([], addRows, []) : table.scenegraph.updateRow([], addRows, []);
    }
  }
  // table.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
}

/**
 * 添加数据 支持多条数据
 * @param records 多条数据
 * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
 * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
 * recordIndex 可以通过接口getRecordShowIndexByCell获取
 */
export function listTableAddRecords(records: any[], recordIndex: number | number[], table: ListTable) {
  if (table.options.groupBy) {
    (table.dataSource as CachedDataSource).addRecordsForGroup?.(records, recordIndex);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
    table.sortState && sortRecords(table);

    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
  } else if ((table.dataSource as CachedDataSource).rowHierarchyType === 'tree') {
    (table.dataSource as CachedDataSource).addRecordsForTree?.(records, recordIndex);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
    table.sortState && sortRecords(table);

    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
  } else if (table.sortState) {
    table.dataSource.addRecordsForSorted(records);
    sortRecords(table);
    table.refreshRowColCount();
    // 更新整个场景树
    table.scenegraph.clearCells();
    table.scenegraph.createSceneGraph();
  } else {
    recordIndex = recordIndex as number;
    if (recordIndex === undefined || recordIndex > table.dataSource.sourceLength) {
      recordIndex = table.dataSource.sourceLength;
    } else if (recordIndex < 0) {
      recordIndex = 0;
    }
    const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
    table.dataSource.addRecords(records, recordIndex);
    const oldRowCount = table.transpose ? table.colCount : table.rowCount;
    table.refreshRowColCount();
    if (table.scenegraph.proxy.totalActualBodyRowCount === 0) {
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
      return;
    }
    const newRowCount = table.transpose ? table.colCount : table.rowCount;
    if (table.pagination) {
      const { perPageCount, currentPage } = table.pagination;
      const startIndex = perPageCount * (currentPage || 0);
      const endIndex = startIndex + perPageCount;
      if (recordIndex < endIndex) {
        //插入当前页或者前面的数据才需要更新 如果是插入的是当前页后面的数据不需要更新场景树
        if (recordIndex < endIndex - perPageCount) {
          // 如果是当页之前的数据 则整个场景树都更新
          table.scenegraph.clearCells();
          table.scenegraph.createSceneGraph();
        } else {
          //如果是插入当前页数据

          const rowNum = recordIndex - (endIndex - perPageCount) + headerCount;
          if (oldRowCount - headerCount === table.pagination.perPageCount) {
            //如果当页数据是满的 则更新插入的部分行
            const updateRows = [];
            for (let row = rowNum; row < newRowCount; row++) {
              if (table.transpose) {
                updateRows.push({ col: row, row: 0 });
              } else {
                updateRows.push({ col: 0, row });
              }
            }
            table.transpose
              ? table.scenegraph.updateCol([], [], updateRows)
              : table.scenegraph.updateRow([], [], updateRows);
          } else {
            //如果当页数据不是满的 则插入新数据
            const addRows = [];
            for (
              let row = rowNum;
              row < Math.min(newRowCount, rowNum + (Array.isArray(records) ? records.length : 1));
              row++
            ) {
              if (table.transpose) {
                addRows.push({ col: row, row: 0 });
              } else {
                addRows.push({ col: 0, row });
              }
            }
            table.transpose ? table.scenegraph.updateCol([], addRows, []) : table.scenegraph.updateRow([], addRows, []);
          }
        }
      }
    } else {
      const addRows = [];
      for (
        let row = recordIndex + headerCount;
        row < recordIndex + headerCount + (Array.isArray(records) ? records.length : 1);
        row++
      ) {
        if (table.transpose) {
          addRows.push({ col: row, row: 0 });
        } else {
          addRows.push({ col: 0, row });
        }
      }
      const topAggregationCount = table.internalProps.layoutMap.hasAggregationOnTopCount;
      const bottomAggregationCount = table.internalProps.layoutMap.hasAggregationOnBottomCount;
      const updateRows = [];
      for (let row = headerCount; row < headerCount + topAggregationCount; row++) {
        if (table.transpose) {
          updateRows.push({ col: row, row: 0 });
        } else {
          updateRows.push({ col: 0, row });
        }
      }
      for (
        let row = (table.transpose ? table.colCount : table.rowCount) - bottomAggregationCount;
        row < (table.transpose ? table.colCount : table.rowCount);
        row++
      ) {
        if (table.transpose) {
          updateRows.push({ col: row, row: 0 });
        } else {
          updateRows.push({ col: 0, row });
        }
      }
      table.transpose
        ? table.scenegraph.updateCol([], addRows, updateRows)
        : table.scenegraph.updateRow([], addRows, updateRows);
    }
  }
  // table.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
}

/**
 * 删除数据 支持多条数据
 * @param recordIndexs 要删除数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
 */
export function listTableDeleteRecords(recordIndexs: number[] | number[][], table: ListTable) {
  if (recordIndexs?.length > 0) {
    if (table.options.groupBy) {
      (table.dataSource as CachedDataSource).deleteRecordsForGroup?.(recordIndexs);
      table.refreshRowColCount();
      table.internalProps.layoutMap.clearCellRangeMap();
      table.sortState && sortRecords(table);
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else if ((table.dataSource as CachedDataSource).rowHierarchyType === 'tree') {
      (table.dataSource as CachedDataSource).deleteRecordsForTree?.(recordIndexs);
      table.refreshRowColCount();
      table.internalProps.layoutMap.clearCellRangeMap();
      table.sortState && sortRecords(table);
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else if (table.sortState) {
      table.dataSource.deleteRecordsForSorted(recordIndexs as number[]);
      sortRecords(table);
      table.refreshRowColCount();
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else {
      const deletedRecordIndexs = table.dataSource.deleteRecords(recordIndexs as number[]);
      if (deletedRecordIndexs.length === 0) {
        return;
      }
      const oldRowCount = table.transpose ? table.colCount : table.rowCount;
      table.refreshRowColCount();
      const newRowCount = table.transpose ? table.colCount : table.rowCount;
      const recordIndexsMinToMax = deletedRecordIndexs.sort((a, b) => a - b);
      const minRecordIndex = recordIndexsMinToMax[0];
      if (table.pagination) {
        const { perPageCount, currentPage } = table.pagination;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        if (minRecordIndex < endIndex) {
          //删除当前页或者前面的数据才需要更新 如果是删除的是当前页后面的数据不需要更新场景树
          if (minRecordIndex < endIndex - perPageCount) {
            // 如果删除包含当页之前的数据 则整个场景树都更新
            table.scenegraph.clearCells();
            table.scenegraph.createSceneGraph();
          } else {
            const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
            const topAggregationCount = table.internalProps.layoutMap.hasAggregationOnTopCount;
            //如果是仅删除当前页数据
            const minRowNum =
              minRecordIndex -
              (endIndex - perPageCount) +
              (table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount) +
              topAggregationCount;
            //如果当页数据是满的 则更新影响的部分行
            const updateRows = [];
            const delRows = [];

            for (let row = minRowNum; row < newRowCount; row++) {
              if (table.transpose) {
                updateRows.push({ col: row, row: 0 });
              } else {
                updateRows.push({ col: 0, row });
              }
            }

            for (let row = headerCount; row < headerCount + topAggregationCount; row++) {
              if (table.transpose) {
                updateRows.push({ col: row, row: 0 });
              } else {
                updateRows.push({ col: 0, row });
              }
            }

            if (newRowCount < oldRowCount) {
              //如果如果删除后不满 需要有删除数据
              for (let row = newRowCount; row < oldRowCount; row++) {
                if (table.transpose) {
                  delRows.push({ col: row, row: 0 });
                } else {
                  delRows.push({ col: 0, row });
                }
              }
            }
            table.reactCustomLayout?.clearCache();
            table.transpose
              ? table.scenegraph.updateCol(delRows, [], updateRows)
              : table.scenegraph.updateRow(delRows, [], updateRows);
            table.reactCustomLayout?.updateAllCustomCell();
          }
        }
      } else {
        const delRows = [];
        const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
        const topAggregationCount = table.internalProps.layoutMap.hasAggregationOnTopCount;
        const bottomAggregationCount = table.internalProps.layoutMap.hasAggregationOnBottomCount;
        for (let index = 0; index < recordIndexsMinToMax.length; index++) {
          const recordIndex = recordIndexsMinToMax[index];
          const rowNum = recordIndex + headerCount + topAggregationCount;
          if (table.transpose) {
            delRows.push({ col: rowNum, row: 0 });
          } else {
            delRows.push({ col: 0, row: rowNum });
          }
        }
        const updateRows = [];
        for (let row = headerCount; row < headerCount + topAggregationCount; row++) {
          if (table.transpose) {
            updateRows.push({ col: row, row: 0 });
          } else {
            updateRows.push({ col: 0, row });
          }
        }
        for (
          let row = (table.transpose ? table.colCount : table.rowCount) - bottomAggregationCount;
          row < (table.transpose ? table.colCount : table.rowCount);
          row++
        ) {
          if (table.transpose) {
            updateRows.push({ col: row, row: 0 });
          } else {
            updateRows.push({ col: 0, row });
          }
        }

        table.reactCustomLayout?.clearCache();
        table.transpose
          ? table.scenegraph.updateCol(delRows, [], updateRows)
          : table.scenegraph.updateRow(delRows, [], updateRows);
        table.reactCustomLayout?.updateAllCustomCell();
      }
    }
    // table.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
  }
}

/**
 * 修改数据 支持多条数据
 * @param records 修改数据条目
 * @param recordIndexs 对应修改数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
 */
export function listTableUpdateRecords(records: any[], recordIndexs: (number | number[])[], table: ListTable) {
  if (recordIndexs?.length > 0) {
    if (table.options.groupBy) {
      (table.dataSource as CachedDataSource).updateRecordsForGroup?.(records, recordIndexs as number[]);
      table.refreshRowColCount();
      table.internalProps.layoutMap.clearCellRangeMap();
      table.sortState && sortRecords(table);
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else if ((table.dataSource as CachedDataSource).rowHierarchyType === 'tree') {
      (table.dataSource as CachedDataSource).updateRecordsForTree?.(records, recordIndexs as number[]);
      table.refreshRowColCount();
      table.internalProps.layoutMap.clearCellRangeMap();
      table.sortState && sortRecords(table);
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else if (table.sortState) {
      table.dataSource.updateRecordsForSorted(records, recordIndexs as number[]);
      sortRecords(table);
      table.refreshRowColCount();
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else {
      const updateRecordIndexs = table.dataSource.updateRecords(records, recordIndexs);
      if (updateRecordIndexs.length === 0) {
        return;
      }
      const bodyRowIndex = updateRecordIndexs.map(index => table.getBodyRowIndexByRecordIndex(index));
      const recordIndexsMinToMax = bodyRowIndex.sort((a, b) => a - b);
      if (table.pagination) {
        const { perPageCount, currentPage } = table.pagination;
        const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
        const topAggregationCount = table.internalProps.layoutMap.hasAggregationOnTopCount;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        const updateRows = [];
        for (let index = 0; index < recordIndexsMinToMax.length; index++) {
          const recordIndex = recordIndexsMinToMax[index];
          if (recordIndex < endIndex && recordIndex >= endIndex - perPageCount) {
            const rowNum =
              recordIndex -
              (endIndex - perPageCount) +
              (table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount) +
              topAggregationCount;
            updateRows.push(rowNum);
          }
        }
        if (updateRows.length >= 1) {
          const updateRowCells = [];
          for (let index = 0; index < updateRows.length; index++) {
            const updateRow = updateRows[index];
            if (table.transpose) {
              updateRowCells.push({ col: updateRow, row: 0 });
            } else {
              updateRowCells.push({ col: 0, row: updateRow });
            }
          }
          for (let row = headerCount; row < headerCount + topAggregationCount; row++) {
            if (table.transpose) {
              updateRowCells.push({ col: row, row: 0 });
            } else {
              updateRowCells.push({ col: 0, row });
            }
          }
          table.transpose
            ? table.scenegraph.updateCol([], [], updateRowCells)
            : table.scenegraph.updateRow([], [], updateRowCells);
        }
      } else {
        const updateRows = [];
        const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
        const topAggregationCount = table.internalProps.layoutMap.hasAggregationOnTopCount;
        const bottomAggregationCount = table.internalProps.layoutMap.hasAggregationOnBottomCount;
        for (let index = 0; index < recordIndexsMinToMax.length; index++) {
          const recordIndex = recordIndexsMinToMax[index];
          const rowNum = recordIndex + headerCount + topAggregationCount;
          if (table.transpose) {
            updateRows.push({ col: rowNum, row: 0 });
          } else {
            updateRows.push({ col: 0, row: rowNum });
          }
        }
        for (let row = headerCount; row < headerCount + topAggregationCount; row++) {
          if (table.transpose) {
            updateRows.push({ col: row, row: 0 });
          } else {
            updateRows.push({ col: 0, row });
          }
        }
        for (
          let row = (table.transpose ? table.colCount : table.rowCount) - bottomAggregationCount;
          row < (table.transpose ? table.colCount : table.rowCount);
          row++
        ) {
          if (table.transpose) {
            updateRows.push({ col: row, row: 0 });
          } else {
            updateRows.push({ col: 0, row });
          }
        }
        table.transpose
          ? table.scenegraph.updateCol([], [], updateRows)
          : table.scenegraph.updateRow([], [], updateRows);
      }
    }
    // table.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
  }
}
