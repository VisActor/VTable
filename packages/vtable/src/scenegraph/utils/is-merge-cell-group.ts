import { isNumber } from '@visactor/vutils';
import type { Group } from '../graphic/group';

export function isMergeCellGroup(cellGroup: Group) {
  if (
    cellGroup.role === 'cell' &&
    isNumber(cellGroup.mergeStartCol) &&
    isNumber(cellGroup.mergeStartRow) &&
    isNumber(cellGroup.mergeEndCol) &&
    isNumber(cellGroup.mergeEndRow)
  ) {
    return true;
  }
  return false;
}
