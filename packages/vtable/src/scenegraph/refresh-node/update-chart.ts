import { isEqual } from '@visactor/vutils';
import type { PivotChart } from '../../PivotChart';
import { CartesianAxis } from '../../components/axis/axis';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Chart } from '../graphic/chart';
import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { getQuadProps } from '../utils/padding';
import { getProp } from '../utils/get-prop';

/** 供调整列宽后更新chart使用 */
export function updateChartSize(scenegraph: Scenegraph, col: number) {
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  for (let c = col; c <= scenegraph.proxy.colEnd; c++) {
    const columnGroup = scenegraph.getColGroup(c);
    // const chartInstance = (columnGroup.attribute as any)?.chartInstance;
    // if (chartInstance) {
    columnGroup?.getChildren()?.forEach((cellNode: Group) => {
      const width = scenegraph.table.getColWidth(cellNode.col);
      const height = scenegraph.table.getRowHeight(cellNode.row);

      cellNode.children.forEach((node: Chart) => {
        if ((node as any).type === 'chart') {
          // 调试问题使用
          // if (columnGroup.col === 2) {
          //   columnGroup.AABBBounds.width();
          //   node.AABBBounds.width();
          //   console.log(
          //     'set viewbox y1',
          //     Math.ceil(cellNode.globalAABBBounds.y1 + node.attribute.cellPadding[0] + scenegraph.table.scrollTop),
          //     node.globalAABBBounds.height()
          //   );

          //   console.log(
          //     'updateChartSize',
          //     columnGroup,
          //     columnGroup.globalAABBBounds.y1,
          //     cellNode.globalAABBBounds.y1,
          //     node.globalAABBBounds.y1
          //   );
          // }

          node.cacheCanvas = null;
          node.setAttribute('width', Math.ceil(width - node.attribute.cellPadding[3] - node.attribute.cellPadding[1]));
          node.setAttribute(
            'height',
            Math.ceil(height - node.attribute.cellPadding[0] - node.attribute.cellPadding[2])
          );

          // node.setAttribute('viewBox', {
          //   x1: Math.ceil(cellNode.globalAABBBounds.x1 + node.attribute.cellPadding[3] + scenegraph.table.scrollLeft),
          //   x2: Math.ceil(
          //     cellNode.globalAABBBounds.x1 + width - node.attribute.cellPadding[1] + scenegraph.table.scrollLeft
          //   ),
          //   y1: Math.ceil(cellNode.globalAABBBounds.y1 + node.attribute.cellPadding[0] + scenegraph.table.scrollTop),
          //   y2: Math.ceil(
          //     cellNode.globalAABBBounds.y1 + height - node.attribute.cellPadding[2] + scenegraph.table.scrollTop
          //   )
          // });
        }
      });
    });
    // }
  }
  // 右侧冻结的单元格也需要调整
  if (!scenegraph.table.isPivotChart() && scenegraph.table.rightFrozenColCount >= 1) {
    for (
      let c = scenegraph.table.colCount - scenegraph.table.rightFrozenColCount;
      c <= scenegraph.table.colCount - 1;
      c++
    ) {
      const columnGroup = scenegraph.getColGroup(c);
      columnGroup?.getChildren()?.forEach((cellNode: Group) => {
        const width = scenegraph.table.getColWidth(cellNode.col);
        const height = scenegraph.table.getRowHeight(cellNode.row);

        cellNode.children.forEach((node: Chart) => {
          if ((node as any).type === 'chart') {
            node.cacheCanvas = null;
            node.setAttribute(
              'width',
              Math.ceil(width - node.attribute.cellPadding[3] - node.attribute.cellPadding[1])
            );
            node.setAttribute(
              'height',
              Math.ceil(height - node.attribute.cellPadding[0] - node.attribute.cellPadding[2])
            );
          }
        });
      });
    }
  }
}

/** 清理所有chart节点的 图表缓存图片 */
export function clearChartCacheImage(scenegraph: Scenegraph) {
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  for (let c = scenegraph.proxy.colStart; c <= scenegraph.proxy.colEnd; c++) {
    const columnGroup = scenegraph.getColGroup(c);
    columnGroup?.getChildren()?.forEach((cellNode: Group) => {
      cellNode.children.forEach((node: Chart) => {
        if ((node as any).type === 'chart') {
          node.cacheCanvas = null;
          node.addUpdateBoundTag();
        }
      });
    });
  }
}

/** 更新所有的图表chart节点上缓存attribute中的data数据 */
export function updateChartData(scenegraph: Scenegraph) {
  const table = scenegraph.table;
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  for (let c = scenegraph.proxy.colStart; c <= scenegraph.proxy.colEnd; c++) {
    const columnGroup = scenegraph.getColGroup(c);
    columnGroup?.getChildren()?.forEach((cellNode: Group) => {
      const col = cellNode.col;
      const row = cellNode.row;
      cellNode.children.forEach((node: Chart) => {
        if ((node as any).type === 'chart') {
          node.updateData(table.getCellValue(col, row));
          const newAxes = table.internalProps.layoutMap.getChartAxes(col, row);
          node.setAttribute('axes', newAxes);
          const chartSpec = node.attribute.spec;
          chartSpec.axes = newAxes;
          node.setAttribute('spec', chartSpec);
          // node.addUpdateBoundTag();
        }
      });
    });
  }

  // update left axes
  updateTableAxes(scenegraph.rowHeaderGroup, scenegraph.table);
  // update top axes
  updateTableAxes(scenegraph.colHeaderGroup, scenegraph.table);
  // update right axes
  updateTableAxes(scenegraph.rightFrozenGroup, scenegraph.table);
  // update bottom axes
  updateTableAxes(scenegraph.bottomFrozenGroup, scenegraph.table);
}
/** 组织图表数据状态_selectedDataItemsInChart 更新选中的图表图元状态 */
export function updateChartState(scenegraph: Scenegraph, datum: any) {
  const table = scenegraph.table;
  if (table.isPivotChart()) {
    const preSelectItemsCount = (table as PivotChart)._selectedDataItemsInChart.length;
    if ((datum === null || datum?.length === 0 || Object.keys(datum).length === 0) && preSelectItemsCount === 0) {
      //避免无效的更新
      return;
    }
    // (table as PivotChart)._selectedDataItemsInChart = [];
    const newSelectedDataItemsInChart = [];
    if (Array.isArray(datum)) {
      datum.forEach((dataItem: any) => {
        if (dataItem && dataItem.key !== 0 && Object.keys(dataItem).length > 0) {
          //本以为没有点击到图元上 datum为空 发现是{key:0}或者{}
          const selectedState = {};
          for (const itemKey in dataItem) {
            if (!itemKey.startsWith('VGRAMMAR_') && !itemKey.startsWith('__VCHART')) {
              selectedState[itemKey] = dataItem[itemKey];
            }
          }
          newSelectedDataItemsInChart.push(selectedState);
        }
      });
    } else if (datum && datum.key !== 0 && Object.keys(datum).length > 0) {
      //本以为没有点击到图元上 datum为空 发现是{key:0}或者{}
      const selectedState = {};
      for (const itemKey in datum) {
        if (!itemKey.startsWith('VGRAMMAR_') && !itemKey.startsWith('__VCHART')) {
          selectedState[itemKey] = datum[itemKey];
        }
      }
      newSelectedDataItemsInChart.push(selectedState);
    }
    //避免无效的更新
    if (!isEqual((table as PivotChart)._selectedDataItemsInChart, newSelectedDataItemsInChart)) {
      (table as PivotChart)._selectedDataItemsInChart = newSelectedDataItemsInChart;
      (table.internalProps.layoutMap as PivotHeaderLayoutMap).updateDataStateToChartInstance();
      // 清楚chart缓存图片
      clearChartCacheImage(scenegraph);
      table.scenegraph.updateNextFrame();
    }
  }
}

/**
 * @description: update table axis component
 * @param {Group} containerGroup
 * @param {BaseTableAPI} table
 * @return {*}
 */
function updateTableAxes(containerGroup: Group, table: BaseTableAPI) {
  containerGroup.forEachChildren((column: Group) => {
    if (column.role === 'column') {
      column.forEachChildren((cell: Group) => {
        if (cell.role === 'cell') {
          let isAxisComponent = false;
          cell.forEachChildren((mark: Group) => {
            if (mark.name === 'axis') {
              isAxisComponent = true;
              return true;
            }
            return false;
          });
          if (isAxisComponent) {
            const axisConfig = table.internalProps.layoutMap.getAxisConfigInPivotChart(cell.col, cell.row);
            const cellStyle = table._getCellStyle(cell.col, cell.row);
            const padding = getQuadProps(getProp('padding', cellStyle, cell.col, cell.row, table));
            const axis = new CartesianAxis(axisConfig, cell.attribute.width, cell.attribute.height, padding, table);
            cell.clear();
            cell.appendChild(axis.component);
            axis.overlap();
          }
        }
      });
    }
  });
}
