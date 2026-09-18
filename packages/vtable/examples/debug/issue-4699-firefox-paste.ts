import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';

const CONTAINER_ID = 'vTable';
const PASTE_VALUE = 'Firefox paste works';
const inputEditor = new InputEditor({});
VTable.register.editor('issue4699-input', inputEditor);

interface Issue4699Window extends Window {
  tableInstance?: VTable.ListTable;
  issue4699Run?: () => void;
  BUGSERVER_SCREENSHOT?: () => void;
}

const records = [
  { item: 'Alpha', result: 'Waiting' },
  { item: 'Beta', result: 'Waiting' },
  { item: 'Gamma', result: 'Waiting' }
];

const createPasteEvent = (text: string) => {
  const event = new Event('paste', { bubbles: true });
  Object.defineProperty(event, 'clipboardData', {
    value: {
      types: ['text/plain'],
      getData: (type: string) => (type === 'text/plain' ? text : '')
    }
  });
  return event;
};

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Missing #${CONTAINER_ID} container`);
  }
  const status = document.createElement('div');
  status.id = 'issue4699Status';
  status.style.cssText = [
    'height: 36px',
    'line-height: 36px',
    'margin-bottom: 8px',
    'padding: 0 12px',
    'font: 600 14px/36px sans-serif',
    'background: #f5f5f5',
    'color: #595959'
  ].join(';');
  status.textContent = 'READY | Select a Result cell and paste in Firefox';
  container.parentElement?.insertBefore(status, container);

  const tableInstance = new VTable.ListTable(container, {
    records,
    columns: [
      { field: 'item', title: 'Item', width: 180 },
      { field: 'result', title: 'Result', width: 260, editor: 'issue4699-input' }
    ],
    keyboardOptions: {
      pasteValueToCell: true
    },
    widthMode: 'standard',
    defaultRowHeight: 44
  });

  const targetRow = tableInstance.columnHeaderLevelCount;
  const runCheck = () => {
    tableInstance.selectCell(1, targetRow);
    tableInstance.getElement().focus();
    tableInstance.getElement().dispatchEvent(createPasteEvent(PASTE_VALUE));
  };

  tableInstance.on(VTable.TABLE_EVENT_TYPE.PASTED_DATA, () => {
    requestAnimationFrame(() => {
      const value = tableInstance.getCellOriginValue(1, targetRow);
      const pass = value === PASTE_VALUE;
      status.textContent = `${pass ? 'PASS' : 'FAIL'} | pasted value: ${String(value)}`;
      status.style.background = pass ? '#f6ffed' : '#fff2f0';
      status.style.color = pass ? '#237804' : '#a8071a';
      (window as Issue4699Window).BUGSERVER_SCREENSHOT?.();
    });
  });

  (window as Issue4699Window).tableInstance = tableInstance;
  (window as Issue4699Window).issue4699Run = runCheck;
  requestAnimationFrame(runCheck);
}
