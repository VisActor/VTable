/* eslint-disable max-depth */
import type { ListTable } from '../ListTable';
import type { CachedDataSource } from '../data';
import { defaultOrderFn } from '../tools/util';
import type { SortState } from '../ts-types';

export function sortRecords(table: ListTable) {
  if (table.sortState) {
    let order: any;
    let field: any;
    if (Array.isArray(table.sortState)) {
      if (table.sortState.length !== 0) {
        ({ order, field } = table.sortState?.[0]);
      }
    } else {
      ({ order, field } = table.sortState as SortState);
    }
    // 根据sort规则进行排序
    if (order && field && order !== 'normal') {
      const sortFunc = table._getSortFuncFromHeaderOption(undefined, field);
      // 如果sort传入的信息不能生成正确的sortFunc，直接更新表格，避免首次加载无法正常显示内容
      const hd = table.internalProps.layoutMap.headerObjects.find((col: any) => col && col.field === field);

      // hd?.define?.sort && //如果这里也判断 那想要利用sortState来排序 但不显示排序图标就实现不了
      table.dataSource.sort(hd.field, order, sortFunc ?? defaultOrderFn);
    }
  }
}

/**
 * 添加数据 单条数据
 * @param record 数据
 * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
 * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
 * recordIndex 可以通过接口getRecordShowIndexByCell获取
 */
export function listTableAddRecord(record: any, recordIndex: number, table: ListTable) {
  if (table.options.groupBy) {
    (table.dataSource as CachedDataSource).addRecordsForGroup?.([record]);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
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
export function listTableAddRecords(records: any[], recordIndex: number, table: ListTable) {
  if (table.options.groupBy) {
    (table.dataSource as CachedDataSource).addRecordsForGroup?.(records);
    table.refreshRowColCount();
    table.internalProps.layoutMap.clearCellRangeMap();
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
      table.transpose ? table.scenegraph.updateCol([], addRows, []) : table.scenegraph.updateRow([], addRows, []);
    }
  }
  // table.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
}

/**
 * 删除数据 支持多条数据
 * @param recordIndexs 要删除数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
 */
export function listTableDeleteRecords(recordIndexs: number[], table: ListTable) {
  if (recordIndexs?.length > 0) {
    if (table.options.groupBy) {
      (table.dataSource as CachedDataSource).deleteRecordsForGroup?.(recordIndexs);
      table.refreshRowColCount();
      table.internalProps.layoutMap.clearCellRangeMap();
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else if (table.sortState) {
      table.dataSource.deleteRecordsForSorted(recordIndexs);
      sortRecords(table);
      table.refreshRowColCount();
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else {
      const deletedRecordIndexs = table.dataSource.deleteRecords(recordIndexs);
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
            //如果是仅删除当前页数据
            const minRowNum =
              minRecordIndex -
              (endIndex - perPageCount) +
              (table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount);
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
            table.transpose
              ? table.scenegraph.updateCol(delRows, [], updateRows)
              : table.scenegraph.updateRow(delRows, [], updateRows);
          }
        }
      } else {
        const delRows = [];

        for (let index = 0; index < recordIndexsMinToMax.length; index++) {
          const recordIndex = recordIndexsMinToMax[index];
          const rowNum = recordIndex + (table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount);
          if (table.transpose) {
            delRows.push({ col: rowNum, row: 0 });
          } else {
            delRows.push({ col: 0, row: rowNum });
          }
        }
        table.transpose ? table.scenegraph.updateCol(delRows, [], []) : table.scenegraph.updateRow(delRows, [], []);
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
export function listTableUpdateRecords(records: any[], recordIndexs: number[], table: ListTable) {
  if (recordIndexs?.length > 0) {
    if (table.options.groupBy) {
      (table.dataSource as CachedDataSource).updateRecordsForGroup?.(records, recordIndexs);
      table.refreshRowColCount();
      table.internalProps.layoutMap.clearCellRangeMap();
      // 更新整个场景树
      table.scenegraph.clearCells();
      table.scenegraph.createSceneGraph();
    } else if (table.sortState) {
      table.dataSource.updateRecordsForSorted(records, recordIndexs);
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

      const recordIndexsMinToMax = updateRecordIndexs.sort((a, b) => a - b);
      if (table.pagination) {
        const { perPageCount, currentPage } = table.pagination;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        const updateRows = [];
        for (let index = 0; index < recordIndexsMinToMax.length; index++) {
          const recordIndex = recordIndexsMinToMax[index];
          if (recordIndex < endIndex && recordIndex >= endIndex - perPageCount) {
            const rowNum =
              recordIndex -
              (endIndex - perPageCount) +
              (table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount);
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
          table.transpose
            ? table.scenegraph.updateCol([], [], updateRowCells)
            : table.scenegraph.updateRow([], [], updateRowCells);
        }
      } else {
        const updateRows = [];
        for (let index = 0; index < recordIndexsMinToMax.length; index++) {
          const recordIndex = recordIndexsMinToMax[index];
          const rowNum = recordIndex + (table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount);
          if (table.transpose) {
            updateRows.push({ col: rowNum, row: 0 });
          } else {
            updateRows.push({ col: 0, row: rowNum });
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
