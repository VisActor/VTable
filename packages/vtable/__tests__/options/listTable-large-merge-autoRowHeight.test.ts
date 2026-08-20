// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv, removeDom } from '../dom';
import { handleTextStick } from '../../src/scenegraph/stick-text';

global.__VERSION__ = 'none';

const columns = [
  {
    field: 'category',
    title: '类别',
    width: 79,
    mergeCell: true,
    cellType: 'link',
    linkDetect: true,
    linkJump: false,
    style: {
      textAlign: 'left',
      textStick: true,
      textStickBaseOnAlign: true,
      padding: [8.6, 12, 8.6, 12],
      fontSize: 12,
      lineHeight: 18
    }
  },
  {
    field: 'subcategory',
    title: '子类别',
    width: 79,
    mergeCell: true,
    cellType: 'link',
    linkDetect: true,
    linkJump: false,
    style: {
      textAlign: 'left',
      textStick: true,
      textStickBaseOnAlign: true,
      padding: [8.6, 12, 8.6, 12],
      fontSize: 12,
      lineHeight: 18
    }
  }
];

function createRecords(count: number, mergeStartRow: number, mergeEndRow: number) {
  return Array.from({ length: count }, (_, index) => ({
    category: index + 1 >= mergeStartRow && index + 1 <= mergeEndRow ? '办公用品' : `类别 ${index}`,
    subcategory: index < Math.min(883, count) ? '装订机' : '美术'
  }));
}

function createTable(mergeStartRow: number, mergeEndRow: number, minSingleRowHeight?: number) {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '400px';
  containerDom.style.height = '500px';

  const table = new ListTable({
    container: containerDom,
    records: createRecords(1000, mergeStartRow, mergeEndRow),
    columns,
    widthMode: 'standard',
    heightMode: 'autoHeight',
    autoWrapText: false,
    showHeader: true,
    customConfig: {
      minSingleRowHeight
    }
  });

  return { table, containerDom };
}

describe('listTable large merge auto row height', () => {
  test('keeps a default minimum row height for large merged cells', () => {
    const { table, containerDom } = createTable(1, 1000);

    expect(table.getRowHeight(1)).toBeGreaterThanOrEqual(2);

    table.release();
    removeDom(containerDom);
  });

  test('respects positive custom minSingleRowHeight for large merged cells', () => {
    const { table, containerDom } = createTable(1, 1000, 5);

    expect(table.getRowHeight(1)).toBeGreaterThanOrEqual(5);

    table.release();
    removeDom(containerDom);
  });

  test('handles merged cells that do not start from the first body row', () => {
    const { table, containerDom } = createTable(10, 900, 4);

    expect(table.getRowHeight(10)).toBeGreaterThanOrEqual(4);

    table.release();
    removeDom(containerDom);
  });

  test('keeps text stick visible while scrolling large merged cells', () => {
    const { table, containerDom } = createTable(1, 1000, 5);

    table.setScrollTop(3000);
    handleTextStick(table);
    const { rowStart, rowEnd } = table.scenegraph.proxy;
    const visibleText = [];
    for (let row = rowStart; row <= rowEnd; row++) {
      const cellGroup = table.scenegraph.getCell(0, row);
      const text = cellGroup.getChildByName('text', true);
      if (text.globalAABBBounds.y1 >= 0 && text.globalAABBBounds.y2 <= 500) {
        visibleText.push(text);
      }
    }

    expect(visibleText.length).toBeGreaterThan(0);

    table.release();
    removeDom(containerDom);
  });

  test('keeps maintained rows covering viewport after deep scrolling tiny rows', () => {
    const { table, containerDom } = createTable(1, 1000, 5);

    table.setScrollTop(4500);
    const { rowStart, rowEnd } = table.scenegraph.proxy;
    let maxCellBottom = -Infinity;
    for (let row = rowStart; row <= rowEnd; row++) {
      const cellGroup = table.scenegraph.getCell(0, row);
      maxCellBottom = Math.max(maxCellBottom, cellGroup.globalAABBBounds.y2);
    }

    expect(maxCellBottom).toBeGreaterThanOrEqual(table.scenegraph.tableGroup.attribute.height);

    table.release();
    removeDom(containerDom);
  });
});
