import { isValid } from '@visactor/vutils';
import type { EventHandler } from '../EventHandler';
import type { KeydownEvent, ListTableAPI } from '../../ts-types';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { handleWhell } from '../scroll';
import { browser } from '../../tools/helper';
import type { EventManager } from '../event';

export function bindContainerDomListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;
  const handler: EventHandler = table.internalProps.handler;

  handler.on(table.getElement(), 'blur', (e: MouseEvent) => {
    eventManager.dealTableHover();
    // eventManager.dealTableSelect();
  });

  handler.on(table.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, stateManager);
  });

  // 监听键盘事件
  handler.on(table.getElement(), 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      if (table.keyboardOptions?.selectAllOnCtrlA) {
        // 处理全选
        e.preventDefault();
        //全选
        eventManager.deelTableSelectAll();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // 处理向上箭头键
      if (stateManager.select.cellPos.col >= 0 && stateManager.select.cellPos.row >= 0) {
        const targetCol = stateManager.select.cellPos.col;
        const targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row - 1));
        table.selectCell(targetCol, targetRow);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // 处理向下箭头键
      if (stateManager.select.cellPos.col >= 0 && stateManager.select.cellPos.row >= 0) {
        const targetCol = stateManager.select.cellPos.col;
        const targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row + 1));
        table.selectCell(targetCol, targetRow);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // 处理向左箭头键
      if (stateManager.select.cellPos.col >= 0 && stateManager.select.cellPos.row >= 0) {
        const targetRow = stateManager.select.cellPos.row;
        const targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col - 1));
        table.selectCell(targetCol, targetRow);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      // 处理向右箭头键
      if (stateManager.select.cellPos.col >= 0 && stateManager.select.cellPos.row >= 0) {
        const targetRow = stateManager.select.cellPos.row;
        const targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col + 1));
        table.selectCell(targetCol, targetRow);
      }
    }
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.KEYDOWN)) {
      const cellsEvent: KeydownEvent = {
        keyCode: e.keyCode ?? e.which,
        code: e.code,
        event: e,
        // cells: table.getSelectedCellInfos(),
        scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth
      };
      table.fireListeners(TABLE_EVENT_TYPE.KEYDOWN, cellsEvent);
    }
  });

  handler.on(table.getElement(), 'copy', (e: KeyboardEvent) => {
    if (table.keyboardOptions?.copySelected) {
      const data = table.getCopyValue();
      if (isValid(data)) {
        e.preventDefault();
        if (browser.IE) {
          (window as any).clipboardData.setData('Text', data); // IE
        } else {
          (e as any).clipboardData.setData('text/plain', data); // Chrome, Firefox
        }
        table.fireListeners(TABLE_EVENT_TYPE.COPY_DATA, {
          cellRange: table.stateManager.select.ranges,
          copyData: data
        });
      }
    }
  });

  handler.on(table.getElement(), 'contextmenu', (e: any) => {
    e.preventDefault();
  });

  handler.on(table.getContainer(), 'resize', () => {
    table.resize();
  });
}
