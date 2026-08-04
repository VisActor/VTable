import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';

const CONTAINER_ID = 'vTable';
const inputEditor = new InputEditor({});
VTable.register.editor('issue4810-input', inputEditor);

const createStatusBar = () => {
  const container = document.getElementById(CONTAINER_ID)!;
  const status = document.createElement('div');
  status.id = 'issue4810Status';
  status.style.cssText = 'height: 32px; line-height: 32px; font-size: 13px; color: #333;';
  status.textContent = 'Click "Check double edit" to verify issue #4810.';

  const button = document.createElement('button');
  button.textContent = 'Check double edit';
  button.style.cssText = 'margin: 0 0 8px 8px;';
  button.onclick = () => checkDoubleEdit();

  container.parentElement?.insertBefore(status, container);
  status.appendChild(button);
};

const checkDoubleEdit = () => {
  const tableInstance = (window as any).tableInstance as VTable.ListTable;
  const status = document.getElementById('issue4810Status')!;

  try {
    tableInstance.startEditCell(0, tableInstance.columnHeaderLevelCount);
    inputEditor.getInputElement()?.remove();
    (tableInstance.editorManager as any).editingEditor = null;
    tableInstance.startEditCell(1, tableInstance.columnHeaderLevelCount);
  } catch (err) {
    status.textContent = `FAIL | ${(err as Error).message}`;
    return status.textContent;
  }

  const inputElement = inputEditor.getInputElement();
  const tableElement = tableInstance.getElement();
  const pass =
    !!inputElement &&
    tableElement.contains(inputElement) &&
    inputElement.style.opacity === '1' &&
    inputElement.style.pointerEvents === 'auto' &&
    inputElement.style.left !== '';

  status.textContent = `${pass ? 'PASS' : 'FAIL'} | mounted=${
    !!inputElement && tableElement.contains(inputElement)
  }, left=${inputElement?.style.left}, top=${inputElement?.style.top}`;
  return status.textContent;
};

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    records: [
      { name: 'Alice', age: 20 },
      { name: 'Bob', age: 21 }
    ],
    columns: [
      { field: 'name', title: 'Name', width: 180, editor: 'issue4810-input' },
      { field: 'age', title: 'Age', width: 120, editor: 'issue4810-input' }
    ],
    editCellTrigger: 'doubleclick',
    editor: 'issue4810-input',
    widthMode: 'standard',
    defaultRowHeight: 36
  };

  createStatusBar();
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, option);
  (window as any).tableInstance = tableInstance;
  (window as any).issue4810Run = checkDoubleEdit;
}
