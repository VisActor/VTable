import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { DrillMenuEventInfo, MousePointerCellEvent } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';
import { PIVOT_TABLE_EVENT_TYPE } from '../ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';

export function bindDrillEvent(table: BaseTableAPI) {
  table.on(TABLE_EVENT_TYPE.MOUSEENTER_CELL, (e: MousePointerCellEvent) => {
    //是否需要显示出上钻下钻按钮
    // if (!table.isPivotTable()) {
    //   return;
    // }
    const { col, row } = e;
    if (col === -1 || row === -1) {
      return;
    }
    const dimension = (table.internalProps.layoutMap as PivotHeaderLayoutMap).getHeaderDimension(col, row);
    if (dimension?.drillDown || dimension?.drillUp) {
      table.stateManeger.updateDrillState(
        dimension.dimensionKey,
        dimension.dimensionTitle,
        dimension.drillDown,
        dimension.drillUp,
        col,
        row
      );
    } else {
      table.stateManeger.updateDrillState(undefined, undefined, false, false, -1, -1);
    }
  });
}

export function drillClick(table: BaseTableAPI) {
  table.fireListeners(PIVOT_TABLE_EVENT_TYPE.DRILLMENU_CLICK, table.stateManeger.drill as DrillMenuEventInfo);
}
