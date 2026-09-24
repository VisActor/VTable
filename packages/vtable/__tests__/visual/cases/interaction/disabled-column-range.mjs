/**
 * BugServer case IDs: 69cf25dde41b43005d89a623
 * 验证目的：拖选跨过禁选列时，选择范围与高亮不会覆盖该列。
 * 改写：保留 inline 表头选择、cross 高亮和禁选列，使用单元格矩形代替录制像素坐标。
 */
export default {
  mount(container) {
    // 固定四列及五行数据，最后一列明确禁止选择。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      select: { headerSelectMode: 'inline', highlightMode: 'cross', highlightInRange: true },
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100 },
        { field: 'note', title: 'Note', width: 150 },
        { field: 'name', title: 'Name', width: 150, disableSelect: true }
      ],
      records: [
        { progress: 100, id: 1, note: 'A1', name: 'A' },
        { progress: 80, id: 2, note: 'B2', name: 'B' },
        { progress: 1, id: 3, note: 'C3', name: 'C' },
        { progress: 55, id: 4, note: 'D4', name: 'D' },
        { progress: 28, id: 5, note: 'E5', name: 'E' }
      ],
      showPin: true, widthMode: 'standard', allowFrozenColCount: 2
    });
  },
  async exercise(page) {
    // 复现来源中从首列拖至禁选列的动作。
    const points = await page.evaluate(() => {
      const host = document.getElementById('table').getBoundingClientRect();
      return [[0, 1], [3, 4]].map(([col, row]) => {
        const b = window.__visualTable.getCellRect(col, row).bounds;
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      });
    });
    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();
    await page.mouse.move(points[1].x, points[1].y, { steps: 8 });
    await page.mouse.up();
  },
  async verify(page) {
    // 至少选择一个单元格，并检查范围没有进入禁选列。
    await page.evaluate(() => {
      const ranges = window.__visualTable.getSelectedCellRanges();
      if (!ranges.length || ranges.some(range => Math.max(range.start.col, range.end.col) >= 3))
        throw new Error(`禁选列进入选择范围：${JSON.stringify(ranges)}`);
    });
  }
};
