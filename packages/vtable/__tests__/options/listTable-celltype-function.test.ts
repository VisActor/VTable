import { ListTable } from '../../src';
import { createDiv, removeDom } from '../dom';

(global as any).__VERSION__ = 'none';

describe('ListTable cellType function', () => {
  let containerDom: HTMLElement;

  beforeEach(() => {
    containerDom = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '300px';
    containerDom.style.height = '200px';
  });

  afterEach(() => {
    removeDom(containerDom);
  });

  test('falls back to text when cellType function returns undefined', () => {
    const table = new ListTable(containerDom, {
      records: [{ name: 'A' }],
      columns: [
        {
          field: 'name',
          title: 'Name',
          cellType: ((): any => undefined) as any
        }
      ]
    });

    const bodyRow = table.columnHeaderLevelCount;

    expect(table.getCellType(0, bodyRow)).toBe('text');
    expect(table.getBodyColumnType(0, bodyRow)).toBe('text');
    expect(table.getCellValue(0, bodyRow)).toBe('A');

    table.release();
  });
});
