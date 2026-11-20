// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('frozen row body coordinates', () => {
  test.each([0, 1, 5])('keeps body coordinates relative to %i frozen rows', frozenRowCount => {
    // 新建节点与滚动重排必须使用相同的冻结区底部原点，左右冻结列也遵循此约定。
    const container = createDiv();
    container.style.width = '800px';
    container.style.height = '400px';
    const table = new ListTable(container, {
      columns: ['left', 'body', 'right'].map(field => ({ field, title: field, width: 180 })),
      records: Array.from({ length: 2000 }, (_, i) => ({ left: i, body: i, right: i })),
      frozenRowCount,
      showHeader: frozenRowCount !== 0,
      defaultHeaderRowHeight: 54,
      defaultRowHeight: 32,
      frozenColCount: 1,
      rightFrozenColCount: 1,
      bottomFrozenRowCount: 1
    });
    try {
      for (let col = 0; col < table.colCount; col++) {
        const first = table.scenegraph.getCell(col, frozenRowCount);
        expect(first.role).toBe('cell');
        expect(first.attribute.y).toBe(0);
        expect(table.scenegraph.getCell(col, table.rowCount - 1).attribute.y).toBe(0);
        // 内容刷新不能重新引入表头行数与冻结行数之差。
        const row = frozenRowCount + 10;
        table.scenegraph.updateCellContent(col, row);
        expect(table.scenegraph.getCell(col, row).attribute.y).toBe(table.getRowsHeight(frozenRowCount, row - 1));
      }
    } finally {
      table.release();
    }
  });
});
