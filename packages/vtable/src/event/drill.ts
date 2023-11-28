import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { DrillMenuEventInfo, MousePointerCellEvent, PivotTableAPI } from '../ts-types';
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
      table.stateManager.updateDrillState(
        dimension.dimensionKey,
        dimension.title,
        dimension.drillDown,
        dimension.drillUp,
        col,
        row
      );
    } else {
      table.stateManager.updateDrillState(undefined, undefined, false, false, -1, -1);
    }
  });
  table.on(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, (e: MousePointerCellEvent) => {
    table.stateManager.updateDrillState(undefined, undefined, false, false, -1, -1);
  });
}

export function drillClick(table: BaseTableAPI) {
  table.fireListeners(PIVOT_TABLE_EVENT_TYPE.DRILLMENU_CLICK, table.stateManager.drill as DrillMenuEventInfo);
}

export function checkHaveDrill(table: PivotTableAPI) {
  const rowsDefine = (table.internalProps.layoutMap as PivotHeaderLayoutMap).rowsDefine;
  const columnsDefine = (table.internalProps.layoutMap as PivotHeaderLayoutMap).columnsDefine;
  for (let i = 0; i < rowsDefine.length; i++) {
    const row = rowsDefine[i];
    if (typeof row !== 'string' && (row.drillDown || row.drillUp)) {
      return true;
    }
  }
  for (let i = 0; i < columnsDefine.length; i++) {
    const column = columnsDefine[i];
    if (typeof column !== 'string' && (column.drillDown || column.drillUp)) {
      return true;
    }
  }
  return false;
}
