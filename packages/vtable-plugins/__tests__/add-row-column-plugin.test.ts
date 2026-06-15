// @ts-nocheck
import { ListTable } from '@visactor/vtable';
import { AddRowColumnPlugin } from '../src/add-row-column';
import { createDiv } from '../../vtable/__tests__/dom';

global.__VERSION__ = 'none';

describe('AddRowColumnPlugin release - issue #5140', () => {
  const columns = [
    { field: 'id', title: 'ID', width: 120 },
    { field: 'name', title: 'Name', width: 160 }
  ];
  const records = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  function createTable(pluginOptions) {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '600px';
    container.style.height = '400px';

    return new ListTable({
      container,
      columns,
      records,
      plugins: [new AddRowColumnPlugin(pluginOptions)]
    });
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('release should not throw when row controls are disabled', () => {
    const table = createTable({ addRowEnable: false });

    expect(() => table.release()).not.toThrow();
  });

  test('release should not throw when column controls are disabled', () => {
    const table = createTable({ addColumnEnable: false });

    expect(() => table.release()).not.toThrow();
  });
});
