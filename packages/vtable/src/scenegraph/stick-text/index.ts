import type { IGraphic, Image, Text } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Group } from '../graphic/group';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { ITextStyleOption, StickCell } from '../../ts-types';
import { isNumber, min } from '@visactor/vutils';
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
      ? table.getRowAt(scrollTop + table.tableNoFrameHeight - table.getBottomFrozenRowsHeight() - 1).row
      : table.rowCount - table.bottomFrozenRowCount - 1;
  const colEnd =
    table.getAllColsWidth() > table.tableNoFrameWidth
      ? table.getColAt(scrollLeft + table.tableNoFrameWidth - table.getRightFrozenColsWidth() - 1).col
      : table.colCount - table.rightFrozenColCount - 1;
  if (colEnd < 0 || rowEnd < 0) {
    return;
  }

  // column header
  for (let row = 0; row < frozenRowCount; row++) {
    if (colEnd < colStart) {
      break;
    }
    [colStart, colEnd].forEach((col: number) => {
      const style = table._getCellStyle(col, row);
      if (style?.textStick && style?.textStick !== 'vertical') {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell Horizontal
        adjustCellContentHorizontalLayout(
          cellGroup,
          frozenColsWidth + table.tableX,
          table.tableNoFrameWidth - table.getRightFrozenColsWidth() + table.tableX,
          changedCells,
          style?.textStickBaseOnAlign,
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
      const style = table._getCellStyle(col, row);
      if (
        style?.textStick &&
        // (table.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType !== 'tree' &&
        style?.textStick !== 'horizontal'
      ) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell vertical
        adjustCellContentVerticalLayout(
          cellGroup,
          frozenRowsHeight + table.tableY,
          table.tableNoFrameHeight - table.getBottomFrozenRowsHeight() + table.tableY,
          changedCells,
          style?.textStickBaseOnAlign,
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
      const style = table._getCellStyle(col, row);
      if (style?.textStick && style?.textStick !== 'horizontal') {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell vertical
        adjustCellContentVerticalLayout(
          cellGroup,
          frozenRowsHeight + table.tableY,
          table.tableNoFrameHeight - table.getBottomFrozenRowsHeight() + table.tableY,
          changedCells,
          style?.textStickBaseOnAlign,
          table
        );
      }
    });
  }
  for (let row = rowStart; row <= rowEnd; row++) {
    if (colEnd < colStart) {
      break;
    }
    [colStart, colEnd].forEach((col: number) => {
      const style = table._getCellStyle(col, row);
      if (style?.textStick && style?.textStick !== 'vertical') {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell Horizontal
        adjustCellContentHorizontalLayout(
          cellGroup,
          frozenColsWidth + table.tableX,
          table.tableNoFrameWidth - table.getRightFrozenColsWidth() + table.tableX,
          changedCells,
          style?.textStickBaseOnAlign,
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
  textStickBaseOnAlign: boolean | undefined,
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
        if (singleCellGroup.role !== 'cell') {
          continue;
        }
        dealVertical(singleCellGroup, minTop, maxTop, changedCells, textStickBaseOnAlign);
      }
    }
  } else {
    dealVertical(cellGroup, minTop, maxTop, changedCells, textStickBaseOnAlign);
  }
}

function dealVertical(
  cellGroup: Group,
  minTop: number,
  maxTop: number,
  changedCells: Map<string, StickCell>,
  textStickBaseOnAlign: boolean | undefined
) {
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

  // const textBaseline = (graphic as any).attribute.textBaseline ?? (graphic as any).textBaseline ?? 'top';
  const textBaseline = (graphic as any).textBaseline ?? 'top';

  graphic.AABBBounds.width();
  const textTop = graphic.globalAABBBounds.y1;
  const textBottom = graphic.globalAABBBounds.y2;

  if (textBaseline === 'middle' && textStickBaseOnAlign) {
    const cellTop = cellGroup.globalAABBBounds.y1 + ((cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0);
    const cellBottom = cellTop + (cellGroup.contentHeight ?? cellGroup.attribute.height ?? 0);
    if (cellTop < minTop || cellBottom > maxTop) {
      const visibleCellTop = Math.max(cellTop, minTop);
      const visibleCellBottom = Math.min(cellBottom, maxTop);
      const delta =
        graphic.globalTransMatrix.f - (visibleCellBottom + visibleCellTop) / 2 + graphic.AABBBounds.height() / 2;
      !changedCells.has(`${cellGroup.col}-${cellGroup.row}`) &&
        changedCells.set(`${cellGroup.col}-${cellGroup.row}`, {
          col: cellGroup.col,
          row: cellGroup.row,
          dx: (cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0,
          dy: (cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0
        });
      cellGroup.forEachChildren((child: IGraphic) => {
        child.setAttribute('dy', (child.attribute.dy ?? 0) - delta + 2); // 2 is the buffer
      });
    }
  } else if (textTop < minTop) {
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
  textStickBaseOnAlign: boolean | undefined,
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
        if (singleCellGroup.role !== 'cell') {
          continue;
        }
        dealHorizontal(singleCellGroup, minLeft, maxLeft, changedCells, textStickBaseOnAlign);
      }
    }
  } else {
    dealHorizontal(cellGroup, minLeft, maxLeft, changedCells, textStickBaseOnAlign);
  }
}

function dealHorizontal(
  cellGroup: Group,
  minLeft: number,
  maxLeft: number,
  changedCells: Map<string, StickCell>,
  textStickBaseOnAlign: boolean | undefined
) {
  // get text element
  // const text = cellGroup.getChildByName('text', true) as Text;
  // if (!text) {
  //   return;
  // }

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
  const textAlign = (graphic as any).attribute.textAlign ?? (graphic as any).textAlign ?? 'left';
  graphic.AABBBounds.width();
  const textLeft = graphic.globalAABBBounds.x1;
  const textRight = graphic.globalAABBBounds.x2;
  if (textAlign === 'center' && textStickBaseOnAlign) {
    const cellLeft = cellGroup.globalAABBBounds.x1 + ((cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0);
    const cellRight = cellLeft + (cellGroup.contentWidth ?? cellGroup.attribute.width ?? 0);
    if (cellLeft < minLeft || cellRight > maxLeft) {
      const visibleCellLeft = Math.max(cellLeft, minLeft);
      const visibleCellRight = Math.min(cellRight, maxLeft);
      const delta = graphic.globalTransMatrix.e - (visibleCellRight + visibleCellLeft) / 2;
      !changedCells.has(`${cellGroup.col}-${cellGroup.row}`) &&
        changedCells.set(`${cellGroup.col}-${cellGroup.row}`, {
          col: cellGroup.col,
          row: cellGroup.row,
          dx: (cellGroup.firstChild as IGraphic)?.attribute.dx ?? 0,
          dy: (cellGroup.firstChild as IGraphic)?.attribute.dy ?? 0
        });
      cellGroup.forEachChildren((child: IGraphic) => {
        child.setAttribute('dx', (child.attribute.dx ?? 0) - delta + 2); // 2 is the buffer
      });
    }
  } else if (textLeft < minLeft) {
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
  const themeStick =
    table.theme.headerStyle.textStick || table.theme.rowHeaderStyle.textStick || table.theme.bodyStyle.textStick;
  if (themeStick) {
    return true;
  }
  return false;
}
