import type { FederatedPointerEvent } from '@visactor/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet } from '../util';
import type { PivotLayoutMap } from '../../layout/pivot-layout';
import type { PivotChart } from '../../PivotChart';
import { clearChartCacheImage } from '../../scenegraph/refresh-node/update-chart';

export function bindAxisClickEvent(table: BaseTableAPI) {
  if (!table.isPivotChart()) {
    return;
  }

  table.scenegraph.tableGroup.addEventListener('click', (e: FederatedPointerEvent) => {
    if (e.target.name === 'axis-label') {
      const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
      const { col, row } = eventArgsSet.eventArgs;
      const layout = table.internalProps.layoutMap as PivotLayoutMap;
      let dimensionKey;
      if (layout.indicatorsAsCol) {
        dimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row)[0];
      } else {
        dimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)[0];
      }

      if (
        (table as PivotChart)._selectedDimensionInChart &&
        (table as PivotChart)._selectedDimensionInChart.key === dimensionKey &&
        (table as PivotChart)._selectedDimensionInChart.value === (e.target.attribute as any).text
      ) {
        return;
      }

      (table as PivotChart)._selectedDimensionInChart = {
        key: dimensionKey,
        value: (e.target.attribute as any).text
      };

      layout.updateDataStateToChartInstance();
      // 清除chart缓存图片
      clearChartCacheImage(table.scenegraph);
    } else if ((table as PivotChart)._selectedDimensionInChart) {
      (table as PivotChart)._selectedDimensionInChart = null;
      const layout = table.internalProps.layoutMap as PivotLayoutMap;
      layout.updateDataStateToChartInstance();
      // 清除chart缓存图片
      clearChartCacheImage(table.scenegraph);
    }
  });
}
