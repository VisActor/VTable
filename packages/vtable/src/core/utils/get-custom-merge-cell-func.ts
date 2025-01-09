import { isArray, isFunction } from '@visactor/vutils';
import type { CustomMergeCell } from '../../ts-types';

export function getCustomMergeCellFunc(customMergeCell?: CustomMergeCell) {
  if (isFunction(customMergeCell)) {
    return customMergeCell;
  }
  if (isArray(customMergeCell)) {
    return (col: number, row: number) => {
      return customMergeCell.find(item => {
        return (
          item.range.start.col <= col &&
          item.range.end.col >= col &&
          item.range.start.row <= row &&
          item.range.end.row >= row
        );
      });
    };
  }
  return undefined;
}
