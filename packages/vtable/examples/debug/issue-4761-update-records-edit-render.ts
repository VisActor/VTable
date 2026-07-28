import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';

const CONTAINER_ID = 'vTable';
const inputEditor = new InputEditor({});
VTable.register.editor('input', inputEditor);

const records = [
  { name: 'John', age: 20 },
  { name: 'Jane', age: 21 }
];

const createStatusBar = () => {
  const container = document.getElementById(CONTAINER_ID)!;
  const status = document.createElement('div');
  status.id = 'issue4761Status';
  status.style.cssText = 'height: 32px; line-height: 32px; font-size: 13px; color: #333;';
  status.textContent = 'Click "Check updateRecords render" to verify issue #4761.';

  const button = document.createElement('button');
  button.textContent = 'Check updateRecords render';
  button.style.cssText = 'margin: 0 0 8px 8px;';
  button.onclick = () => checkUpdateRecordsRender();

  container.parentElement?.insertBefore(status, container);
  status.appendChild(button);
};

const getRenderedCellText = (tableInstance: VTable.ListTable, col: number, row: number) => {
  const cellGroup = tableInstance.scenegraph.getCell(col, row);
  const texts: string[] = [];
  cellGroup?.forEachChildren((child: any) => {
    const text = child?.attribute?.text;
    if (typeof text === 'string') {
      texts.push(text);
    } else if (Array.isArray(text)) {
      texts.push(text.join(''));
    }
  });
  return texts.join('');
};

const checkUpdateRecordsRender = async () => {
  const tableInstance = (window as any).tableInstance as VTable.ListTable;
  const status = document.getElementById('issue4761Status')!;
  records[0].name = 'aaa';
  tableInstance.updateRecords(records);

  await new Promise(resolve => requestAnimationFrame(resolve));

  const renderedText = getRenderedCellText(tableInstance, 0, tableInstance.columnHeaderLevelCount);
  const dataValue = tableInstance.getCellValue(0, tableInstance.columnHeaderLevelCount);
  const pass = renderedText.includes('aaa') && dataValue === 'aaa';
  status.textContent = `${pass ? 'PASS' : 'FAIL'} | rendered=${renderedText}, data=${dataValue}`;
  return status.textContent;
};

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    records,
    columns: [
      { field: 'name', title: 'First Name', width: 180, editor: 'input' },
      { field: 'age', title: 'Age', width: 120, editor: 'input' }
    ],
    editCellTrigger: 'doubleclick',
    editor: 'input',
    widthMode: 'standard',
    defaultRowHeight: 36
  };

  createStatusBar();
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, option);
  (window as any).tableInstance = tableInstance;
  (window as any).issue4761Run = checkUpdateRecordsRender;
}
