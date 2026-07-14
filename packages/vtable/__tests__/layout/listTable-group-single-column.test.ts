// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

function collectText(graphic: any): string[] {
  const result: string[] = [];
  const children = graphic?.children ?? [];

  for (const child of children) {
    if (child.type === 'text') {
      result.push(child.attribute?.text);
    }
    result.push(...collectText(child));
  }

  return result;
}

describe('listTable group single column', () => {
  test('renders parent group title when there is only one data column', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '360px';

    const table = new ListTable(containerDom, {
      records: [
        { category: 'Furniture', subCategory: 'Bookcases', value: 'Bookcase' },
        { category: 'Furniture', subCategory: 'Chairs', value: 'Chair' }
      ],
      columns: [{ field: 'value', title: 'Value', width: 180 }],
      widthMode: 'standard',
      groupConfig: {
        groupBy: ['category', 'subCategory'],
        titleFieldFormat: record => `${record.vtableMergeName}(${record.children.length})`
      }
    });

    const groupRecord = table.getCellRawRecord(0, 1);
    expect(groupRecord.vtableMerge).toBe(true);

    const text = collectText(table.scenegraph.getCell(0, 1, true));
    expect(text).toContain('Furniture(2)');

    table.release();
  });
});
