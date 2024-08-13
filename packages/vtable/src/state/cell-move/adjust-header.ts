import type { ListTable } from '../../ListTable';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function adjustMoveHeaderTarget(source: CellAddress, target: CellAddress, table: BaseTableAPI) {
  const sourceCellRange = table.getCellRange(source.col, source.row);

  if (table.isColumnHeader(source.col, source.row)) {
    // 处理是目标位置处是合并单元格的情况
    const targetCellRange = table.getCellRange(target.col, sourceCellRange.start.row);
    // 如果是拖拽处是body target.row处理成表头最后一层
    if (target.row >= table.columnHeaderLevelCount) {
      target.row = table.columnHeaderLevelCount - 1;
    }
    //如果拖拽目标的列在原位置的右侧 位置是合并单元格的最右侧
    if (target.col >= source.col) {
      target.col = targetCellRange.end.col;
    } else {
      target.col = targetCellRange.start.col;
    } //左侧 位置是合并单元格的最左侧
  } else if (
    table.isRowHeader(source.col, source.row)
    // ||
    // ((table as ListTable).transpose && table.internalProps.layoutMap.isSeriesNumberInBody(source.col, source.row))
  ) {
    const layoutMap = table.internalProps.layoutMap as PivotHeaderLayoutMap;
    const targetCellRange = table.getCellRange(sourceCellRange.start.col, target.row);
    if (target.col >= table.rowHeaderLevelCount + layoutMap.leftRowSeriesNumberColumnCount) {
      target.col = table.rowHeaderLevelCount + layoutMap.leftRowSeriesNumberColumnCount - 1;
    }
    // tree模式[透视表行表头]
    if (layoutMap.rowHierarchyType === 'tree') {
      const sourceRowHeaderPaths = layoutMap.getCellHeaderPathsWithTreeNode(source.col, source.row)
        .rowHeaderPaths as any;
      const targetRowHeaderPaths = layoutMap.getCellHeaderPathsWithTreeNode(target.col, target.row)
        .rowHeaderPaths as any;
      if (sourceRowHeaderPaths.length <= targetRowHeaderPaths.length) {
        const targetPathNode = targetRowHeaderPaths[sourceRowHeaderPaths.length - 1]; //找到共同层级节点
        // 根据这个目标节点找到结束的row index
        if (targetPathNode) {
          if (target.row >= source.row) {
            //如果拖拽目标的列在原位置的上面 位置是层级的最上端
            target.row = targetPathNode.startInTotal + targetPathNode.size - 1 + table.columnHeaderLevelCount;
          } else {
            target.row = targetPathNode.startInTotal + table.columnHeaderLevelCount;
          }
        } //如果拖拽目标的列在原位置的下面 位置是层级的最下端
      }
    } else if (target.row >= source.row) {
      //table模式 如果拖拽目标的列在原位置的下面 位置是层级的最下端
      target.row = targetCellRange.end.row;
    } else {
      //table模式  如果拖拽目标的列在原位置的上面 位置是层级的最上端
      target.row = targetCellRange.start.row;
    }
  }
  return target;
}
