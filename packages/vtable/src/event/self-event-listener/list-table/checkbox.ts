import { isArray, isNumber } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { setCellCheckboxStateByAttribute } from '../../../state/checkbox/checkbox';
import type { ListTableAPI } from '../../../ts-types';
import { HierarchyState } from '../../../ts-types';
import type { CachedDataSource } from '../../../data';

export function bindGroupTitleCheckboxChange(table: BaseTableAPI) {
  table.on('checkbox_state_change', args => {
    const { col, row, checked, field } = args;

    if (
      !table.internalProps.layoutMap.isRowSeriesNumber(col, row) ||
      table.internalProps.rowSeriesNumber?.enableTreeCheckbox !== true
    ) {
      return;
    }

    if (table.isHeader(col, row)) {
      return;
    }
    const record = table.getCellOriginRecord(col, row);
    const indexedData = (table.dataSource as any).currentPagerIndexedData as (number | number[])[];
    const titleShowIndex = table.getRecordShowIndexByCell(col, row);
    let titleIndex = indexedData[titleShowIndex];
    if (isNumber(titleIndex)) {
      titleIndex = [titleIndex];
    }

    if (record.vtableMerge || record.children?.length) {
      // 1. group title
      if (checked) {
        // 1.1 group title check
        // 1.1.1 check all children
        if (getHierarchyState(table, col, row) === HierarchyState.collapse) {
          updateChildrenCheckboxState(true, titleIndex, table, field as string);
        } else {
          setAllChildrenCheckboxState(true, titleShowIndex, titleIndex, indexedData, table, col);
        }
        // 1.1.2 update group title state
        updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table, col);
      } else {
        // 1.2 group title uncheck
        // 1.2.1 uncheck all children
        if (getHierarchyState(table, col, row) === HierarchyState.collapse) {
          updateChildrenCheckboxState(false, titleIndex, table, field as string);
        } else {
          setAllChildrenCheckboxState(false, titleShowIndex, titleIndex, indexedData, table, col);
        }
        // 1.2.2 update group title state
        updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table, col);

        // 1.2.3 update header checkbox state
        const oldHeaderCheckedState = table.stateManager.headerCheckedState._vtable_rowSeries_number;
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState('_vtable_rowSeries_number', col, row);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    } else {
      // 2. group content, reset group title state
      updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table, col);
    }
  });
}

// 在cellType: 'checkbox'与tree: true同时配置时，开启enableTreeCheckbox
export function bindGroupCheckboxTreeChange(table: ListTableAPI) {
  table.on('checkbox_state_change', args => {
    const { col, row, checked, field } = args;

    const isCheckboxAndTree = table.internalProps.columns.some(column => column.tree);
    table.internalProps.enableCheckboxCascade && field !== '_vtable_rowSeries_number';

    if (!isCheckboxAndTree) {
      return;
    }
    if (table.isHeader(col, row)) {
      return;
    }
    const record = table.getCellOriginRecord(col, row);
    const indexedData = (table.dataSource as any).currentPagerIndexedData as (number | number[])[];
    const titleShowIndex = table.getRecordShowIndexByCell(col, row);
    let titleIndex = indexedData[titleShowIndex];
    if (isNumber(titleIndex)) {
      titleIndex = [titleIndex];
    }
    if (record.vtableMerge || record.children?.length) {
      // 1. group title
      if (checked) {
        // 1.1 group title check
        // 1.1.1 check all children
        if (getHierarchyState(table, col, row) === HierarchyState.collapse) {
          updateChildrenCheckboxState(true, titleIndex, table, field as string);
        } else {
          setAllChildrenCheckboxState(true, titleShowIndex, titleIndex, indexedData, table, col, field as string);
        }
        // 1.1.2 update group title state
        updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table, col, field as string);
      } else {
        // 1.2 group title uncheck
        // 1.2.1 uncheck all children
        if (getHierarchyState(table, col, row) === HierarchyState.collapse) {
          updateChildrenCheckboxState(false, titleIndex, table, field as string);
        } else {
          setAllChildrenCheckboxState(false, titleShowIndex, titleIndex, indexedData, table, col, field as string);
        }
        // 1.2.2 update group title state
        updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table, col, field as string);
        // 1.2.3 update header checkbox state
        const oldHeaderCheckedState = table.stateManager.headerCheckedState._vtable_rowSeries_number;
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState(field as string, col, row);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    } else {
      // 2. group content, reset group title state
      updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table, col, field as string);
    }
  });
}

// update visible children checkbox state
function setAllChildrenCheckboxState(
  state: boolean,
  titleShowIndex: number,
  titleIndex: number[],
  indexedData: (number | number[])[],
  table: BaseTableAPI,
  col: number,
  field?: string
) {
  const fieldName = field || '_vtable_rowSeries_number';
  let i = titleShowIndex + 1;
  while (isArray(indexedData[i]) && (indexedData[i] as number[])?.length > titleIndex.length) {
    const row = table.columnHeaderLevelCount + i;
    table.stateManager.setCheckedState(col, row, fieldName, state);
    setCellCheckboxStateByAttribute(col, row, state, table);
    i++;
  }
}

function updateGroupTitleCheckboxState(
  titleShowIndex: number,
  titleIndex: number[],
  indexedData: (number | number[])[],
  table: BaseTableAPI,
  col: number,
  field?: string
) {
  let parentLength = titleIndex.length - 1;
  if (parentLength > 0) {
    let i = titleShowIndex - 1;
    while (parentLength > 0 && i >= 0) {
      if (
        (isArray(indexedData[i]) && (indexedData[i] as number[])?.length === parentLength) ||
        (parentLength === 1 && isNumber(indexedData[i]))
      ) {
        const row = table.columnHeaderLevelCount + i;
        // check all children
        updateParentCheckboxState(col, row, indexedData[i], table, field);
        // table.stateManager.setCheckedState(0, row, '_vtable_rowSeries_number', 'indeterminate');
        // setCellCheckboxStateByAttribute(0, row, 'indeterminate', table);

        parentLength--;
      }
      i--;
    }
  }
}

function updateParentCheckboxState(
  col: number,
  row: number,
  currentIndex: number | number[],
  table: BaseTableAPI,
  field?: string
) {
  const { checkedState } = table.stateManager;
  const key = currentIndex.toString();
  const fieldName = field || '_vtable_rowSeries_number';
  const currentIndexLength = isArray(currentIndex) ? currentIndex.length : 1;
  let start = false;
  const result: (boolean | string)[] = [];

  const keys = Array.from(checkedState.keys()).sort((a: string, b: string) => {
    // number or number[]
    const aArr = (a as string).split(',');
    const bArr = (b as string).split(',');
    const maxLength = Math.max(aArr.length, bArr.length);

    // judge from first to last
    for (let i = 0; i < maxLength; i++) {
      const a = Number(aArr[i]) ?? 0;
      const b = Number(bArr[i]) ?? 0;
      if (a !== b) {
        return a - b;
      }
    }
    return 0;
  });
  const stateArr = keys.map(key => checkedState.get(key));

  // currentIndex的子元素
  const childOfCurrentIndex = (keys as string[]).filter(item => item.startsWith(key + ',') && item !== key);

  stateArr.forEach((state, i) => {
    const index = keys[i] as string;
    const value = state;
    const isChildOfCurrentIndex = childOfCurrentIndex.includes(index);

    if (start) {
      if (!isChildOfCurrentIndex) {
        start = false;
      } else {
        result.push(value[fieldName]);
      }
    }
    if (index === key) {
      start = true;
    }
  });

  if (result.length === 0) {
    return;
  }

  const allChecked = result.every(item => !!item);
  const allUnChecked = result.every(item => !item);

  if (allChecked) {
    table.stateManager.setCheckedState(col, row, fieldName, true);
    setCellCheckboxStateByAttribute(col, row, true, table);
  } else if (allUnChecked) {
    table.stateManager.setCheckedState(col, row, fieldName, false);
    setCellCheckboxStateByAttribute(col, row, false, table);
  } else {
    table.stateManager.setCheckedState(col, row, fieldName, 'indeterminate');
    setCellCheckboxStateByAttribute(col, row, 'indeterminate', table);
  }
}

// update invisible children checkbox state(collapsed)
function updateChildrenCheckboxState(
  parentState: boolean,
  currentIndex: number | number[],
  table: BaseTableAPI,
  field: string
) {
  const { checkedState } = table.stateManager;
  const key = currentIndex.toString();
  const currentIndexLength = isArray(currentIndex) ? currentIndex.length : 1;
  let start = false;

  const keys = Array.from(checkedState.keys()).sort((a: string, b: string) => {
    // number or number[]
    const aArr = (a as string).split(',');
    const bArr = (b as string).split(',');
    const maxLength = Math.max(aArr.length, bArr.length);

    // judge from first to last
    for (let i = 0; i < maxLength; i++) {
      const a = Number(aArr[i]) ?? 0;
      const b = Number(bArr[i]) ?? 0;
      if (a !== b) {
        return a - b;
      }
    }
    return 0;
  });

  // 当前元素的子元素数组
  const childrenOfKey = (keys as string[]).filter(item => item.startsWith(key + ',') && item !== key);

  const stateArr = keys.map(key => checkedState.get(key));

  stateArr.forEach((state, i) => {
    const index = keys[i] as string;
    const value = state;
    const shouldSelectChildren = childrenOfKey.length !== 0 && childrenOfKey.includes(index);

    if (start) {
      if (!shouldSelectChildren) {
        start = false;
      } else {
        value[field] = parentState;
      }
    }
    if (index === key) {
      start = true;
    }
  });
}

export function bindHeaderCheckboxChange(table: BaseTableAPI) {
  table.on('checkbox_state_change', args => {
    const { col, row, checked, field } = args;
    if (table.isHeader(col, row)) {
      //点击的表头部分的checkbox 需要同时处理表头和body单元格的状态
      table.stateManager.setHeaderCheckedState(field as string | number, checked);
      const cellType = table.getCellType(col, row);
      if (cellType === 'checkbox') {
        table.scenegraph.updateCheckboxCellState(col, row, checked);
      }
    } else {
      //点击的是body单元格的checkbox  处理本单元格的状态维护 同时需要检查表头是否改变状态
      table.stateManager.setCheckedState(col, row, field as string | number, checked);
      const cellType = table.getCellType(col, row);
      if (cellType === 'checkbox') {
        const oldHeaderCheckedState = table.stateManager.headerCheckedState[field as string | number];
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState(field as string | number, col, row);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    }
  });
}

// get hierarchy state by row
function getHierarchyState(table: BaseTableAPI, col: number, row: number) {
  const index = table.getRecordShowIndexByCell(col, row);
  return (table.dataSource as CachedDataSource).getHierarchyState(index);
}
