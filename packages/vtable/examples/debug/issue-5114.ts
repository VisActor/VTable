import * as VTable from '../../src';
import { InputEditor, ValidateEnum } from '@visactor/vtable-editors';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

export function createTable() {
  const personsDataSource = [
    { progress: 100, id: 1, name: 'a' },
    { progress: 80, id: 2, name: 'b' },
    { progress: 1, id: 3, name: 'c' },
    { progress: 55, id: 4, name: 'd' },
    { progress: 28, id: 5, name: 'e' }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    editCellTrigger: 'click',
    columns: [
      {
        field: 'progress',
        title: 'progress',
        width: 200,
        editor: 'input'
      },
      {
        field: 'id',
        title: 'ID',
        width: 200
      }
    ],
    widthMode: 'standard',
    records: personsDataSource
  };

  const instance = new ListTable(option);

  // 配置 validateValue，当值为空时返回 invalidate-not-exit
  input_editor.validateValue = (newValue, _oldValue, _cell, _table) => {
    if (newValue === '' || newValue === null || newValue === undefined) {
      return ValidateEnum.invalidateNotExit;
    }
    return ValidateEnum.validateExit;
  };

  const w = window as unknown as { tableInstance?: unknown };
  w.tableInstance = instance;
}
