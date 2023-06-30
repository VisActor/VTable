import { isValid } from '@visactor/vutils';
import type { EventHandler } from '../EventHandler';
import type { KeydownEvent } from '../../ts-types';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { handleWhell } from '../scroll';
import { browser } from '../../tools/helper';
import type { EventManeger } from '../event';

export function bindContainerDomListener(eventManeger: EventManeger) {
  const table = eventManeger.table;
  const stateManeger = table.stateManeger;
  const handler: EventHandler = table.internalProps.handler;

  handler.on(table.getElement(), 'blur', (e: MouseEvent) => {
    console.log('blur');
    eventManeger.dealTableHover();
    // eventManeger.dealTableSelect();
  });

  handler.on(table.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, stateManeger);
  });

  // 监听键盘事件
  handler.on(table.getElement(), 'keydown', (e: KeyboardEvent) => {
    if (table.keyboardOptions?.selectAllOnCtrlA) {
      // 处理全选
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        //全选
        eventManeger.deelTableSelectAll();
      }
    }
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.KEYDOWN)) {
      const cellsEvent: KeydownEvent = {
        keyCode: e.keyCode ?? e.which,
        code: e.code,
        event: e,
        cells: table.getSelectedCellInfos(),
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
      }
    }
  });

  handler.on(table.getElement(), 'contextmenu', (e: any) => {
    e.preventDefault();
  });

  handler.on(table.getParentElement(), 'resize', () => {
    table.resize();
  });
}
