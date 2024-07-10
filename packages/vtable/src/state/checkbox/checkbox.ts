import { isObject, isValid } from '@visactor/vutils';
import type { StateManager } from '../state';
import type { CheckboxColumnDefine } from '../../ts-types';
import { getOrApply } from '../../tools/helper';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { CheckBox } from '@visactor/vrender-components';

export function setCheckedState(
  col: number,
  row: number,
  field: string | number,
  checked: boolean,
  state: StateManager
) {
  const recordIndex = state.table.getRecordShowIndexByCell(col, row);
  if (recordIndex >= 0) {
    const dataIndex = state.table.dataSource.getIndexKey(recordIndex) as number;
    if (state.checkedState[dataIndex]) {
      state.checkedState[dataIndex][field] = checked;
    } else {
      state.checkedState[dataIndex] = {};
      state.checkedState[dataIndex][field] = checked;
    }
  }
}

export function setHeaderCheckedState(field: string | number, checked: boolean, state: StateManager) {
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
    } else if (state.checkedState?.length > 0) {
      const isAllChecked = state.updateHeaderCheckedState(field);
      return isAllChecked;
    }
    return state.headerCheckedState[field];
  }
  const recordIndex = state.table.getRecordShowIndexByCell(col, row);
  if (recordIndex >= 0) {
    const dataIndex = state.table.dataSource.getIndexKey(recordIndex) as number;
    if (isValid(state.checkedState[dataIndex]?.[field])) {
      return state.checkedState[dataIndex][field];
    }
    if (state.checkedState[dataIndex]) {
      state.checkedState[dataIndex][field] = checked;
    } else {
      state.checkedState[dataIndex] = {};
      state.checkedState[dataIndex][field] = checked;
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
  state.checkedState = [];
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
      if (hd.define.cellType === 'checkbox' && !hd.fieldFormat) {
        state._checkboxCellTypeFields.push(hd.field as string | number);
      }
    }
  });
  //如果没有明确指定check的状态 遍历所有数据获取到节点状态 确定这个header的check状态
  if (isNeedInitHeaderCheckedStateFromRecord) {
    records.forEach((record: any, index: number) => {
      state._checkboxCellTypeFields.forEach(field => {
        const value = record[field] as string | { text: string; checked: boolean; disable: boolean } | boolean;
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
        if (!state.checkedState[index]) {
          state.checkedState[index] = {};
        }
        state.checkedState[index][field] = isChecked;
      });
    });
  }
}

/**
 * 更新header单元checked的状态，依据当前列每一个数据checked的状态。
 * @param field
 * @returns
 */
export function updateHeaderCheckedState(field: string | number, state: StateManager): boolean | 'indeterminate' {
  const allChecked = state.checkedState.every((state: Record<string | number, boolean>) => {
    return state[field] === true;
  });
  if (allChecked) {
    state.headerCheckedState[field] = true;
    return allChecked;
  }
  const allUnChecked = state.checkedState.every((state: Record<string | number, boolean>) => {
    return state[field] === false;
  });
  if (allUnChecked) {
    state.headerCheckedState[field] = false;
    return false;
  }
  const hasChecked = state.checkedState.find((state: Record<string | number, boolean>) => {
    return state[field] === true;
  });
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
  for (let index = state.checkedState.length; index < records.length; index++) {
    const record = records[index];
    state._checkboxCellTypeFields.forEach(field => {
      const value = record[field] as string | { text: string; checked: boolean; disable: boolean } | boolean;
      let isChecked;
      if (isObject(value)) {
        isChecked = value.checked;
      } else if (typeof value === 'boolean') {
        isChecked = value;
      }
      if (!state.checkedState[index]) {
        state.checkedState[index] = {};
      }
      state.checkedState[index][field] = isChecked;
    });
  }
}

export function setCellCheckboxState(col: number, row: number, checked: boolean, table: BaseTableAPI) {
  const cellGoup = table.scenegraph.getCell(col, row);
  const chechbox = cellGoup?.getChildByName('checkbox') as any;
  if (!chechbox) {
    return;
  }
  const { checked: oldChecked, indeterminate } = chechbox.attribute;

  if (indeterminate) {
    if (checked) {
      chechbox._handlePointerUp();
    } else {
      chechbox._handlePointerUp();
      chechbox._handlePointerUp();
    }
  } else if (oldChecked) {
    if (checked) {
      // do nothing
    } else {
      chechbox._handlePointerUp();
    }
  } else {
    if (checked) {
      chechbox._handlePointerUp();
    } else {
      // do nothing
    }
  }
}

export function changeCheckboxOrder(sourceIndex: number, targetIndex: number, state: StateManager) {
  const { checkedState, table } = state;
  if (table.internalProps.transpose) {
    sourceIndex = table.getRecordShowIndexByCell(sourceIndex, 0);
    targetIndex = table.getRecordShowIndexByCell(targetIndex, 0);
  } else {
    sourceIndex = table.getRecordShowIndexByCell(0, sourceIndex);
    targetIndex = table.getRecordShowIndexByCell(0, targetIndex);
  }
  if (sourceIndex !== targetIndex) {
    const sourceRecord = checkedState[sourceIndex];
    checkedState[sourceIndex] = checkedState[targetIndex];
    checkedState[targetIndex] = sourceRecord;
  }
}
