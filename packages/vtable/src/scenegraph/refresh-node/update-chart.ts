import { isEqual } from '@visactor/vutils';
import type { PivotChart } from '../../PivotChart';
import type { ICartesianAxis } from '../../components/axis/axis';
import { Factory } from '../../core/factory';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Chart } from '../graphic/chart';
import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { getQuadProps } from '../utils/padding';
import { getProp } from '../utils/get-prop';

/** 供调整列宽后更新chart使用 */
export function updateChartSizeForResizeColWidth(scenegraph: Scenegraph, col: number) {
  const { table } = scenegraph;
  const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
  const columnResizeType = col === -1 ? 'all' : table.internalProps.columnResizeType;
  if (columnResizeType === 'column') {
    const columnGroup = scenegraph.getColGroup(col);
    const columnHeaderGroup = scenegraph.getColGroup(col, true);
    const columnBottomGroup = scenegraph.getColGroupInBottom(col, true);
    columnGroup?.forEachChildren((cellNode: Group) => {
      const width = table.getColWidth(cellNode.col);
      const height = table.getRowHeight(cellNode.row);
      updateChartGraphicSize(cellNode, width, height);
    });
    columnHeaderGroup?.forEachChildren((cellNode: Group) => {
      const width = table.getColWidth(cellNode.col);
      const height = table.getRowHeight(cellNode.row);
      updateChartGraphicSize(cellNode, width, height);
    });
    columnBottomGroup?.forEachChildren((cellNode: Group) => {
      const width = table.getColWidth(cellNode.col);
      const height = table.getRowHeight(cellNode.row);
      updateChartGraphicSize(cellNode, width, height);
    });
    if (table.widthMode === 'adaptive' && col < table.colCount - 1) {
      const columnGroup = scenegraph.getColGroup(col + 1);
      const columnHeaderGroup = scenegraph.getColGroup(col + 1, true);
      const columnBottomGroup = scenegraph.getColGroupInBottom(col + 1, true);
      columnGroup?.forEachChildren((cellNode: Group) => {
        const width = table.getColWidth(cellNode.col);
        const height = table.getRowHeight(cellNode.row);
        updateChartGraphicSize(cellNode, width, height);
      });
      columnHeaderGroup?.forEachChildren((cellNode: Group) => {
        const width = table.getColWidth(cellNode.col);
        const height = table.getRowHeight(cellNode.row);
        updateChartGraphicSize(cellNode, width, height);
      });
      columnBottomGroup?.forEachChildren((cellNode: Group) => {
        const width = table.getColWidth(cellNode.col);
        const height = table.getRowHeight(cellNode.row);
        updateChartGraphicSize(cellNode, width, height);
      });
    }
  } else {
    let startCol = table.rowHeaderLevelCount;
    let endCol = table.colCount - 1;
    let resizeIndicatorKey;
    let resizeDimensionKey;
    let resizeDimensionValue;
    if (columnResizeType === 'indicator') {
      if (layout.indicatorsAsCol) {
        resizeIndicatorKey = layout.getIndicatorKey(col, table.columnHeaderLevelCount);
      } else {
        const headerPaths = layout.getCellHeaderPaths(col, table.columnHeaderLevelCount - 1);
        const headerPath = headerPaths.colHeaderPaths[headerPaths.colHeaderPaths.length - 1];
        resizeDimensionKey = headerPath.dimensionKey;
        resizeDimensionValue = headerPath.value;
      }
    } else if (columnResizeType === 'indicatorGroup') {
      const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
      //通过getCellHeaderPaths接口获取列表头最后一层指标维度的path
      const headerPaths = layout.getCellHeaderPaths(table.stateManager.columnResize.col, table.columnHeaderLevelCount);
      const node = layout.getHeadNodeByRowOrColDimensions(
        headerPaths.colHeaderPaths.slice(0, headerPaths.colHeaderPaths.length - 1)
      ) as any;
      // 计算宽度受影响列的起止
      startCol = node.startInTotal + table.frozenColCount;
      endCol = node.startInTotal + table.frozenColCount + node.size - 1;
    }

    for (let c = startCol; c <= endCol; c++) {
      const columnGroup = scenegraph.getColGroup(c);
      const columnHeaderGroup = scenegraph.getColGroup(c, true);
      const columnBottomGroup = scenegraph.getColGroupInBottom(c, true);
      if (columnGroup) {
        if (columnResizeType === 'indicator') {
          const indicatorKey = layout.getIndicatorKey(c, table.columnHeaderLevelCount);
          if (layout.indicatorsAsCol && indicatorKey !== resizeIndicatorKey) {
            continue;
          } else if (!layout.indicatorsAsCol) {
            const headerPaths = layout.getCellHeaderPaths(c, table.columnHeaderLevelCount - 1);
            const headerPath = headerPaths?.colHeaderPaths[headerPaths.colHeaderPaths.length - 1];
            if (
              !headerPath ||
              resizeDimensionKey !== headerPath.dimensionKey ||
              resizeDimensionValue !== headerPath.value
            ) {
              continue;
            }
          }
        }
        columnGroup.forEachChildren((cellNode: Group) => {
          const width = table.getColWidth(cellNode.col);
          const height = table.getRowHeight(cellNode.row);
          updateChartGraphicSize(cellNode, width, height);
        });
        columnHeaderGroup?.forEachChildren((cellNode: Group) => {
          const width = table.getColWidth(cellNode.col);
          const height = table.getRowHeight(cellNode.row);
          updateChartGraphicSize(cellNode, width, height);
        });
        columnBottomGroup?.forEachChildren((cellNode: Group) => {
          const width = table.getColWidth(cellNode.col);
          const height = table.getRowHeight(cellNode.row);
          updateChartGraphicSize(cellNode, width, height);
        });
      }
    }
  }

  // // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  // for (let c = col; c <= scenegraph.proxy.colEnd; c++) {
  //   const columnGroup = scenegraph.getColGroup(c);
  //   // const chartInstance = (columnGroup.attribute as any)?.chartInstance;
  //   // if (chartInstance) {
  //   columnGroup?.getChildren()?.forEach((cellNode: Group) => {
  //     const width = scenegraph.table.getColWidth(cellNode.col);
  //     const height = scenegraph.table.getRowHeight(cellNode.row);

  //     cellNode.children.forEach((node: Chart) => {
  //       if ((node as any).type === 'chart') {
  //         node.cacheCanvas = null;
  //         node.setAttribute('width', Math.ceil(width - node.attribute.cellPadding[3] - node.attribute.cellPadding[1]));
  //         node.setAttribute(
  //           'height',
  //           Math.ceil(height - node.attribute.cellPadding[0] - node.attribute.cellPadding[2])
  //         );
  //       }
  //     });
  //   });
  //   // }
  // }
  // // 右侧冻结的单元格也需要调整
  // if (!scenegraph.table.isPivotChart() && scenegraph.table.rightFrozenColCount >= 1) {
  //   for (
  //     let c = scenegraph.table.colCount - scenegraph.table.rightFrozenColCount;
  //     c <= scenegraph.table.colCount - 1;
  //     c++
  //   ) {
  //     const columnGroup = scenegraph.getColGroup(c);
  //     columnGroup?.getChildren()?.forEach((cellNode: Group) => {
  //       const width = scenegraph.table.getColWidth(cellNode.col);
  //       const height = scenegraph.table.getRowHeight(cellNode.row);

  //       cellNode.children.forEach((node: Chart) => {
  //         if ((node as any).type === 'chart') {
  //           node.cacheCanvas = null;
  //           node.setAttribute(
  //             'width',
  //             Math.ceil(width - node.attribute.cellPadding[3] - node.attribute.cellPadding[1])
  //           );
  //           node.setAttribute(
  //             'height',
  //             Math.ceil(height - node.attribute.cellPadding[0] - node.attribute.cellPadding[2])
  //           );
  //         }
  //       });
  //     });
  //   }
  // }
}
/** 供调整列宽后更新chart使用 */
export function updateChartSizeForResizeRowHeight(scenegraph: Scenegraph, row: number) {
  const { table } = scenegraph;
  const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
  const state = table.stateManager;
  const rowResizeType = row === -1 ? 'all' : table.internalProps.rowResizeType;

  let startRow = table.columnHeaderLevelCount;
  let endRow = table.rowCount - 1;
  let resizeIndicatorKey: string;
  let resizeDimensionKey: string;
  let resizeDimensionValue: string;
  if (rowResizeType === 'indicator') {
    if (!layout.indicatorsAsCol) {
      resizeIndicatorKey = layout.getIndicatorKey(table.rowHeaderLevelCount, row);
    } else {
      const headerPaths = layout.getCellHeaderPaths(table.rowHeaderLevelCount - 1, row);
      const headerPath = headerPaths.rowHeaderPaths?.[headerPaths.rowHeaderPaths.length - 1];
      resizeDimensionKey = headerPath?.dimensionKey;
      resizeDimensionValue = headerPath?.value;
    }
  } else if (rowResizeType === 'indicatorGroup') {
    const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
    //通过getCellHeaderPaths接口获取列表头最后一层指标维度的path
    const headerPaths = layout.getCellHeaderPaths(table.rowHeaderLevelCount, row);
    const node = layout.getHeadNodeByRowOrColDimensions(
      headerPaths.rowHeaderPaths.slice(0, headerPaths.rowHeaderPaths.length - 1)
    ) as any;
    // 计算宽度受影响列的起止
    startRow = node.startInTotal + table.frozenRowCount;
    endRow = node.startInTotal + table.frozenRowCount + node.size - 1;
  }

  const colsRange = [{ startCol: scenegraph.proxy.colStart, endCol: scenegraph.proxy.colEnd }];
  if (table.frozenColCount) {
    colsRange.push({ startCol: 0, endCol: table.frozenColCount - 1 });
  }
  if (table.rightFrozenColCount) {
    colsRange.push({ startCol: table.colCount - table.rightFrozenColCount, endCol: table.colCount - 1 });
  }
  colsRange.forEach(({ startCol, endCol }) => {
    for (let col = startCol; col <= endCol; col++) {
      if (rowResizeType === 'row') {
        const cellNode = scenegraph.highPerformanceGetCell(col, row);
        if (cellNode.role !== 'cell') {
          continue;
        }
        const width = table.getColWidth(cellNode.col);
        const height = table.getRowHeight(cellNode.row);
        updateChartGraphicSize(cellNode, width, height);

        if (table.heightMode === 'adaptive' && row < table.rowCount - 1) {
          const cellNode = scenegraph.highPerformanceGetCell(col, row + 1);
          const width = table.getColWidth(cellNode.col);
          const height = table.getRowHeight(cellNode.row);
          updateChartGraphicSize(cellNode, width, height);
        }
      } else {
        for (let r = startRow; r <= endRow; r++) {
          if (rowResizeType === 'indicator') {
            const indicatorKey = layout.getIndicatorKey(state.table.rowHeaderLevelCount, r);
            if (!layout.indicatorsAsCol && indicatorKey !== resizeIndicatorKey) {
              continue;
            } else if (layout.indicatorsAsCol) {
              const headerPaths = layout.getCellHeaderPaths(state.table.rowHeaderLevelCount - 1, r);
              const headerPath = headerPaths?.rowHeaderPaths[headerPaths.rowHeaderPaths.length - 1];
              if (
                !headerPath ||
                resizeDimensionKey !== headerPath.dimensionKey ||
                resizeDimensionValue !== headerPath.value
              ) {
                continue;
              }
            }
          }
          const cellNode = scenegraph.highPerformanceGetCell(col, r);
          if (cellNode.role !== 'cell') {
            continue;
          }
          const width = table.getColWidth(cellNode.col);
          const height = table.getRowHeight(cellNode.row);
          updateChartGraphicSize(cellNode, width, height);
        }
      }
    }
  });

  // const updateCellNode = (c: number, r: number) => {
  //   const cellNode = scenegraph.getCell(c, r);
  //   const width = scenegraph.table.getColWidth(cellNode.col);
  //   const height = scenegraph.table.getRowHeight(cellNode.row);
  //   cellNode.children.forEach((node: Chart) => {
  //     if ((node as any).type === 'chart') {
  //       node.cacheCanvas = null;
  //       console.log('bf', c, r, node.attribute.width, node.attribute.height);

  //       node.setAttribute('width', Math.ceil(width - node.attribute.cellPadding[3] - node.attribute.cellPadding[1]));
  //       node.setAttribute('height', Math.ceil(height - node.attribute.cellPadding[0] - node.attribute.cellPadding[2]));
  //       console.log('af', c, r, node.attribute.width, node.attribute.height);
  //     }
  //   });
  // };
  // // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  // for (let c = scenegraph.proxy.colStart; c <= scenegraph.proxy.colEnd; c++) {
  //   for (let r = row; r <= scenegraph.proxy.rowEnd; r++) {
  //     updateCellNode(c, r);
  //   }
  // }

  // // 右侧冻结的单元格也需要调整
  // if (scenegraph.table.rightFrozenColCount >= 1) {
  //   for (
  //     let c = scenegraph.table.colCount - scenegraph.table.rightFrozenColCount;
  //     c <= scenegraph.table.colCount - 1;
  //     c++
  //   ) {
  //     for (let r = row; r <= scenegraph.proxy.rowEnd; r++) {
  //       updateCellNode(c, r);
  //     }
  //   }
  // }
  // // 左侧冻结的单元格
  // if (scenegraph.table.frozenColCount >= 1) {
  //   for (let c = 0; c <= scenegraph.table.frozenColCount - 1; c++) {
  //     for (let r = row; r <= scenegraph.proxy.rowEnd; r++) {
  //       updateCellNode(c, r);
  //     }
  //   }
  // }
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

export function clearCellChartCacheImage(col: number, row: number, scenegraph: Scenegraph) {
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  const cellGroup = scenegraph.getCell(col, row);
  cellGroup.children.forEach((node: Chart) => {
    if ((node as any).type === 'chart') {
      node.cacheCanvas = null;
      node.addUpdateBoundTag();
    }
  });
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
          const chartSpec = node.attribute.spec;
          const chartType = chartSpec.type;
          if (chartType !== 'gauge' && chartType !== 'rose' && chartType !== 'radar') {
            const newAxes = table.internalProps.layoutMap.getChartAxes(col, row);
            node.setAttribute('axes', newAxes);
            chartSpec.axes = newAxes;
          }
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
          const selectedState = {} as any;
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
      const selectedState = {} as any;
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
            const CartesianAxis: ICartesianAxis = Factory.getComponent('axis');
            const axis = new CartesianAxis(
              axisConfig,
              cell.attribute.width,
              cell.attribute.height,
              axisConfig.__vtablePadding ?? padding,
              table
            );
            cell.clear();
            cell.appendChild(axis.component);
            axis.overlap();
          }
        }
      });
    }
  });
}

function updateChartGraphicSize(cellNode: Group, width: number, height: number) {
  cellNode.forEachChildren((graphic: Chart) => {
    if ((graphic as any).type === 'chart') {
      graphic.cacheCanvas = null;
      graphic.setAttributes({
        width: Math.ceil(width - graphic.attribute.cellPadding[3] - graphic.attribute.cellPadding[1]),
        height: Math.ceil(height - graphic.attribute.cellPadding[0] - graphic.attribute.cellPadding[2])
      });
    }
  });
}
