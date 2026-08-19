import { isBoolean, isNumber, isObject, isValid } from '@visactor/vutils';
import type { StateManager } from '../state';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ColumnDefine } from '../../ts-types';
import type { Radio } from '@src/vrender';

type RecordPath = number | number[];
type RadioStateValue = boolean | number | number[] | Record<string | number, boolean | number>;

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

function normalizeRecordPath(recordPath: RecordPath): number[] {
  return Array.isArray(recordPath) ? recordPath : [recordPath];
}

function parseRecordPathKey(key: string | number): number[] {
  return isNumber(key) ? [key] : key.split(',').map(item => Number(item));
}

function isSameRecordPath(source: number[], target: number[]): boolean {
  return source.length === target.length && source.every((item, index) => item === target[index]);
}

function isSameParentPath(source: number[], target: number[]): boolean {
  if (source.length !== target.length) {
    return false;
  }
  return source.slice(0, -1).every((item, index) => item === target[index]);
}

function isDescendantPath(path: number[], ancestor: number[]): boolean {
  return ancestor.length <= path.length && ancestor.every((item, index) => item === path[index]);
}

function getMovedRecordPath(path: number[], source: number[], target: number[]): number[] {
  return target.concat(path.slice(source.length));
}

function getShiftedSiblingPath(path: number[], parent: number[], sourceIndex: number, targetIndex: number): number[] {
  if (path.length <= parent.length || !isDescendantPath(path.slice(0, parent.length), parent)) {
    return path;
  }

  const siblingIndex = path[parent.length];
  if (sourceIndex < targetIndex && siblingIndex > sourceIndex && siblingIndex <= targetIndex) {
    const shifted = [...path];
    shifted[parent.length] = siblingIndex - 1;
    return shifted;
  }
  if (sourceIndex > targetIndex && siblingIndex >= targetIndex && siblingIndex < sourceIndex) {
    const shifted = [...path];
    shifted[parent.length] = siblingIndex + 1;
    return shifted;
  }
  return path;
}

function getChangedRecordPath(path: number[], sourcePath: number[], targetPath: number[]): number[] {
  const parentPath = sourcePath.slice(0, -1);
  const sourceIndex = sourcePath[sourcePath.length - 1];
  const targetIndex = targetPath[targetPath.length - 1];

  if (isDescendantPath(path, sourcePath)) {
    return getMovedRecordPath(path, sourcePath, targetPath);
  }
  return getShiftedSiblingPath(path, parentPath, sourceIndex, targetIndex);
}

function getRadioStateValue(recordPath: number[]): number | number[] {
  return recordPath.length === 1 ? recordPath[0] : recordPath;
}

function getRadioStateKey(recordPath: number[]): string {
  return recordPath.toString();
}

function changeRadioStateValue(value: RadioStateValue, sourcePath: number[], targetPath: number[]): RadioStateValue {
  if (isNumber(value)) {
    return getRadioStateValue(getChangedRecordPath([value], sourcePath, targetPath));
  }
  if (Array.isArray(value)) {
    return getRadioStateValue(getChangedRecordPath(value, sourcePath, targetPath));
  }
  if (isObject(value)) {
    const nextValue: Record<string | number, boolean | number> = {};
    Object.keys(value).forEach(key => {
      const nextPath = getChangedRecordPath(parseRecordPathKey(key), sourcePath, targetPath);
      nextValue[getRadioStateKey(nextPath)] = value[key];
    });
    return nextValue;
  }
  return value;
}

export function changeRadioOrder(sourceRecordPath: RecordPath, targetRecordPath: RecordPath, state: StateManager) {
  const { radioState } = state;
  const sourcePath = normalizeRecordPath(sourceRecordPath);
  const targetPath = normalizeRecordPath(targetRecordPath);

  if (isSameRecordPath(sourcePath, targetPath) || !isSameParentPath(sourcePath, targetPath)) {
    return;
  }

  Object.keys(radioState).forEach(field => {
    radioState[field] = changeRadioStateValue(radioState[field] as RadioStateValue, sourcePath, targetPath);
  });
}
