import type { FederatedPointerEvent, IEventTarget } from '@src/vrender';
import type { Group } from '../scenegraph/graphic/group';

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
    target: IEventTarget;
  };
}

export function getCellEventArgsSet(e: FederatedPointerEvent): SceneEvent {
  const tableEvent: SceneEvent = {
    abstractPos: {
      x: e.x,
      y: e.y
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
      target: e.target
    };
  }
  return tableEvent;
}

function getTargetCell(target: any) {
  while (target && target.parent) {
    if (target.role === 'cell') {
      return target;
    }
    target = target.parent;
  }
  return null;
}
