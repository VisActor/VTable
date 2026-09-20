// @ts-nocheck
import { ListTable, TABLE_EVENT_TYPE } from '../src';
import { createDiv, removeDom } from './dom';

global.__VERSION__ = 'none';

describe('clipboard paste', () => {
  test('uses paste event data before the asynchronous Clipboard API', async () => {
    const container = createDiv();
    container.style.width = '600px';
    container.style.height = '400px';

    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const read = jest.fn(() => Promise.reject(new Error('clipboard-read is unavailable')));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { read }
    });

    const table = new ListTable(container, {
      records: [{ name: 'before' }],
      columns: [{ field: 'name', title: 'Name', editor: '' }],
      keyboardOptions: {
        pasteValueToCell: true
      }
    });

    try {
      table.selectCell(0, table.columnHeaderLevelCount);
      const pasted = new Promise(resolve => {
        table.on(TABLE_EVENT_TYPE.PASTED_DATA, resolve);
      });
      const pasteEvent = new Event('paste', { bubbles: true });
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          types: ['text/plain'],
          getData: (type: string) => (type === 'text/plain' ? 'pasted in Firefox' : '')
        }
      });

      table.getElement().dispatchEvent(pasteEvent);
      await pasted;

      expect(read).not.toHaveBeenCalled();
      expect(table.getCellOriginValue(0, table.columnHeaderLevelCount)).toBe('pasted in Firefox');
    } finally {
      table.release();
      removeDom(container);
      if (clipboardDescriptor) {
        Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  });
});
