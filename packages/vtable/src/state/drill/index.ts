import type { BaseTableAPI } from '../../ts-types/base-table';

export function updateDrill(col: number, row: number, drillDown: boolean, drillUp: boolean, table: BaseTableAPI) {
  // 找到当前单元格显示drill icon位置
  const headerType = table.getCellLocation(col, row);
  let x = 0;
  let y = 0;
  let visible = false;
  if (headerType === 'columnHeader') {
    x = table.getColsWidth(0, table.rowHeaderLevelCount - 1) - (table.frozenColCount === 0 ? table.scrollLeft : 0); //还需要考虑 行表头过宽被滚动后的情况
    y = table.getRowsHeight(0, row - 1) + table.getRowHeight(row) / 2;
    visible = true;
  } else if (headerType === 'rowHeader') {
    y = table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
    x = table.getColsWidth(0, col - 1) + table.getColWidth(col) / 2;
    // 位置按自动吸附到中间位置计算【行表头滚动后有用】
    // const rectObj = table.getVisibleCellRangeRelativeRect(table.hover.state.address);
    // x = rectObj.left + rectObj.width / 2;
    visible = true;
  }

  // 更新drill icon 位置
  table.scenegraph.updateDrill(visible, x, y, drillDown, drillUp);
}
