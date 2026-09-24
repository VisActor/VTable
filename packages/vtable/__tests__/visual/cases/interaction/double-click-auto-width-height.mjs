/**
 * BugServer case IDs: 6555f4339dabd71aa3845bb9
 * 验证目的：autoHeight 与自动换行同时启用时，双击列边界自动测量列宽并重排行高。
 * 改写：保留来源的列宽、自动换行和双击交互，记录换成匿名长文本。
 */
export default {
  mount(container) {
    // 较长描述先换行，使列宽改变同时触发行高更新。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'a', title: 'A', width: 150 },
        { field: 'b', title: 'B', width: 100 },
        { field: 'description', title: 'Description', width: 150 },
        { field: 'name', title: 'Name', width: 150 }],
      records: [{ a: 1, b: 2,
        description: 'A much longer description value that should initially wrap into several lines', name: 'Item A' },
      { a: 3, b: 4, description: 'Short', name: 'Item B' }],
      autoWrapText: true, heightMode: 'autoHeight', resize: { colResizeMode: 'all' }
    });
  },
  async exercise(page) {
    // 双击第三列表头边界，保留原来源的自动列宽操作。
    const edge = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(2, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__autoWidthBefore = b.x2 - b.x1;
      window.__autoRowHeightBefore = table.getCellRect(2, 1).bounds.y2 - table.getCellRect(2, 1).bounds.y1;
      return { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.dblclick(edge.x, edge.y, { delay: 80 });
  },
  async verify(page) {
    // 文本自动测量后列宽改变，且自动行高未小于最小行高。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const col = table.getCellRect(2, 0).bounds;
      const row = table.getCellRect(2, 1).bounds;
      const width = col.x2 - col.x1;
      const height = row.y2 - row.y1;
      if (width <= window.__autoWidthBefore || height < 24 || height > window.__autoRowHeightBefore + 2)
        throw new Error(`双击列宽和自动行高异常：${JSON.stringify({ width, height })}`);
    });
  }
};
