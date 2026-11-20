import { ListTable } from '../../src';

const container = document.getElementById('vtable');
if (!container) {
  throw new Error('Missing #vtable container');
}

const table = new ListTable(container, {
  records: [{ value: 'before' }],
  columns: [{ field: 'value', title: 'Value', editor: '' }],
  keyboardOptions: {
    pasteValueToCell: true
  }
});

Object.defineProperty(window, '__issue4699Table', {
  configurable: true,
  value: table
});
