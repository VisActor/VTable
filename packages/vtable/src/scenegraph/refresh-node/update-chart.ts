import type { Chart } from '../graphic/chart';
import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';

/** 供调整列宽后更新chart使用 */
export function updateChartSize(scenegraph: Scenegraph, col: number) {
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  for (let c = col; c < scenegraph.proxy.colEnd; c++) {
    const columnGroup = scenegraph.getColGroup(c);
    // const chartInstance = (columnGroup.attribute as any)?.chartInstance;
    // if (chartInstance) {
    columnGroup.getChildren().forEach((cellNode: Group) => {
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

          node.setAttribute('viewBox', {
            x1: Math.ceil(cellNode.globalAABBBounds.x1 + node.attribute.cellPadding[3] + scenegraph.table.scrollLeft),
            x2: Math.ceil(
              cellNode.globalAABBBounds.x1 + width - node.attribute.cellPadding[1] + scenegraph.table.scrollLeft
            ),
            y1: Math.ceil(cellNode.globalAABBBounds.y1 + node.attribute.cellPadding[0] + scenegraph.table.scrollTop),
            y2: Math.ceil(
              cellNode.globalAABBBounds.y1 + height - node.attribute.cellPadding[2] + scenegraph.table.scrollTop
            )
          });
        }
      });
    });
    // }
  }
}

/** 供调整列宽后更新chart使用 */
export function clearChartCacheImage(scenegraph: Scenegraph) {
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  for (let c = scenegraph.proxy.colStart; c <= scenegraph.proxy.colEnd; c++) {
    const columnGroup = scenegraph.getColGroup(c);
    columnGroup.getChildren().forEach((cellNode: Group) => {
      cellNode.children.forEach((node: Chart) => {
        if ((node as any).type === 'chart') {
          node.cacheCanvas = null;
        }
      });
    });
  }
}
