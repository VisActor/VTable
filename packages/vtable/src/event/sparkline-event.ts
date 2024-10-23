import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { SimpleHeaderLayoutMap } from '../layout';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { MousePointerCellEvent } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

export function bindSparklineHoverEvent(table: BaseTableAPI) {
  if (table.eventManager.bindSparklineHoverEvent) {
    return;
  }

  // 判断是否有sparkline 类型
  let hasSparkLine = false;
  if (table.isPivotTable()) {
    const layoutMap = table.internalProps.layoutMap as PivotHeaderLayoutMap;
    hasSparkLine = layoutMap.indicatorsDefine.some(indicator => {
      return typeof indicator !== 'string' && indicator.cellType === 'sparkline';
    });
  } else {
    const layoutMap = table.internalProps.layoutMap as SimpleHeaderLayoutMap;
    hasSparkLine = layoutMap.columnObjects.some(column => {
      return column.cellType === 'sparkline' || typeof column.cellType === 'function';
    });
  }

  if (!hasSparkLine) {
    return;
  }

  table.eventManager.bindSparklineHoverEvent = true;

  table.on(TABLE_EVENT_TYPE.MOUSEMOVE_CELL, (e: MousePointerCellEvent) => {
    const { col, row, x, y } = e;
    const type = table.getBodyColumnType(col, row);
    if (type !== 'sparkline') {
      table.stateManager.updateSparklineHoverPose(-1, -1, 0, 0);
    }
    table.stateManager.updateSparklineHoverPose(col, row, x, y);
  });

  table.on(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, (e: MousePointerCellEvent) => {
    table.stateManager.updateSparklineHoverPose(-1, -1, 0, 0);
  });
}
