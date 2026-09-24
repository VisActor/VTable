/**
 * BugServer case IDs: 68ef4fe025696c00b26a774c
 * 验证目的：选中透视表体后插件高亮对应的行列标题。
 * 改写：多地区商品明细换成固定通用分组，保留插件双向高亮与点击。
 */
export default {
  mount(container) {
    // 插件实例留作状态断言，表格数据构成可见的行列交叉。
    const plugin = new window.VTable.plugins.HighlightHeaderWhenSelectCellPlugin({ rowHighlight: true, colHighlight: true });
    window.__highlightPlugin = plugin;
    return new window.VTable.PivotTable(container, {
      plugins: [plugin], rows: ['group', 'item'], columns: ['kind', 'variant'],
      indicators: ['amount', 'count'], indicatorsAsCol: false, enableDataAnalysis: true,
      records: [{ group: 'A', item: 'A1', kind: 'X', variant: 'X1', amount: 10, count: 1 },
        { group: 'A', item: 'A2', kind: 'Y', variant: 'Y1', amount: 20, count: 2 },
        { group: 'B', item: 'B1', kind: 'X', variant: 'X1', amount: 30, count: 3 }]
    });
  },
  async exercise(page) {
    // 点击首个表体数值，对应来源的 click-cell 录制动作。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(table.rowHeaderLevelCount, table.columnHeaderLevelCount).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 插件应产生行列标题高亮范围。
    await page.waitForFunction(() => window.__highlightPlugin.rowHeaderRanges.length && window.__highlightPlugin.colHeaderRanges.length);
  }
};
