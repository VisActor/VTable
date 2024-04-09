import { isNumber } from '@visactor/vutils';
import type { StateManager } from '../state';

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
      state.radioState[field] = dataIndex;
    } else if (isNumber(indexInCell)) {
      if (!state.radioState[field]) {
        state.radioState[field] = {};
      }
      state.radioState[field][dataIndex] = indexInCell;
    }
  }
}
