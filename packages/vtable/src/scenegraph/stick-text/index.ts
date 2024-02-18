import type { IGraphic, Image, Text } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Group } from '../graphic/group';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { ITextStyleOption, StickCell } from '../../ts-types';
import { isNumber } from '@visactor/vutils';
import { getCellMergeRange } from '../../tools/merge-range';

export function handleTextStick(table: BaseTableAPI) {
  // reset
  const { changedCells } = table.internalProps.stick; // changedCells only cache one time
  changedCells.forEach((cellPos: StickCell) => {
    const cellGroup = table.scenegraph.getCell(cellPos.col, cellPos.row);
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttributes({
        dx: cellPos.dx,
        dy: cellPos.dy
      });
    });
  });
  changedCells.clear();

  const { scrollTop, scrollLeft, frozenRowCount, frozenColCount } = table;
  const frozenRowsHeight = table.getFrozenRowsHeight();
  const frozenColsWidth = table.getFrozenColsWidth();
  // 计算非冻结
  const { row: rowTop } = table.getRowAt(scrollTop + frozenRowsHeight + 1);
  const { col: colLeft } = table.getColAt(scrollLeft + frozenColsWidth + 1);
  const rowStart = Math.max(rowTop, table.frozenRowCount);
  const colStart = Math.max(colLeft, table.frozenColCount);
  const rowEnd =
    table.getAllRowsHeight() > table.tableNoFrameHeight
      ? table.getRowAt(scrollTop + table.tableNoFrameHeight - 1).row
      : table.rowCount - 1;
  const colEnd =
    table.getAllColsWidth() > table.tableNoFrameWidth
      ? table.getColAt(scrollLeft + table.tableNoFrameWidth - 1).col
      : table.colCount - 1;
  if (colEnd < 0 || rowEnd < 0) {
    return;
  }

  // column header
  for (let row = 0; row < frozenRowCount; row++) {
    if (colEnd < colStart) {
      break;
    }
    [colStart, colEnd].forEach((col: number) => {
      if (table._getCellStyle(col, row)?.textStick) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell Horizontal
        adjustCellContentHorizontalLayout(
          cellGroup,
          frozenColsWidth + table.tableX,
          table.tableNoFrameWidth - table.getRightFrozenColsWidth() + table.tableX,
          changedCells,
          table
        );
      }
    });
  }

  // row header
  for (let col = 0; col < frozenColCount; col++) {
    if (rowEnd < rowStart) {
      break;
    }
    [rowStart, rowEnd].forEach((row: number) => {
      if (
        table._getCellStyle(col, row)?.textStick &&
        (table.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType !== 'tree'
      ) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell vertical
        adjustCellContentVerticalLayout(
          cellGroup,
          frozenRowsHeight + table.tableY,
          table.tableNoFrameHeight - table.getBottomFrozenRowsHeight() + table.tableY,
          changedCells,
          table
        );
      }
    });
  }

  // body
  for (let col = colStart; col <= colEnd; col++) {
    if (rowEnd < rowStart) {
      break;
    }
    [rowStart, rowEnd].forEach((row: number) => {
      if (table._getCellStyle(col, row)?.textStick) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell vertical
        adjustCellContentVerticalLayout(
          cellGroup,
          frozenRowsHeight + table.tableY,
          table.tableNoFrameHeight - table.getBottomFrozenRowsHeight() + table.tableY,
          changedCells,
          table
        );
      }
    });
  }
  for (let row = rowStart; row < rowEnd; row++) {
    if (colEnd < colStart) {
      break;
    }
    [colStart, colEnd].forEach((col: number) => {
      if (table._getCellStyle(col, row)?.textStick) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell Horizontal
        adjustCellContentHorizontalLayout(
          cellGroup,
          frozenColsWidth + table.tableX,
          table.tableNoFrameWidth - table.getRightFrozenColsWidth() + table.tableX,
          changedCells,
          table
        );
      }
    });
  }
}

/*
 * adjust cell content vertical layout
 * @param {Group} cellGroup
 * @param {number} scrollTop
 */
function adjustCellContentVerticalLayout(
  cellGroup: Group,
  minTop: number,
  maxTop: number,
  changedCells: Map<string, StickCell>,
  table: BaseTableAPI
) {
  if (
    isNumber(cellGroup.mergeStartCol) &&
    isNumber(cellGroup.mergeStartRow) &&
    isNumber(cellGroup.mergeEndCol) &&
    isNumber(cellGroup.mergeEndRow)
  ) {
    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, table.scenegraph);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const singleCellGroup = table.scenegraph.getCell(col, row);
        dealVertical(singleCellGroup, minTop, maxTop, changedCells);
      }
    }
  } else {
    dealVertical(cellGroup, minTop, maxTop, changedCells);
  }
}

function dealVertical(cellGroup: Group, minTop: number, maxTop: number, changedCells: Map<string, StickCell>) {
  // get text element
  const graphic =
    (cellGroup.getChildByName('text', true) as Text) || (cellGroup.getChildByName('image', true) as Image);
  if (!graphic) {
    return;
  }
  if (graphic.type === 'image') {
    const { image: url } = graphic.attribute;
    if (!url || !graphic.resources) {
      return;
    }
    const res = graphic.resources.get(url as any);
    if (res.state !== 'success') {
      return;
    }
  }

  graphic.AABBBounds.width();
  const textTop = graphic.globalAABBBounds.y1;
  const textBottom = graphic.globalAABBBounds.y2;
  // const textCellTop = graphic.AABBBounds.y1;
  // const textCellBottom = graphic.AABBBounds.y2;
  // if (textCellTop < cellGroup.attribute.height || textCellBottom < 0) {
  //   return;
  // }

  if (textTop < minTop) {
    const deltaHeight = textTop - minTop;
    // text is out of view, move all elements down
    !changedCells.has(`${cellGroup.col}-${cellGroup.row}`) &&
      changedCells.set(`${cellGroup.col}-${cellGroup.row}`, {
        col: cellGroup.col,
        row: cellGroup.row,
        dx: (cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0,
        dy: (cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0
      });
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dy', (child.attribute.dy ?? 0) - deltaHeight + 2); // 2 is the buffer
    });
  } else if (textBottom > maxTop) {
    const deltaHeight = textBottom - maxTop;
    // text is out of view, move all elements down
    !changedCells.has(`${cellGroup.col}-${cellGroup.row}`) &&
      changedCells.set(`${cellGroup.col}-${cellGroup.row}`, {
        col: cellGroup.col,
        row: cellGroup.row,
        dx: (cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0,
        dy: (cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0
      });
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dy', (child.attribute.dy ?? 0) - deltaHeight); // 2 is the buffer
    });
  }
}

/*
 * adjust cell content horizontal layout
 * @param {Group} cellGroup
 * @param {number} scrollLeft
 */
function adjustCellContentHorizontalLayout(
  cellGroup: Group,
  minLeft: number,
  maxLeft: number,
  changedCells: Map<string, StickCell>,
  table: BaseTableAPI
) {
  if (
    isNumber(cellGroup.mergeStartCol) &&
    isNumber(cellGroup.mergeStartRow) &&
    isNumber(cellGroup.mergeEndCol) &&
    isNumber(cellGroup.mergeEndRow)
  ) {
    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, table.scenegraph);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const singleCellGroup = table.scenegraph.getCell(col, row);
        dealHorizontal(singleCellGroup, minLeft, maxLeft, changedCells);
      }
    }
  } else {
    dealHorizontal(cellGroup, minLeft, maxLeft, changedCells);
  }
}

function dealHorizontal(cellGroup: Group, minLeft: number, maxLeft: number, changedCells: Map<string, StickCell>) {
  // get text element
  const text = cellGroup.getChildByName('text', true) as Text;
  if (!text) {
    return;
  }
  text.AABBBounds.width();
  const textLeft = text.globalAABBBounds.x1;
  const textRight = text.globalAABBBounds.x2;
  if (textLeft < minLeft) {
    const deltaWidth = textLeft - minLeft;
    // text is out of view, move all elements right
    !changedCells.has(`${cellGroup.col}-${cellGroup.row}`) &&
      changedCells.set(`${cellGroup.col}-${cellGroup.row}`, {
        col: cellGroup.col,
        row: cellGroup.row,
        dx: (cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0,
        dy: (cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0
      });
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dx', (child.attribute.dx ?? 0) - deltaWidth + 2); // 2 is the buffer
    });
  } else if (textRight > maxLeft) {
    const deltaWidth = textRight - maxLeft;
    // text is out of view, move all elements down
    !changedCells.has(`${cellGroup.col}-${cellGroup.row}`) &&
      changedCells.set(`${cellGroup.col}-${cellGroup.row}`, {
        col: cellGroup.col,
        row: cellGroup.row,
        dx: (cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0,
        dy: (cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0
      });
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dx', (child.attribute.dx ?? 0) - deltaWidth); // 2 is the buffer
    });
  }
}

export function checkHaveTextStick(table: BaseTableAPI) {
  const headerObjects = table.internalProps.layoutMap.headerObjects;
  const columnObjects = table.internalProps.layoutMap.columnObjects;
  for (let i = 0; i < headerObjects.length; i++) {
    const header = headerObjects[i];
    if (header && (header.style as ITextStyleOption)?.textStick) {
      return true;
    }
  }
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if (column && (column.style as ITextStyleOption)?.textStick) {
      return true;
    }
  }
  return false;
}
