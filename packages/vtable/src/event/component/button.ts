import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { MousePointerCellEvent } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function bindButtonClickEvent(table: BaseTableAPI) {
  table.on(TABLE_EVENT_TYPE.CLICK_CELL, (e: MousePointerCellEvent) => {
    const { col, row, target } = e;
    if (target.name === 'button' && !(target.attribute as any).disable) {
      if ((table as any).hasListeners(TABLE_EVENT_TYPE.BUTTON_CLICK)) {
        table.fireListeners(TABLE_EVENT_TYPE.BUTTON_CLICK, { col, row, event: e.event });
      }
    }
  });
}
