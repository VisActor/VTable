import { isBoolean, isNumber, isObject, isValid } from '@visactor/vutils';
import type { StateManager } from '../state';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ColumnDefine } from '../../ts-types';
import type { Radio } from '@src/vrender';

export function setRadioState(
  col: number,
  row: number,
  field: string | number,
  type: 'column' | 'cell',
  indexInCell: number | undefined,
  state: StateManager
) {
  const recordIndex = state.table.getRecordShowIndexByCell(col, row);
  if (recordIndex >= 0) {
    const dataIndex = state.table.dataSource.getIndexKey(recordIndex) as number;
    if (type === 'column') {
      if (isNumber(indexInCell)) {
        state.radioState[field] = {};
        state.radioState[field][dataIndex] = indexInCell;
      } else {
        state.radioState[field] = dataIndex;
      }
    } else {
      if (!state.radioState[field]) {
        state.radioState[field] = {};
      }
      if (isNumber(indexInCell)) {
        state.radioState[field][dataIndex] = indexInCell;
      } else {
        state.radioState[field][dataIndex] = true;
      }
    }
  }
}

export function getCellRadioState(col: number, row: number, table: BaseTableAPI): boolean | number {
  const define = table.getBodyColumnDefine(col, row) as ColumnDefine;
  const field = define?.field;
  const cellType = table.getCellType(col, row);
  if (isValid(field) && cellType === 'radio') {
    const dataIndex = table.dataSource.getIndexKey(table.getRecordShowIndexByCell(col, row)) as number;
    const columnState = table.stateManager.radioState?.[field as string | number];
    if (isNumber(columnState)) {
      if (columnState === dataIndex) {
        return true;
      }
    } else if (isObject(columnState)) {
      const cellState = (columnState as Record<number, number>)[dataIndex];
      if (isNumber(cellState)) {
        return cellState;
      }
    }
  }
  return false;
}

export function syncRadioState(
  col: number,
  row: number,
  field: string | number,
  type: 'column' | 'cell',
  indexInCell: number | undefined,
  isChecked: boolean,
  state: StateManager
): boolean {
  const recordIndex = state.table.getRecordShowIndexByCell(col, row);
  if (recordIndex >= 0) {
    const dataIndex = state.table.dataSource.getIndexKey(recordIndex) as number;

    if (type === 'column') {
      if (!isValid(state.radioState[field]) && isChecked) {
        if (isNumber(indexInCell)) {
          state.radioState[field] = {};
          state.radioState[field][dataIndex] = indexInCell;
        } else {
          state.radioState[field] = dataIndex;
        }
        return true;
      } else if (isNumber(state.radioState[field]) && !isNumber(indexInCell)) {
        // column : column
        return state.radioState[field] === dataIndex;
      } else if (isNumber(state.radioState[field]) && isNumber(indexInCell)) {
        // column : cell
        return false;
      } else if (isObject(state.radioState[field]) && !isNumber(indexInCell)) {
        // cell : column
        return false;
      } else if (isObject(state.radioState[field]) && isNumber(indexInCell)) {
        // cell : cell
        return state.radioState[field][dataIndex] === indexInCell;
      }
    } else if (type === 'cell') {
      if (!isValid(state.radioState[field]) && isChecked) {
        state.radioState[field] = {};
        if (isNumber(indexInCell)) {
          state.radioState[field][dataIndex] = indexInCell;
        } else {
          state.radioState[field][dataIndex] = true;
        }
        return true;
      } else if (!isValid(state.radioState[field]?.[dataIndex]) && isChecked) {
        if (isNumber(indexInCell)) {
          state.radioState[field][dataIndex] = indexInCell;
        } else {
          state.radioState[field][dataIndex] = true;
        }
        return true;
      } else if (isBoolean(state.radioState[field]?.[dataIndex]) && !isNumber(indexInCell)) {
        // single : single
        return state.radioState[field][dataIndex];
      } else if (isBoolean(state.radioState[field]?.[dataIndex]) && isNumber(indexInCell)) {
        // single : multiple
        return false;
      } else if (isNumber(state.radioState[field]?.[dataIndex]) && !isNumber(indexInCell)) {
        // multiple : single
        return false;
      } else if (isNumber(state.radioState[field]?.[dataIndex]) && isNumber(indexInCell)) {
        // multiple : multiple
        return state.radioState[field][dataIndex] === indexInCell;
      }
    }
  }
  return isChecked;
}

export function setCellRadioState(col: number, row: number, index: number | undefined, table: BaseTableAPI) {
  const cellGoup = table.scenegraph.getCell(col, row);
  if (!cellGoup) {
    return;
  }
  if (isNumber(index)) {
    const radio = cellGoup.getChildAt(index) as any;
    radio?._handlePointerUp();
  } else {
    const radio = cellGoup.getChildByName('radio') as any;
    radio?._handlePointerUp();
  }
}

export function changeRadioOrder(sourceIndex: number, targetIndex: number, state: StateManager) {
  const { radioState, table } = state;
  if (table.internalProps.transpose) {
    sourceIndex = table.getRecordShowIndexByCell(sourceIndex, 0);
    targetIndex = table.getRecordShowIndexByCell(targetIndex, 0);
  } else {
    sourceIndex = table.getRecordShowIndexByCell(0, sourceIndex);
    targetIndex = table.getRecordShowIndexByCell(0, targetIndex);
  }
  // if (sourceIndex !== targetIndex) {
  //   const sourceRecord = radioState[sourceIndex];
  //   radioState[sourceIndex] = radioState[targetIndex];
  //   radioState[targetIndex] = sourceRecord;
  // }
  if (sourceIndex > targetIndex) {
    const sourceRecord = radioState[sourceIndex];
    for (let i = sourceIndex; i > targetIndex; i--) {
      radioState[i] = radioState[i - 1];
    }
    radioState[targetIndex] = sourceRecord;
  } else if (sourceIndex < targetIndex) {
    const sourceRecord = radioState[sourceIndex];
    for (let i = sourceIndex; i < targetIndex; i++) {
      radioState[i] = radioState[i + 1];
    }
    radioState[targetIndex] = sourceRecord;
  }
}
