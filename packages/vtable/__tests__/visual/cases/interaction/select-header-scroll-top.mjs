/**
 * BugServer case IDs: 6a1416f2709fdc006857f1dc
 * 验证目的：大量记录滚动后，冻结表头选择仍位于表头且滚动位置不回跳。
 * 改写：使用匿名序号记录，保留冻结行、inline 表头选择和滚动动作。
 */
export default {
  mount(container) {
    // 足够多的记录使 1000px 纵向滚动始终有真实表体可绘制。
    container.style.height = '400px';
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 180 },
        { field: 'value', title: 'Value', width: 140 }, { field: 'group', title: 'Group', width: 140 }],
      records: Array.from({ length: 120 }, (_, i) => ({ name: `Item ${i + 1}`, value: i, group: `G${i % 4}` })),
      frozenRowCount: 5, heightMode: 'standard', widthMode: 'standard',
      select: { headerSelectMode: 'inline', highlightMode: 'column' }
    });
    table.selectCell(2, 0);
    table.setScrollTop(1000);
    return table;
  },
  async exercise(page) {
    // 在已滚动状态下点击同一列的固定表头。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(2, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__scrollBeforeHeaderClick = window.__visualTable.getScrollTop();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 表头仍被选中且滚动位置保持在原区域。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const range = table.getSelectedCellRanges()[0];
      if (window.__scrollBeforeHeaderClick < 500 || table.getScrollTop() < 500 ||
        !range || range.start.row !== 0 || range.start.col !== 2)
        throw new Error(`滚动后的表头选择异常：${JSON.stringify(range)}`);
    });
  }
};
