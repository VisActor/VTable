import type { FederatedPointerEvent, IEventTarget } from '@src/vrender';
import type { Group } from '../scenegraph/graphic/group';
import type { MergeCellInfo } from '../ts-types';
import { isValid } from '@visactor/vutils';

export interface SceneEvent {
  abstractPos: {
    x: number;
    y: number;
  };
  eventArgs?: {
    col: number;
    row: number;
    event: FederatedPointerEvent;
    targetCell: Group;
    mergeInfo?: MergeCellInfo;
    target: IEventTarget;
  };
}

export function getCellEventArgsSet(e: FederatedPointerEvent): SceneEvent {
  const tableEvent: SceneEvent = {
    abstractPos: {
      // x: e.x,
      // y: e.y,
      x: e.viewport.x,
      y: e.viewport.y
    }
    // eventArgs: {
    //   col: (e.target as any).col,
    //   row: (e.target as any).row,
    //   event: e,
    // },
  };
  const targetCell = getTargetCell(e.target);
  if (targetCell) {
    tableEvent.eventArgs = {
      col: targetCell.col,
      row: targetCell.row,
      event: e,
      targetCell,
      mergeInfo: getMergeCellInfo(targetCell),
      target: e.target
    };
  }
  return tableEvent;
}

export function getTargetCell(target: any) {
  while (target && target.parent) {
    if (target.role === 'cell') {
      return target;
    }
    target = target.parent;
  }
  return null;
}

function getMergeCellInfo(cellGroup: Group): MergeCellInfo | undefined {
  if (
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    return {
      colStart: cellGroup.mergeStartCol,
      colEnd: cellGroup.mergeEndCol,
      rowStart: cellGroup.mergeStartRow,
      rowEnd: cellGroup.mergeEndRow
    };
  }
  return undefined;
}

export const regIndexReg = /radio-\d+-\d+-(\d+)/;
