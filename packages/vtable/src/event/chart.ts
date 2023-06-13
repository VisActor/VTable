import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { SimpleHeaderLayoutMap } from '../layout';
import type { PivoLayoutMap } from '../layout/pivot-layout';
import type { MousePointerCellEvent } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

export function bindChartHoverEvent(table: BaseTableAPI) {
  // 判断是否有sparkline 类型
  let hasSparkLine = false;
  if (table.isPivotTable()) {
    const layoutMap = table.internalProps.layoutMap as PivoLayoutMap;
    hasSparkLine = layoutMap.indicatorsDefine.some(indicator => {
      return typeof indicator !== 'string' && indicator.columnType === 'sparkline';
    });
  } else {
    const layoutMap = table.internalProps.layoutMap as SimpleHeaderLayoutMap;
    hasSparkLine = layoutMap.columnObjects.some(column => {
      return column.columnType === 'sparkline';
    });
  }

  if (!hasSparkLine) {
    return;
  }

  table.listen(TABLE_EVENT_TYPE.MOUSEMOVE_CELL, (e: MousePointerCellEvent) => {
    const { col, row, x, y } = e;
    const type = table.getBodyColumnType(col, row);
    if (type !== 'sparkline') {
      table.stateManeger.updateChartHoverPose(-1, -1, 0, 0);
    }
    table.stateManeger.updateChartHoverPose(col, row, x, y);
  });
}
