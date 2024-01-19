import type { FederatedPointerEvent } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet } from '../util';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { PivotChart } from '../../PivotChart';
import { clearChartCacheImage } from '../../scenegraph/refresh-node/update-chart';

export function bindAxisClickEvent(table: BaseTableAPI) {
  if (!table.isPivotChart()) {
    return;
  }

  table.scenegraph.tableGroup.addEventListener('click', (e: FederatedPointerEvent) => {
    if (table.stateManager.columnMove.moving || table.stateManager.columnResize.resizing) {
      return;
    }
    if (e.target.name === 'axis-label') {
      const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
      const { col, row } = eventArgsSet.eventArgs;
      const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
      let dimensionKey;
      let dimensions: {
        dimensionKey?: string;
        indicatorKey?: string;
        value?: string;
      }[];
      if (layout.indicatorsAsCol) {
        dimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row);
        dimensions = layout.getCellHeaderPaths(layout.rowHeaderLevelCount - 2, row).rowHeaderPaths;
      } else {
        dimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount);
        dimensions = layout.getCellHeaderPaths(col, layout.columnHeaderLevelCount - 1).colHeaderPaths;
      }
      const filter = dimensions
        .map(dimension => {
          return {
            key: dimension.dimensionKey,
            value: dimension.value
          };
        })
        .filter(dimension => dimension.key);
      filter.push({ key: dimensionKey, value: (e.target.attribute as any).text });

      if (
        (table as PivotChart)._selectedDimensionInChart.length &&
        isSameSelectedDimension((table as PivotChart)._selectedDimensionInChart, filter)
      ) {
        return;
      }

      (table as PivotChart)._selectedDimensionInChart = filter;

      layout.updateDataStateToChartInstance();
      // 清除chart缓存图片
      clearChartCacheImage(table.scenegraph);
      table.scenegraph.updateNextFrame();
    } else if ((table as PivotChart)._selectedDimensionInChart?.length) {
      (table as PivotChart)._selectedDimensionInChart.length = 0;
      const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
      layout.updateDataStateToChartInstance();
      // 清除chart缓存图片
      clearChartCacheImage(table.scenegraph);
      table.scenegraph.updateNextFrame();
    }
  });
}

function isSameSelectedDimension(
  dimensions1: { key: string; value: string }[],
  dimensions2: { key: string; value: string }[]
): boolean {
  if (dimensions1.length !== dimensions2.length) {
    return false;
  }
  for (let i = 0; i < dimensions1.length; i++) {
    if (dimensions1[i].key !== dimensions2[i].key || dimensions1[i].value !== dimensions2[i].value) {
      return false;
    }
  }
  return true;
}
