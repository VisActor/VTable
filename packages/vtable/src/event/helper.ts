import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { ListTableAPI } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

export function fireMoveColEventListeners(table: BaseTableAPI, endMoveColSuccess: boolean, e: Event) {
  if (
    endMoveColSuccess &&
    table.stateManager.columnMove?.colSource !== -1 &&
    table.stateManager.columnMove?.rowSource !== -1 &&
    table.stateManager.columnMove?.colTarget !== -1 &&
    table.stateManager.columnMove?.rowTarget !== -1
  ) {
    // 下面触发CHANGE_HEADER_POSITION 区别于pointerup
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
      const { colSource, rowSource, colTarget, rowTarget, movingColumnOrRow } = table.stateManager.columnMove;
      const rowSourceSize = table.stateManager.columnMove.rowSourceSize ?? 0;
      const rowTargetSize = table.stateManager.columnMove.rowTargetSize ?? 0;
      table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
        target: { col: colTarget, row: rowTarget + rowTargetSize - rowSourceSize },
        source: {
          col: colSource,
          row: rowSource
        },
        movingColumnOrRow,
        event: e
      });
    }
  } else if (!endMoveColSuccess) {
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_FAIL)) {
      const rowSourceSize = table.stateManager.columnMove.rowSourceSize ?? 0;
      const rowTargetSize = table.stateManager.columnMove.rowTargetSize ?? 0;
      table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_FAIL, {
        target: {
          col: table.stateManager.columnMove.colTarget,
          row: table.stateManager.columnMove.rowTarget + rowTargetSize - rowSourceSize
        },
        source: {
          col: table.stateManager.columnMove.colSource,
          row: table.stateManager.columnMove.rowSource
        },
        movingColumnOrRow: table.stateManager.columnMove.movingColumnOrRow,
        event: e
      });
    }
  }
}
