import { ListTable } from '../../src';
import { createDiv, removeDom } from '../dom';

Object.assign(global, { __VERSION__: 'none' });

test('reads the column width definitions once when applying width limits', () => {
  const container = createDiv();
  const table = new ListTable(container, {
    columns: [
      { field: 'name', width: 100, minWidth: 80, maxWidth: 120 },
      { field: 'count', width: 70, minWidth: 60, maxWidth: 90 },
      { field: 'note', width: 'auto', minWidth: 40 }
    ],
    records: [{ name: 'One', count: 1, note: 'Example' }]
  });
  const widths = jest.spyOn(table.internalProps.layoutMap, 'columnWidths', 'get');

  try {
    table.setMinMaxLimitWidth(true);

    expect(widths).toHaveBeenCalledTimes(1);
    expect(table.getColWidth(0)).toBe(100);
    expect(table.getMinColWidth(1)).toBe(60);
    expect(table.getMaxColWidth(1)).toBe(90);
    expect(table.getMinColWidth(2)).toBe(40);
  } finally {
    widths.mockRestore();
    table.release();
    removeDom(container);
  }
});
