/**
 * BugServer case IDs: 6747e56a71189400b2ec8dc7
 * 验证目的：disableSelect 回调同时禁选指定行和列，其余单元格可选择。
 * 改写：去掉格式化、排序和主题设置，保留源用例的行列禁选规则与点击顺序。
 */
export default {
  mount(container) {
    // 第 2 行和第 2 列由同一个回调决定禁选状态。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { field: 'name', title: 'Name', width: 130 },
        { field: 'status', title: 'Status', width: 130 },
        { field: 'progress', title: 'Progress', width: 130 }],
      records: Array.from({ length: 5 }, (_, index) => ({ id: index + 1,
        name: `Item ${index + 1}`, status: 'Ready', progress: (index + 1) * 20 })),
      select: { disableSelect(col, row) { return row === 2 || col === 2; } }
    });
  },
  async exercise(page) {
    // 依次点击禁选行、禁选列和普通单元格，记录每一步的选择范围。
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      return [[0, 2], [2, 3], [0, 3]].map(([col, row]) => {
        const bounds = table.getCellRect(col, row).bounds;
        return { x: host.x + (bounds.x1 + bounds.x2) / 2,
          y: host.y + (bounds.y1 + bounds.y2) / 2 };
      });
    });
    await page.evaluate(() => { window.__selectSnapshots = []; });
    for (const point of points) {
      await page.mouse.click(point.x, point.y);
      await page.evaluate(() => window.__selectSnapshots.push(window.__visualTable.getSelectedCellRanges()));
    }
  },
  async verify(page) {
    // 前两个点击不能选择禁选区域，最后一次应选中普通单元格。
    await page.evaluate(() => {
      const [row, col, allowed] = window.__selectSnapshots;
      if (row.length || col.length || allowed.length !== 1 ||
        allowed[0].start.col !== 0 || allowed[0].start.row !== 3)
        throw new Error(`disableSelect 回调未生效：${JSON.stringify(window.__selectSnapshots)}`);
    });
  }
};
