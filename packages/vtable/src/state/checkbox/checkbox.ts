import { isArray, isFunction, isNumber, isObject, isValid } from '@visactor/vutils';
import type { StateManager } from '../state';
import type { CheckboxColumnDefine, ListTableAPI } from '../../ts-types';
import { getOrApply } from '../../tools/helper';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { CachedDataSource } from '../../data';
import type { CheckBox } from '@src/vrender';

export function setCheckedState(
  col: number,
  row: number,
  field: string | number,
  checked: boolean | 'indeterminate',
  state: StateManager
) {
  const recordIndex = state.table.getRecordShowIndexByCell(col, row);
  if (recordIndex >= 0) {
    const dataIndex = state.table.dataSource.getIndexKey(recordIndex).toString();
    if (state.checkedState.has(dataIndex)) {
      state.checkedState.get(dataIndex)[field] = checked;
    } else {
      state.checkedState.set(dataIndex, {
        [field]: checked
      });
    }
  }
}

export function setHeaderCheckedState(field: string | number, checked: boolean | 'indeterminate', state: StateManager) {
  state.headerCheckedState[field] = checked;
  state.checkedState?.forEach(recordCheckState => {
    recordCheckState[field] = checked;
  });
}

//#region CheckedState 状态维护

/**
 * 创建cell节点时同步状态 如果状态缓存有则用 如果没有则设置缓存
 * @param col
 * @param row
 * @param field
 * @param checked
 * @returns
 */
export function syncCheckedState(
  col: number,
  row: number,
  field: string | number,
  checked: boolean,
  state: StateManager
): boolean | 'indeterminate' {
  if (state.table.isHeader(col, row)) {
    if (isValid(state.headerCheckedState[field])) {
      return state.headerCheckedState[field];
    } else if (typeof checked === 'function') {
      return undefined;
    } else if (isValid(checked)) {
      state.headerCheckedState[field] = checked;
    } else if (state.checkedState?.size > 0) {
      const isAllChecked = state.updateHeaderCheckedState(field, col, row);
      return isAllChecked;
    }
    return state.headerCheckedState[field];
  }
  const recordIndex = state.table.getRecordShowIndexByCell(col, row);
  if (recordIndex >= 0) {
    const dataIndex = state.table.dataSource.getIndexKey(recordIndex).toString();
    if (isValid(state.checkedState.get(dataIndex)?.[field])) {
      return state.checkedState.get(dataIndex)[field];
    }
    if (state.checkedState.has(dataIndex)) {
      state.checkedState.get(dataIndex)[field] = checked;
    } else {
      state.checkedState.set(dataIndex, {
        [field]: checked
      });
    }
  }
  return checked;
}

/**
 * 初始化check状态
 * @param records
 */
export function initCheckedState(records: any[], state: StateManager) {
  // clear checkbox state
  state.checkedState.clear();
  state.headerCheckedState = {};
  state.radioState = {};

  let isNeedInitHeaderCheckedStateFromRecord = false;
  state._checkboxCellTypeFields = [];
  state._headerCheckFuncs = {};
  state.table.internalProps.layoutMap.headerObjects.forEach((hd, index) => {
    if (hd.headerType === 'checkbox') {
      const headerChecked = (hd.define as CheckboxColumnDefine).checked as boolean;

      if (headerChecked === undefined || headerChecked === null || typeof headerChecked === 'function') {
        // 如果没有明确指定check的状态 则需要在下面遍历所有数据获取到节点状态 确定这个header的check状态
        isNeedInitHeaderCheckedStateFromRecord = true;
        if (typeof headerChecked === 'function') {
          state._headerCheckFuncs[hd.field as string | number] = headerChecked;
        }
      } else {
        state.headerCheckedState[hd.field as string | number] = headerChecked;
      }
      if ((hd.define.cellType === 'checkbox' || isFunction(hd.define.cellType)) && !hd.fieldFormat) {
        state._checkboxCellTypeFields.push(hd.field as string | number);
      }
    }
  });

  // for row series number
  if (state.table.leftRowSeriesNumberCount === 1) {
    state.headerCheckedState._vtable_rowSeries_number = false;
    state._checkboxCellTypeFields.push('_vtable_rowSeries_number');
    isNeedInitHeaderCheckedStateFromRecord = true;
  } else if (state.table.leftRowSeriesNumberCount > 1) {
    for (let i = 0; i < state.table.leftRowSeriesNumberCount; i++) {
      state.headerCheckedState[`_vtable_rowSeries_number_${i}`] = false;
      state._checkboxCellTypeFields.push(`_vtable_rowSeries_number_${i}`);
    }
    isNeedInitHeaderCheckedStateFromRecord = true;
  }

  //如果没有明确指定check的状态 遍历所有数据获取到节点状态 确定这个header的check状态
  if (isNeedInitHeaderCheckedStateFromRecord) {
    initRecordCheckState(records, state);
  }
}

/**
 * 更新header单元checked的状态，依据当前列每一个数据checked的状态。
 * @param field
 * @returns
 */
export function updateHeaderCheckedState(
  field: string | number,
  state: StateManager,
  col: number,
  row: number
): boolean | 'indeterminate' {
  let allChecked = true;
  let allUnChecked = true;
  let hasChecked = false;
  state.checkedState.forEach((check_state: Record<string | number, boolean>, index: string | number | number[]) => {
    if ((index as string).includes(',')) {
      index = (index as string).split(',').map(item => {
        return Number(item);
      }) as number[];
    } else {
      index = Number(index);
    }
    const tableIndex = state.table.getTableIndexByRecordIndex(index as number);
    const mergeCell = (state.table as ListTableAPI).transpose
      ? state.table.getCustomMerge(tableIndex, row)
      : state.table.getCustomMerge(col, tableIndex);

    const data = state.table.dataSource?.get(index as number);
    if (mergeCell || (!state.table.internalProps.rowSeriesNumber?.enableTreeCheckbox && data?.vtableMerge)) {
      // 不参与check状态的计算
      return;
    }
    if (check_state?.[field] !== true) {
      allChecked = false;
    } else {
      allUnChecked = false;
      hasChecked = true;
    }
  });

  if (allChecked) {
    state.headerCheckedState[field] = true;
    return allChecked;
  }

  if (allUnChecked) {
    state.headerCheckedState[field] = false;
    return false;
  }

  if (hasChecked) {
    state.headerCheckedState[field] = 'indeterminate';
    return 'indeterminate'; //半选状态
  }
  return false;
}

/**
 * setRecords的时候虽然调用了initCheckedState 进行了初始化 但当每个表头的checked状态都用配置了的话 初始化不会遍历全部数据
 * @param records
 */
export function initLeftRecordsCheckState(records: any[], state: StateManager) {
  for (let index = state.checkedState.size; index < records.length; index++) {
    const record = records[index];
    state._checkboxCellTypeFields.forEach(field => {
      const value = record[field] as string | { text: string; checked: boolean; disable: boolean } | boolean;
      let isChecked;
      if (isObject(value)) {
        isChecked = value.checked;
      } else if (typeof value === 'boolean') {
        isChecked = value;
      }
      const dataIndex = index.toString();
      if (!state.checkedState.get(dataIndex)) {
        state.checkedState.set(dataIndex, {});
      }
      state.checkedState.get(dataIndex)[field] = isChecked;
    });
  }
}

export function setCellCheckboxState(
  col: number,
  row: number,
  checked: boolean | 'indeterminate',
  table: BaseTableAPI
) {
  const cellGroup = table.scenegraph.getCell(col, row);
  const checkbox = cellGroup?.getChildByName('checkbox') as any;
  if (!checkbox) {
    // update state
    const field = table.getHeaderField(col, row);
    if (table.isHeader(col, row)) {
      //点击的表头部分的checkbox 需要同时处理表头和body单元格的状态
      table.stateManager.setHeaderCheckedState(field, checked);
      const cellType = table.getCellType(col, row);
      if (cellType === 'checkbox') {
        table.scenegraph.updateCheckboxCellState(col, row, checked);
      }
    } else {
      //点击的是body单元格的checkbox  处理本单元格的状态维护 同时需要检查表头是否改变状态
      table.stateManager.setCheckedState(col, row, field, checked);
      const cellType = table.getCellType(col, row);
      if (cellType === 'checkbox') {
        const oldHeaderCheckedState = table.stateManager.headerCheckedState[field];
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState(field, col, row);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    }
    return;
  }
  const { checked: oldChecked, indeterminate } = checkbox.attribute;

  if (indeterminate) {
    if (checked) {
      checkbox._handlePointerUp();
    } else {
      checkbox._handlePointerUp();
      checkbox._handlePointerUp();
    }
  } else if (oldChecked) {
    if (checked) {
      // do nothing
    } else {
      checkbox._handlePointerUp();
    }
  } else {
    if (checked) {
      checkbox._handlePointerUp();
    } else {
      // do nothing
    }
  }
}

export function setCellCheckboxStateByAttribute(
  col: number,
  row: number,
  checked: boolean | 'indeterminate',
  table: BaseTableAPI
) {
  const cellGroup = table.scenegraph.getCell(col, row);
  const checkbox = cellGroup?.getChildByName('checkbox') as any;
  if (checkbox) {
    if (checked === 'indeterminate') {
      (checkbox as CheckBox).setAttribute('indeterminate', true);
      (checkbox as CheckBox).setAttribute('checked', undefined);
    } else {
      (checkbox as CheckBox).setAttribute('indeterminate', undefined);
      (checkbox as CheckBox).setAttribute('checked', checked);
    }
  }
}

export function changeCheckboxOrder(sourceIndex: number, targetIndex: number, state: StateManager) {
  const { checkedState, table } = state;
  let source;
  let target;
  if (table.internalProps.transpose) {
    sourceIndex = table.getRecordShowIndexByCell(sourceIndex, 0);
    targetIndex = table.getRecordShowIndexByCell(targetIndex, 0);
  } else {
    // sourceIndex = table.getRecordShowIndexByCell(0, sourceIndex);
    // targetIndex = table.getRecordShowIndexByCell(0, targetIndex);

    source = table.isPivotTable() ? undefined : (table as any).getRecordIndexByCell(0, sourceIndex);
    target = table.isPivotTable() ? undefined : (table as any).getRecordIndexByCell(0, targetIndex);
  }

  if (isNumber(source) && isNumber(target)) {
    if (sourceIndex > targetIndex) {
      const sourceRecord = checkedState.get(sourceIndex.toString());
      for (let i = sourceIndex; i > targetIndex; i--) {
        // checkedState[i] = checkedState[i - 1];
        checkedState.set(i.toString(), checkedState.get((i - 1).toString()));
      }
      // checkedState[targetIndex] = sourceRecord;
      checkedState.set(targetIndex.toString(), sourceRecord);
    } else if (sourceIndex < targetIndex) {
      const sourceRecord = checkedState.get(sourceIndex.toString());
      for (let i = sourceIndex; i < targetIndex; i++) {
        // checkedState[i] = checkedState[i + 1];
        checkedState.set(i.toString(), checkedState.get((i + 1).toString()));
      }
      // checkedState[targetIndex] = sourceRecord;
      checkedState.set(targetIndex.toString(), sourceRecord);
    }
  } else if (isArray(source) && isArray(target)) {
    sourceIndex = source[source.length - 1];
    targetIndex = target[target.length - 1];
    if (sourceIndex > targetIndex) {
      const sourceRecord = checkedState.get(source.toString());
      for (let i = sourceIndex; i > targetIndex; i--) {
        const now = [...source];
        now[now.length - 1] = i;
        const last = [...source];
        last[last.length - 1] = i - 1;
        checkedState.set(now.toString(), checkedState.get(last.toString()));
      }
      // checkedState[targetIndex] = sourceRecord;
      checkedState.set(target.toString(), sourceRecord);
    } else if (sourceIndex < targetIndex) {
      const sourceRecord = checkedState.get(source.toString());
      for (let i = sourceIndex; i < targetIndex; i++) {
        const now = [...source];
        now[now.length - 1] = i;
        const next = [...source];
        next[next.length - 1] = i + 1;
        checkedState.set(now.toString(), checkedState.get(next.toString()));
      }
      // checkedState[targetIndex] = sourceRecord;
      checkedState.set(target.toString(), sourceRecord);
    }
  }
}

export function getGroupCheckboxState(table: BaseTableAPI) {
  const result: any[] = [];
  const dataSource = table.dataSource as CachedDataSource;
  const groupKeyLength = dataSource.dataConfig.groupByRules.length + 1;
  dataSource.currentIndexedData.forEach((indexArr: number, index) => {
    if (isArray(indexArr) && indexArr.length === groupKeyLength) {
      // get record by index
      const vtableOriginIndex = (dataSource as CachedDataSource).getOriginRecordIndexForGroup(indexArr);
      result[vtableOriginIndex] = table.stateManager.checkedState.get(indexArr.toString());
    }
  });

  return result;
}

function initRecordCheckState(records: any[], state: StateManager) {
  const table = state.table;
  const start = table.isPivotTable()
    ? 0
    : table.internalProps.transpose
    ? table.rowHeaderLevelCount
    : table.columnHeaderLevelCount;
  const end = table.isPivotTable()
    ? isArray(records)
      ? records.length
      : 0
    : table.internalProps.transpose
    ? table.colCount
    : table.rowCount;
  for (let index = 0; index + start < end; index++) {
    const record = table.isPivotTable() ? records[index] : table.dataSource.get(index);
    // eslint-disable-next-line no-loop-func
    state._checkboxCellTypeFields.forEach(field => {
      const value =
        record && (record[field] as string | { text: string; checked: boolean; disable: boolean } | boolean);
      let isChecked;
      if (isObject(value)) {
        isChecked = value.checked;
      } else if (typeof value === 'boolean') {
        isChecked = value;
      }
      if (isChecked === undefined || isChecked === null) {
        const headerCheckFunc = state._headerCheckFuncs[field];
        if (headerCheckFunc) {
          //如果定义的checked是个函数 则需要每个都去计算这个值
          const cellAddr = state.table.getCellAddrByFieldRecord(field, index);
          const globalChecked = getOrApply(headerCheckFunc as any, {
            col: cellAddr.col,
            row: cellAddr.row,
            table: state.table,
            context: null,
            value
          });
          isChecked = globalChecked;
        }
      }
      const dataIndex = table.isPivotTable() ? index.toString() : state.table.dataSource.getIndexKey(index).toString();
      if (!state.checkedState.get(dataIndex)) {
        state.checkedState.set(dataIndex, {});
      }
      state.checkedState.get(dataIndex)[field] = isChecked;
    });
  }
}
