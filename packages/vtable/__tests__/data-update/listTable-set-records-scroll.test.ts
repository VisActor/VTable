// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('listTable setRecords with horizontal scroll', () => {
  test('keeps visible headers after setRecords clears data at right scroll edge', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '900px';
    containerDom.style.height = '420px';

    const columns = Array.from({ length: 60 }, (_, index) => ({
      field: `field${index}`,
      title: `Field ${index}`,
      width: 120
    }));
    const records = Array.from({ length: 6 }, (_, rowIndex) => {
      const record: Record<string, number> = {};
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        record[`field${colIndex}`] = rowIndex * columns.length + colIndex;
      }
      return record;
    });

    const table = new ListTable(containerDom, {
      records,
      frozenRowCount: 3,
      bottomFrozenRowCount: 1,
      frozenColCount: 2,
      rightFrozenColCount: 2,
      columns,
      widthMode: 'standard',
      maintainedColumnCount: 20,
      rowSeriesNumber: {
        width: 50,
        format: () => '',
        cellType: 'checkbox',
        headerType: 'checkbox'
      }
    });

    table.setScrollLeft(100000);
    expect(table.getScrollLeft()).toBeGreaterThan(0);

    table.setRecords([]);

    const visibleHeader = table.getCellAtRelativePosition(500, 20);
    const headerCell = table.scenegraph.getCell(visibleHeader.col, visibleHeader.row);
    const frozenHeader = table.getCellAtRelativePosition(80, 20);
    const frozenHeaderCell = table.scenegraph.getCell(frozenHeader.col, frozenHeader.row);

    expect(table.records.length).toBe(0);
    expect(visibleHeader.row).toBe(0);
    expect(table.getCellValue(visibleHeader.col, visibleHeader.row)).toBeTruthy();
    expect(headerCell.children[0].attribute.text).toBe(table.getCellValue(visibleHeader.col, visibleHeader.row));
    expect(frozenHeader.col).toBe(1);
    expect(frozenHeader.row).toBe(0);
    expect(frozenHeaderCell.children[0].attribute.text).toBe('Field 0');
    expect(table.scenegraph.cornerHeaderGroup.attribute.width).toBe(table.getFrozenColsWidth());
    expect(table.scenegraph.colHeaderGroup.attribute.x + table.getScrollLeft()).toBe(table.getFrozenColsWidth());

    table.release();
  });
});
