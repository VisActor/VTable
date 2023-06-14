import type { IGraphic } from '@visactor/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { PIVOT_TABLE_EVENT_TYPE } from '../../ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import type { Group } from '../graphic/group';
import type { WrapText } from '../graphic/text';

export function handleTextStick(table: BaseTableAPI) {
  const changedCells: { col: number; row: number }[] = [];
  table.listen(PIVOT_TABLE_EVENT_TYPE.SCROLL, e => {
    // reset all changed cell height
    changedCells.forEach(cellPos => {
      const cellGroup = table.scenegraph.getCell(cellPos.col, cellPos.row);
      cellGroup.forEachChildren((child: IGraphic) => {
        child.setAttributes({
          dy: 0,
          dx: 0
        });
      });
    });
    changedCells.length = 0;

    const { scrollTop, scrollLeft } = e;
    if (scrollTop) {
      const frozenRowsHeight = table.getFrozenRowsHeight();
      const { row } = table.getRowAt(scrollTop + frozenRowsHeight + 1);
      // ergodic all cells in this row, find the header cell with textStick style enabled
      for (let col = 0; col < table.colCount; col++) {
        if (table.isHeader(col, row) && table._getCellStyle(col, row)?.textStick) {
          // adjust cell vertical layout
          const cellGroup = table.scenegraph.getCell(col, row);
          adjustCellContentVerticalLayout(cellGroup, frozenRowsHeight);

          // record cell info
          changedCells.push({ col, row });
        }
      }
    }

    if (scrollLeft) {
      const frozenRowsWidth = table.getFrozenColsWidth();
      const { col } = table.getColAt(scrollLeft + frozenRowsWidth + 1);
      // ergodic all cells in this col, find the header cell with textStick style enabled
      for (let row = 0; row < table.rowCount; row++) {
        if (table.isHeader(col, row) && table._getCellStyle(col, row)?.textStick) {
          // adjust cell horizontal layout
          const cellGroup = table.scenegraph.getCell(col, row);
          adjustCellContentHorizontalLayout(cellGroup, frozenRowsWidth);

          // record cell info
          changedCells.push({ col, row });
        }
      }
    }
  });
}

/*
 * adjust cell content vertical layout
 * @param {Group} cellGroup
 * @param {number} scrollTop
 */
function adjustCellContentVerticalLayout(cellGroup: Group, scrollTop: number) {
  // get text element
  const text = cellGroup.getChildByName('text', true) as WrapText;
  if (!text) {
    return;
  }
  text.AABBBounds.width();
  const textTop = text.globalAABBBounds.y1;

  if (textTop < scrollTop) {
    const deltaHeight = textTop - scrollTop;
    // text is out of view, move all elements down
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dy', -deltaHeight + 2); // 2 is the buffer
    });
  }
}

/*
 * adjust cell content horizontal layout
 * @param {Group} cellGroup
 * @param {number} scrollLeft
 */
function adjustCellContentHorizontalLayout(cellGroup: Group, scrollLeft: number) {
  // get text element
  const text = cellGroup.getChildByName('text', true) as WrapText;
  if (!text) {
    return;
  }
  text.AABBBounds.width();
  const textLeft = text.globalAABBBounds.x1;

  if (textLeft < scrollLeft) {
    const deltaWidth = textLeft - scrollLeft;
    // text is out of view, move all elements right
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dx', -deltaWidth + 2); // 2 is the buffer
    });
  }
}
