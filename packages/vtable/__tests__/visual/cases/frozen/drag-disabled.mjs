/**
 * BugServer case IDs: 65ae4544366fb000953feeb1
 * 验证目的：disabled 模式禁止拖动冻结列表头，同时普通列仍可拖动。
 * 改写：来源的五千行人员记录和 SVG 去除，保留左右冻结及两次表头拖动。
 */
export default {
  mount(container) {
    // 前两列和末列冻结，普通列 C、D 可作为对照进行真实拖动。
    return new window.VTable.ListTable(container, {
      columns: ['A', 'B', 'C', 'D', 'E'].map(field => ({ field, title: field, width: 120 })),
      records: [{ A: 'A1', B: 'B1', C: 'C1', D: 'D1', E: 'E1' }],
      dragHeaderMode: 'all', frozenColDragHeaderMode: 'disabled',
      frozenColCount: 2, rightFrozenColCount: 1, widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 先尝试把冻结列 A 拖至 D，再将普通列 D 拖至 C。
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      return [0, 2, 3].map(col => {
        const b = table.getCellRect(col, 0).bounds;
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      });
    });
    for (const [from, to] of [[points[0], points[2]], [points[2], points[1]]]) {
      await page.mouse.click(from.x, from.y);
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      await page.mouse.move(to.x, to.y, { steps: 12 });
      await page.mouse.up();
    }
  },
  async verify(page) {
    // 冻结列仍在原位，普通两列交换，说明并非整个拖动模式失效。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const fields = [0, 1, 2, 3, 4].map(col => table.getHeaderField(col, 0));
      if (fields.join(',') !== 'A,B,D,C,E' || table.frozenColCount !== 2)
        throw new Error(`禁拖冻结列表头结果异常：${JSON.stringify(fields)}`);
    });
  }
};
