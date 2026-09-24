/**
 * BugServer case IDs: 665eb726faec2700ad74954d
 * 验证目的：验证 column 选择高亮在表体和表头点击后的状态与截图。
 * 改写：使用固定匿名记录，按单元格矩形重放来源的点击顺序。
 */
export default {
  mount(container) {
    // 构建该来源独有的选择配置与通用数据。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150 },
        { field: 'id', title: 'ID', width: 100 },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 10, id: 1, name: 'A' }, { progress: 20, id: 2, name: 'B' }, { progress: 30, id: 3, name: 'C' }],
      select: { highlightMode: 'column' },
      hover: { highlightMode: 'cross', disableHeaderHover: true }
    });
  },
  async exercise(page) {
    // 重放来源的两次点击，先确认首个动作确实改变了选择，再保留最终状态截图。
    const click = async (col, row) => {
      const point = await page.evaluate(({ col, row }) => {
        const b = window.__visualTable.getCellRect(col, row).bounds;
        const host = document.getElementById('table').getBoundingClientRect();
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      }, { col, row });
      await page.mouse.click(point.x, point.y);
    };
    await click(1, 2);
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 2);
    await click(1, 0);
  },
  async verify(page) {
    // 选择范围与高亮模式必须对应最终点击；截图检查主题和扩展着色。
    await page.evaluate(({ expectedScope, expectedRow, headerCell }) => {
      const table = window.__visualTable;
      const selected = table.getSelectedCellRanges()[0];
      if (table.stateManager.select.highlightScope !== expectedScope || !selected || selected.start.row !== expectedRow)
        throw new Error('选择模式或最终位置错误');
      if (headerCell && expectedRow === 0 && (selected.start.col !== 1 || selected.end.col !== 1 || selected.end.row !== 0))
        throw new Error('表头没有保持单格选择');
    }, { expectedScope: 'column', expectedRow: 0, headerCell: false });
  }
};
