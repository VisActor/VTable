/**
 * BugServer case IDs: 65ae4667366fb000953feeb4
 * 验证目的：adjustFrozenCount 模式将普通列拖入左冻结区时增加冻结列数。
 * 改写：来源的大数据和额外图标删除，只保留跨冻结边界拖动。
 */
export default {
  mount(container) {
    // 前两列冻结，列 C 从非冻结区移入冻结区后应将冻结列数改为三。
    return new window.VTable.ListTable(container, {
      columns: ['A', 'B', 'C', 'D', 'E'].map(field => ({ field, title: field, width: 120 })),
      records: [{ A: 'A1', B: 'B1', C: 'C1', D: 'D1', E: 'E1' }],
      dragHeaderMode: 'all', frozenColDragHeaderMode: 'adjustFrozenCount',
      frozenColCount: 2, widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 在真实表头上选中 C，再拖至 A 的左侧。
    const [from, to] = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      return [2, 0].map(col => {
        const b = table.getCellRect(col, 0).bounds;
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      });
    });
    await page.mouse.click(from.x, from.y);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // 顺序和冻结列数必须同步变化，避免只更新外观。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const fields = [0, 1, 2, 3, 4].map(col => table.getHeaderField(col, 0));
      if (fields.join(',') !== 'C,A,B,D,E' || table.frozenColCount !== 3)
        throw new Error(`拖入冻结区未调整列数：${JSON.stringify({ fields, count: table.frozenColCount })}`);
    });
  }
};
