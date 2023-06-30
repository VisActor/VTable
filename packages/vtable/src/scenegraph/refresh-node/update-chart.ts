import type { Chart } from '../graphic/chart';
import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';

/** 供调整列宽后更新chart使用 */
export function updateChartSize(scenegraph: Scenegraph, col: number) {
  // 将调整列宽的后面的面也都一起需要调整viewbox。  TODO：columnResizeType支持后需要根据变化的列去调整，范围可能变多或者变少
  for (let c = col; c < scenegraph.table.colCount; c++) {
    const columnGroup = scenegraph.getColGroup(c);
    const chartInstance = (columnGroup.attribute as any)?.chartInstance;
    if (chartInstance) {
      // chartInstance.updateViewBox();
      columnGroup.getChildren().forEach((cellNode: Group) => {
        const width = cellNode.AABBBounds.width();
        const height = cellNode.AABBBounds.height();

        cellNode.children.forEach((node: Chart) => {
          if (node.type === 'chart') {
            console.log(node);
            node.cacheCanvas = null;
            node.setAttribute(
              'width',
              Math.ceil(width - node.attribute.cellPadding[3] - node.attribute.cellPadding[1])
            );
            node.setAttribute(
              'height',
              Math.ceil(height - node.attribute.cellPadding[0] - node.attribute.cellPadding[2])
            );

            node.setAttribute('viewBox', {
              x1: Math.ceil(
                cellNode.globalAABBBounds.x1 +
                  scenegraph.table.tableX +
                  node.attribute.cellPadding[3] +
                  scenegraph.table.scrollLeft
              ),
              x2: Math.ceil(
                cellNode.globalAABBBounds.x1 +
                  width +
                  scenegraph.table.tableX -
                  node.attribute.cellPadding[1] +
                  scenegraph.table.scrollLeft
              ),
              y1: Math.ceil(
                cellNode.globalAABBBounds.y1 +
                  scenegraph.table.tableY +
                  node.attribute.cellPadding[0] +
                  scenegraph.table.scrollTop
              ),
              y2: Math.ceil(
                cellNode.globalAABBBounds.y1 +
                  height +
                  scenegraph.table.tableY -
                  node.attribute.cellPadding[2] +
                  scenegraph.table.scrollTop
              )
            });
          }
        });
      });
    }
  }
}
