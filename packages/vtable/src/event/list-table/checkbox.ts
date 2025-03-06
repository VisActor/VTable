import { isArray, isNumber } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { setCellCheckboxStateByAttribute } from '../../state/checkbox/checkbox';
import { HierarchyState } from '../../ts-types';

export function bindGroupTitleCheckboxChange(table: BaseTableAPI) {
  table.on('checkbox_state_change', args => {
    if (table.internalProps.rowSeriesNumber?.enableTreeCheckbox !== true) {
      return;
    }

    const { col, row, checked } = args;
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
        if (table.getHierarchyState(col, row) === HierarchyState.collapse) {
          updateChildrenCheckboxState(true, titleIndex, table);
        } else {
          setAllChildrenCheckboxState(true, titleShowIndex, titleIndex, indexedData, table);
        }
        // 1.1.2 update group title state
        updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table);
      } else {
        // 1.2 group title uncheck
        // 1.2.1 uncheck all children
        if (table.getHierarchyState(col, row) === HierarchyState.collapse) {
          updateChildrenCheckboxState(false, titleIndex, table);
        } else {
          setAllChildrenCheckboxState(false, titleShowIndex, titleIndex, indexedData, table);
        }
        // 1.2.2 update group title state
        updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table);

        // 1.2.3 update header checkbox state
        const oldHeaderCheckedState = table.stateManager.headerCheckedState._vtable_rowSeries_number;
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState('_vtable_rowSeries_number', col, row);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    } else {
      // 2. group content, reset group title state
      updateGroupTitleCheckboxState(titleShowIndex, titleIndex, indexedData, table);
    }
  });
}

// update visible children checkbox state
function setAllChildrenCheckboxState(
  state: boolean,
  titleShowIndex: number,
  titleIndex: number[],
  indexedData: (number | number[])[],
  table: BaseTableAPI
) {
  let i = titleShowIndex + 1;
  while (isArray(indexedData[i]) && (indexedData[i] as number[])?.length > titleIndex.length) {
    const row = table.columnHeaderLevelCount + i;
    table.stateManager.setCheckedState(0, row, '_vtable_rowSeries_number', state);
    setCellCheckboxStateByAttribute(0, row, state, table);
    i++;
  }
}

function updateGroupTitleCheckboxState(
  titleShowIndex: number,
  titleIndex: number[],
  indexedData: (number | number[])[],
  table: BaseTableAPI
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
        updateParentCheckboxState(0, row, indexedData[i], table);
        // table.stateManager.setCheckedState(0, row, '_vtable_rowSeries_number', 'indeterminate');
        // setCellCheckboxStateByAttribute(0, row, 'indeterminate', table);

        parentLength--;
      }
      i--;
    }
  }
}

function updateParentCheckboxState(col: number, row: number, currentIndex: number | number[], table: BaseTableAPI) {
  const { checkedState } = table.stateManager;
  const key = currentIndex.toString();
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

  stateArr.forEach((state, i) => {
    const index = keys[i] as string;
    const value = state;
    if (start) {
      const indexData = index.split(',');
      if (indexData.length === currentIndexLength) {
        start = false;
      } else {
        result.push(value._vtable_rowSeries_number);
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
    table.stateManager.setCheckedState(col, row, '_vtable_rowSeries_number', true);
    setCellCheckboxStateByAttribute(col, row, true, table);
  } else if (allUnChecked) {
    table.stateManager.setCheckedState(col, row, '_vtable_rowSeries_number', false);
    setCellCheckboxStateByAttribute(col, row, false, table);
  } else {
    table.stateManager.setCheckedState(col, row, '_vtable_rowSeries_number', 'indeterminate');
    setCellCheckboxStateByAttribute(col, row, 'indeterminate', table);
  }
}

// update invisible children checkbox state(collapsed)
function updateChildrenCheckboxState(state: boolean, currentIndex: number | number[], table: BaseTableAPI) {
  const { checkedState } = table.stateManager;
  const key = currentIndex.toString();
  const currentIndexLength = isArray(currentIndex) ? currentIndex.length : 1;
  let start = false;

  checkedState.forEach((value, index: string) => {
    if (start) {
      const indexData = index.split(',');
      if (indexData.length === currentIndexLength) {
        start = false;
      } else {
        value._vtable_rowSeries_number = state;
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
