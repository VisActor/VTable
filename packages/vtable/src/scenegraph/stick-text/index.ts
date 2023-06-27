import type { IGraphic } from '@visactor/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { PIVOT_TABLE_EVENT_TYPE } from '../../ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import type { Group } from '../graphic/group';
import type { WrapText } from '../graphic/text';
import { table } from 'console';
const changedCells: { col: number; row: number }[] = [];
export function handleTextStick(table: BaseTableAPI) {
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

  const { scrollTop, scrollLeft, frozenRowCount, frozenColCount } = table;
  const frozenRowsHeight = table.getFrozenRowsHeight();
  const frozenColsWidth = table.getFrozenColsWidth();
  // 计算非冻结
  const { row: rowStart } = table.getRowAt(scrollTop + frozenRowsHeight + 1);
  const { col: colStart } = table.getColAt(scrollLeft + frozenColsWidth + 1);
  const rowEnd =
    table.getAllRowsHeight() > table.tableNoFrameHeight
      ? table.getRowAt(scrollTop + table.tableNoFrameHeight - 1).row
      : table.rowCount - 1;
  const colEnd =
    table.getAllColsWidth() > table.tableNoFrameWidth
      ? table.getColAt(scrollLeft + table.tableNoFrameWidth - 1).col
      : table.colCount - 1;
  // 列表头单元格
  for (let row = 0; row < frozenRowCount; row++) {
    for (let col = 0; col <= colEnd; col++) {
      if (table._getCellStyle(col, row)?.textStick) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell Horizontal
        adjustCellContentHorizontalLayout(cellGroup, 0, table.tableNoFrameWidth);
        changedCells.push({ col, row });
      }
    }
  }

  // 行表头单元格
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = 0; col < frozenColCount; col++) {
      if (table._getCellStyle(col, row)?.textStick) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell vertical
        adjustCellContentVerticalLayout(cellGroup, frozenRowsHeight, table.tableNoFrameHeight);
        changedCells.push({ col, row });
      }
    }
  }
  // body单元格
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      if (table._getCellStyle(col, row)?.textStick) {
        const cellGroup = table.scenegraph.getCell(col, row);
        // adjust cell vertical
        adjustCellContentVerticalLayout(cellGroup, frozenRowsHeight, table.tableNoFrameHeight);
        // adjust cell Horizontal
        adjustCellContentHorizontalLayout(cellGroup, frozenColsWidth, table.tableNoFrameWidth);
        changedCells.push({ col, row });
      }
    }
  }
}

/*
 * adjust cell content vertical layout
 * @param {Group} cellGroup
 * @param {number} scrollTop
 */
function adjustCellContentVerticalLayout(cellGroup: Group, minTop: number, maxTop: number) {
  // get text element
  const text = cellGroup.getChildByName('text', true) as WrapText;
  if (!text) {
    return;
  }
  text.AABBBounds.width();
  const textTop = text.globalAABBBounds.y1;
  const textBottom = text.globalAABBBounds.y2;

  if (textTop < minTop) {
    const deltaHeight = textTop - minTop;
    // text is out of view, move all elements down
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dy', -deltaHeight + 2); // 2 is the buffer
    });
  } else if (textBottom > maxTop) {
    const deltaHeight = textBottom - maxTop;
    // text is out of view, move all elements down
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dy', -deltaHeight); // 2 is the buffer
    });
  }
}

/*
 * adjust cell content horizontal layout
 * @param {Group} cellGroup
 * @param {number} scrollLeft
 */
function adjustCellContentHorizontalLayout(cellGroup: Group, minLeft: number, maxLeft: number) {
  // get text element
  const text = cellGroup.getChildByName('text', true) as WrapText;
  if (!text) {
    return;
  }
  text.AABBBounds.width();
  const textLeft = text.globalAABBBounds.x1;
  const textRight = text.globalAABBBounds.x2;
  if (textLeft < minLeft) {
    const deltaWidth = textLeft - minLeft;
    // text is out of view, move all elements right
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dx', -deltaWidth + 2); // 2 is the buffer
    });
  } else if (textRight > maxLeft) {
    const deltaWidth = textRight - maxLeft;
    // text is out of view, move all elements down
    cellGroup.forEachChildren((child: IGraphic) => {
      child.setAttribute('dx', -deltaWidth); // 2 is the buffer
    });
  }
}
