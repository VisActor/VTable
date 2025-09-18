import type * as VTable from '@visactor/vtable';
import { getInternalProps, findCheckboxColumnIndex, setCellCheckboxStateByAttribute } from './utils';
/**
 * 绑定主从表checkbox联动事件
 */
export function bindMasterDetailCheckboxChange(
  table: VTable.ListTable,
  eventManager: { isRowExpanded: (row: number) => boolean; getExpandedRows: () => number[] }
) {
  table.on('checkbox_state_change', (args: unknown) => {
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
  });
  bindSubTableCheckboxEvents(table);
}

/**
 * 绑定子表checkbox事件，实现子表到主表的反向联动
 */
function bindSubTableCheckboxEvents(table: VTable.ListTable) {
  const internalProps = getInternalProps(table);
  const originalSet = internalProps.subTableInstances.set;
  if (originalSet && internalProps.subTableInstances) {
    internalProps.subTableInstances.set = function (key: number, subTable: VTable.ListTable) {
      const result = originalSet.call(this, key, subTable);
      // 为新创建的子表绑定checkbox事件
      subTable.on('checkbox_state_change', (args: unknown) => {
        const { field } = args as { col: number; row: number; checked: boolean; field: string };
        updateMainTableRowCheckboxFromSubTable(table, subTable, key, field as string);
      });
      return result;
    };
  }
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
      const newHeaderCheckedState = updateHeaderCheckedStateWithIndeterminate(field, mainTable.stateManager);
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
 * 自定义的表头checkbox状态更新函数
 */
function updateHeaderCheckedStateWithIndeterminate(field: string | number, state: unknown): boolean | 'indeterminate' {
  const stateManager = state as {
    checkedState: Map<string, Record<string | number, boolean | 'indeterminate'>>;
    headerCheckedState: Record<string | number, boolean | 'indeterminate'>;
    table: VTable.ListTable;
  };
  let allChecked = true;
  let allUnChecked = true;
  let hasChecked = false;
  let hasIndeterminate = false;
  stateManager.checkedState.forEach(check_state => {
    const checkValue = check_state?.[field];
    if (checkValue === 'indeterminate') {
      hasIndeterminate = true;
      allChecked = false;
      allUnChecked = false;
    } else if (checkValue !== true) {
      allChecked = false;
    } else {
      allUnChecked = false;
      hasChecked = true;
    }
  });

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
}

/**
 * 更新子表所有checkbox状态
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
  for (let col = 0; col < subTable.colCount; col++) {
    const cellField = subTable.getHeaderField(col, 0);
    if (cellField === field) {
      subTable.scenegraph.updateHeaderCheckboxCellState(col, 0, checked);
      for (let row = subTable.columnHeaderLevelCount; row < subTable.rowCount; row++) {
        setCellCheckboxStateByAttribute(col, row, checked, subTable);
      }
      break;
    }
  }
}
