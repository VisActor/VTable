/**
 * BugServer case IDs: 67174920f4fe9100b2ce7d33
 * 验证目的：在行序号列纵向拖动可选中连续多行。
 * 改写：原人员记录替换为顺序数字，保留行序号 dragOrder 配置和真实拖动。
 */
export default {
  mount(container) {
    // 充足行数使拖动选择能够覆盖多个完整表体行。
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'label', title: 'Label', width: 180 },
        { field: 'value', title: 'Value', width: 140 }],
      records: Array.from({ length: 8 }, (_, index) => ({
        label: `Item ${index + 1}`, value: index + 1
      })),
      rowSeriesNumber: { title: 'No.', dragOrder: true, width: 60 },
      select: { highlightMode: 'row' }
    });
  },
  async exercise(page) {
    // 从首个行序号拖到第四个行序号，保持鼠标按下跨过两条以上记录。
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      return [1, 4].map(row => {
        const b = table.getCellRect(0, row).bounds;
        return { x: host.x + (b.x1 + b.x2) / 2,
          y: host.y + (b.y1 + b.y2) / 2 };
      });
    });
    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();
    await page.mouse.move(points[1].x, points[1].y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // 拖动后的选择至少跨越两行；像素比较检查序号列高亮。
    await page.evaluate(() => {
      const ranges = window.__visualTable.getSelectedCellRanges();
      if (!ranges.some(range => range.end.row - range.start.row >= 2))
        throw new Error(`行序号拖选未覆盖连续行：${JSON.stringify(ranges)}`);
    });
  }
};
