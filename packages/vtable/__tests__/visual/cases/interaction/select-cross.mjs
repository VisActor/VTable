/**
 * BugServer case IDs: 665eb79dfaec2700ad749550
 * 验证目的：cross 选择模式下先点表体、再点表头，各自生成有效选择范围。
 * 改写：将录制坐标替换为单元格矩形定位，并逐步断言两个录制动作。
 */
export default {
  mount(container) {
    // 固定表格数据和 cross 模式，供两个顺序点击使用。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150 },
        { field: 'id', title: 'ID', width: 100 }, { field: 'name', title: 'Name', width: 150 }],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' }],
      select: { highlightMode: 'cross' }, hover: { highlightMode: 'cross', disableHeaderHover: true }
    });
  },
  async exercise(page) {
    // 两次操作分别对应 BugServer 录制的表体和表头点击。
    const clickCell = async (col, row) => {
      const point = await page.evaluate(({ col, row }) => {
        const bounds = window.__visualTable.getCellRect(col, row).bounds;
        const host = document.getElementById('table').getBoundingClientRect();
        return { x: host.x + (bounds.x1 + bounds.x2) / 2, y: host.y + (bounds.y1 + bounds.y2) / 2 };
      }, { col, row });
      await page.mouse.click(point.x, point.y);
    };
    await clickCell(1, 1);
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 1);
    await clickCell(1, 0);
  },
  async verify(page) {
    // 最终选择必须落在表头；表体动作已在 exercise 中单独验证。
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 0);
  }
};
