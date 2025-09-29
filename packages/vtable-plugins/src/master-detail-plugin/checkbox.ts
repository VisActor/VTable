import type * as VTable from '@visactor/vtable';
import { getInternalProps, findCheckboxColumnIndex, setCellCheckboxStateByAttribute } from './utils';
/**
 * 设置主从表checkbox联动功能
 */
export function bindMasterDetailCheckboxChange(
  table: VTable.ListTable,
  eventManager: { isRowExpanded: (row: number) => boolean; getExpandedRows: () => number[] }
): () => void {
  const checkboxChangeHandler = (args: unknown) => {
    const { col, row, checked, field } = args as { col: number; row: number; checked: boolean; field: string };

    // 主表表头checkbox变化：同步更新所有已展开子表的对应字段
    if (table.isHeader(col, row)) {
      const internalProps = getInternalProps(table);
      const expandedRows = eventManager.getExpandedRows();
      expandedRows.forEach(expandedRow => {
        const bodyRowIndex = expandedRow - table.columnHeaderLevelCount;
        const subTableInstance = internalProps.subTableInstances?.get(bodyRowIndex);
        if (subTableInstance && field) {
          const fieldStr = typeof field === 'string' ? field : String(field);
          updateAllSubTableCheckboxes(subTableInstance, fieldStr, checked);
        }
      });
      return;
    }

    // 主表body行checkbox变化：如果该行已展开，则更新对应子表的所有checkbox
    const rowIndex = row;
    if (!eventManager.isRowExpanded(rowIndex)) {
      return;
    }
    const bodyRowIndex = row - table.columnHeaderLevelCount;
    const internalProps = getInternalProps(table);
    const subTableInstance = internalProps.subTableInstances?.get(bodyRowIndex);
    if (subTableInstance && field) {
      const fieldStr = typeof field === 'string' ? field : String(field);
      updateAllSubTableCheckboxes(subTableInstance, fieldStr, checked);
    }
  };

  // 增强主表的updateHeaderCheckedState方法，添加indeterminate状态处理
  const originalUpdateHeaderCheckedState = table.stateManager.updateHeaderCheckedState;
  table.stateManager.updateHeaderCheckedState = function (
    field: string | number,
    col: number,
    row: number
  ): boolean | 'indeterminate' {
    const stateManager = this;
    let allChecked = true;
    let allUnChecked = true;
    let hasChecked = false;
    let hasIndeterminate = false;

    stateManager.checkedState.forEach(
      (check_state: Record<string | number, boolean | 'indeterminate'>, index: string | number | number[]) => {
        if ((index as string).includes(',')) {
          index = (index as string).split(',').map(item => {
            return Number(item);
          }) as number[];
        } else {
          index = Number(index);
        }
        const tableIndex = stateManager.table.getTableIndexByRecordIndex(index as number);
        const mergeCell = (stateManager.table as VTable.ListTable).transpose
          ? stateManager.table.getCustomMerge(tableIndex, row)
          : stateManager.table.getCustomMerge(col, tableIndex);

        const data = stateManager.table.dataSource?.get(index as number);
        if (mergeCell || (!stateManager.table.internalProps.enableCheckboxCascade && data?.vtableMerge)) {
          // 不参与check状态的计算
          return;
        }

        const checkValue = check_state?.[field];
        // 主从表特判：处理indeterminate状态
        if (checkValue === 'indeterminate') {
          hasIndeterminate = true;
          hasChecked = true;
          allChecked = false;
          allUnChecked = false;
        } else if (checkValue !== true) {
          allChecked = false;
        } else {
          allUnChecked = false;
          hasChecked = true;
        }
      }
    );

    let result: boolean | 'indeterminate';
    if (hasIndeterminate) {
      result = 'indeterminate';
    } else if (allChecked) {
      result = true;
    } else if (allUnChecked) {
      result = false;
    } else if (hasChecked) {
      result = 'indeterminate';
    } else {
      result = false;
    }
    stateManager.headerCheckedState[field] = result;
    return result;
  };

  // 绑定主表复选框状态变化事件
  table.on('checkbox_state_change', checkboxChangeHandler);
  // 绑定子表复选框事件，实现反向联动
  const subTableCleanup = bindSubTableCheckboxEvents(table);
  // 返回清理函数，用于移除所有事件监听器和恢复原始方法
  return () => {
    table.off('checkbox_state_change', checkboxChangeHandler);
    // 恢复原始的updateHeaderCheckedState方法
    table.stateManager.updateHeaderCheckedState = originalUpdateHeaderCheckedState;
    subTableCleanup();
  };
}

/**
 * 绑定子表checkbox事件，实现子表到主表的反向联动
 */
function bindSubTableCheckboxEvents(table: VTable.ListTable): () => void {
  const internalProps = getInternalProps(table);
  const originalSet = internalProps.subTableInstances.set;
  if (originalSet && internalProps.subTableInstances) {
    internalProps.subTableInstances.set = function (key: number, subTable: VTable.ListTable) {
      const result = originalSet.call(this, key, subTable);
      // 为新创建的子表绑定checkbox事件
      const checkboxHandler = (args: unknown) => {
        const { field } = args as { col: number; row: number; checked: boolean; field: string };
        updateMainTableRowCheckboxFromSubTable(table, subTable, key, field as string);
      };
      subTable.on('checkbox_state_change', checkboxHandler);
      const extendedSubTable = subTable as VTable.ListTable & { __checkboxHandler?: (args: unknown) => void };
      extendedSubTable.__checkboxHandler = checkboxHandler;
      return result;
    };
    // 返回清理函数
    return () => {
      if (internalProps.subTableInstances && originalSet) {
        internalProps.subTableInstances.set = originalSet;
      }
    };
  }
  // 如果没有设置成功，返回空的清理函数
  return () => {
    //
  };
}

/**
 * 根据子表状态更新主表对应展开行的checkbox状态
 */
function updateMainTableRowCheckboxFromSubTable(
  mainTable: VTable.ListTable,
  subTable: VTable.ListTable,
  subTableKey: number,
  field: string
) {
  // 将bodyRowIndex转换为主表rowIndex
  const mainTableRow = subTableKey + mainTable.columnHeaderLevelCount;
  let subTableState: boolean | 'indeterminate' = false;
  const headerState = subTable.stateManager.headerCheckedState[field];
  if (headerState !== undefined) {
    subTableState = headerState;
  }
  const mainTableCheckboxCol = findCheckboxColumnIndex(mainTable, field);
  if (mainTableCheckboxCol === -1) {
    return;
  }
  // 更新主表对应行的checkbox状态
  if (mainTable.stateManager) {
    mainTable.stateManager.setCheckedState(mainTableCheckboxCol, mainTableRow, field, subTableState);
    const cellType = mainTable.getCellType(mainTableCheckboxCol, mainTableRow);
    if (cellType === 'checkbox') {
      setCellCheckboxStateByAttribute(mainTableCheckboxCol, mainTableRow, subTableState, mainTable);
    }
    if (mainTable.internalProps.enableCheckboxCascade) {
      const oldHeaderCheckedState = mainTable.stateManager.headerCheckedState[field];
      const newHeaderCheckedState = mainTable.stateManager.updateHeaderCheckedState(field, mainTableCheckboxCol, 0);
      if (oldHeaderCheckedState !== newHeaderCheckedState) {
        const headerRow = 0;
        if (mainTable.isHeader(mainTableCheckboxCol, headerRow)) {
          mainTable.scenegraph.updateHeaderCheckboxCellState(mainTableCheckboxCol, headerRow, newHeaderCheckedState);
        }
      }
    }
  }
}

/**
 * 更新子表的checkbox状态
 */
function updateAllSubTableCheckboxes(subTable: VTable.ListTable, field: string, checked: boolean): void {
  if (!subTable.stateManager) {
    return;
  }
  // 设置表头状态
  subTable.stateManager.headerCheckedState[field] = checked;
  const records = subTable.records || [];
  records.forEach((record, recordIndex) => {
    const indexKey = recordIndex.toString();
    (record as Record<string, unknown>)[field] = checked;
    let recordStates = subTable.stateManager.checkedState.get(indexKey);
    if (!recordStates) {
      recordStates = {};
      subTable.stateManager.checkedState.set(indexKey, recordStates);
    }
    recordStates[field] = checked;
  });
  // 使用缓存的列索引避免重复查找
  const checkboxCol = findCheckboxColumnIndex(subTable, field);
  if (checkboxCol >= 0) {
    subTable.scenegraph.updateHeaderCheckboxCellState(checkboxCol, 0, checked);
    for (let row = subTable.columnHeaderLevelCount; row < subTable.rowCount; row++) {
      setCellCheckboxStateByAttribute(checkboxCol, row, checked, subTable);
    }
  }
}
