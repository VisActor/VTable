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
      table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
        target: { col: table.stateManager.columnMove.colTarget, row: table.stateManager.columnMove.rowTarget },
        source: {
          col: table.stateManager.columnMove.colSource,
          row: table.stateManager.columnMove.rowSource
        },
        event: e
      });
    }
  } else if (!endMoveColSuccess) {
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_FAIL)) {
      table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_FAIL, {
        target: { col: table.stateManager.columnMove.colTarget, row: table.stateManager.columnMove.rowTarget },
        source: {
          col: table.stateManager.columnMove.colSource,
          row: table.stateManager.columnMove.rowSource
        },
        event: e
      });
    }
  }
}
