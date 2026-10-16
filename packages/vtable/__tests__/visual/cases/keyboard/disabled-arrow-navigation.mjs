/**
 * BugServer case IDs: 6697b10caeb8a00109f2ddb3, 6697b191aeb8a00109f2ddb4
 * 验证目的：键盘向左跳过禁选列，向上到表头时选中可用的整列。
 * 改写：保留禁选首列与键盘操作，记录改为连续匿名编号。
 */
export default {
  mount(container) {
    // 首列禁止选择，其余两列允许键盘导航。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 120, disableSelect: true },
        { field: 'name', title: 'Name', width: 160 },
        { field: 'score', title: 'Score', width: 120 }],
      records: Array.from({ length: 4 }, (_, i) => ({ id: i + 1,
        name: `Item ${i + 1}`, score: (i + 1) * 10 }))
    });
    table.getElement().tabIndex = 0;
    return table;
  },
  async exercise(page) {
    // 两个方向分别从源用例相同的单元格起点发出原生键盘事件。
    await page.evaluate(() => {
      const table = window.__visualTable;
      table.selectCell(1, 2);
      table.getElement().focus();
    });
    await page.keyboard.press('Control+ArrowLeft');
    await page.evaluate(() => {
      window.__leftRanges = window.__visualTable.getSelectedCellRanges();
      window.__visualTable.selectCell(1, 1);
      window.__visualTable.getElement().focus();
    });
    await page.keyboard.press('ArrowUp');
  },
  async verify(page) {
    // 向左保持在可选列，向上进入表头后只能选择当前整列。
    await page.evaluate(() => {
      const left = window.__leftRanges;
      const up = window.__visualTable.getSelectedCellRanges();
      if (!left.length || left.some(range => range.start.col === 0 || range.end.col === 0) ||
        up.length !== 1 || up[0].start.col !== 1 || up[0].end.col !== 1 ||
        up[0].start.row !== 0 || up[0].end.row !== 4)
        throw new Error(`禁选导航结果异常：${JSON.stringify({ left, up })}`);
    });
  }
};
