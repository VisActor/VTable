import type { ListTable, MousePointerCellEvent } from '../../..';
import { TABLE_EVENT_TYPE } from '../../../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getCellEventArgsSet } from '../../util';

// 双击自动列宽
export function bindDBClickAutoColumnWidthEvent(table: BaseTableAPI) {
  table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, (e: MousePointerCellEvent) => {
    if (e.federatedEvent) {
      const eventArgsSet = getCellEventArgsSet(e.federatedEvent as any);
      const resizeCol = table.scenegraph.getResizeColAt(
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgsSet.eventArgs?.targetCell
      );
      const disableDblclickAutoResizeColWidth =
        table.options.disableDblclickAutoResizeColWidth ?? table.options.resize?.disableDblclickAutoResizeColWidth;
      if (table.eventManager.checkCellFillhandle(eventArgsSet)) {
        table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_FILL_HANDLE, {});
      } else if (
        table._canResizeColumn(resizeCol.col, resizeCol.row) &&
        resizeCol.col >= 0 &&
        !disableDblclickAutoResizeColWidth
      ) {
        table.scenegraph.updateAutoColWidth(resizeCol.col);
        table.internalProps._widthResizedColMap.add(resizeCol.col);
        // if (table.isPivotChart()) {
        table.scenegraph.updateChartSizeForResizeColWidth(resizeCol.col);
        // }
        const state = table.stateManager;
        // update frozen shadowline component
        if (
          state.columnResize.col < state.table.frozenColCount &&
          !state.table.isPivotTable() &&
          !(state.table as ListTable).transpose
        ) {
          state.table.scenegraph.component.setFrozenColumnShadow(
            state.table.frozenColCount - 1,
            state.columnResize.isRightFrozen
          );
        }

        table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, {
          col: resizeCol.col,
          colWidths: table.getColsWidths()
        });
      }
    }
  });
}
