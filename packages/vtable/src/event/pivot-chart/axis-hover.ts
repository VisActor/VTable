import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function bindAxisHoverEvent(table: BaseTableAPI) {
  if (!table.isPivotChart()) {
    return;
  }

  table.on(TABLE_EVENT_TYPE.MOUSEENTER_CELL, e => {
    const cellGroup = table.scenegraph.getCell(e.col, e.row);
    cellGroup.forEachChildren(child => {
      if (child.name === 'axis') {
        const position = getAxisPosition(e.col, e.row, table.internalProps.layoutMap as PivotHeaderLayoutMap);
        (e as any).axisPosition = position;
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEENTER_AXIS, e as any);
      }
    });
  });

  table.on(TABLE_EVENT_TYPE.MOUSELEAVE_CELL, e => {
    const cellGroup = table.scenegraph.getCell(e.col, e.row);
    cellGroup.forEachChildren(child => {
      if (child.name === 'axis') {
        const position = getAxisPosition(e.col, e.row, table.internalProps.layoutMap as PivotHeaderLayoutMap);
        (e as any).axisPosition = position;
        table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_AXIS, e as any);
      }
    });
  });
}

function getAxisPosition(col: number, row: number, layout: PivotHeaderLayoutMap) {
  if (layout.indicatorsAsCol) {
    if (
      layout.hasTwoIndicatorAxes &&
      row === layout.columnHeaderLevelCount - 1 &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      return 'top';
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      return 'bottom';
    } else if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.rowHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      return 'left';
    }
  } else {
    if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      return 'left';
    } else if (
      col === layout.colCount - layout.rightFrozenColCount &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      return 'right';
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      return 'bottom';
    }
  }
  return 'bottom';
}
