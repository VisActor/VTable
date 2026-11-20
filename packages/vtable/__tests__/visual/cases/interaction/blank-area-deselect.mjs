/**
 * BugServer case IDs: 667012bf71989000cfc6dc4d, 6670130571989000cfc6dc4f
 * 验证目的：空白区点击是否清除选择，由 blankAreaClickDeselect 的真假控制。
 * 改写：使用固定匿名记录，分别在配置更新前后验证选择状态。
 */
export default {
  mount(container) {
    // 短表在 400px 容器中留下可点击的空白区域。
    container.style.height = '400px';
    const records = [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }];
    const columns = [{ field: 'id', title: 'ID', width: 120 },
      { field: 'name', title: 'Name', width: 180 }];
    window.__blankOptions = { records, columns };
    return new window.VTable.ListTable(container, {
      records, columns, select: { blankAreaClickDeselect: true }, widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 先验证默认清除行为，再将配置改为 false 并重复点击。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(1, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { cell: { x: host.x + (b.x1 + b.x2) / 2,
        y: host.y + (b.y1 + b.y2) / 2 },
      blank: { x: host.x + 220, y: host.y + 300 } };
    });
    await page.mouse.click(point.cell.x, point.cell.y);
    await page.mouse.click(point.blank.x, point.blank.y);
    await page.evaluate(() => {
      if (window.__visualTable.getSelectedCellRanges().length)
        throw new Error('blankAreaClickDeselect=true 未清除选择');
      window.__visualTable.updateOption({ ...window.__blankOptions,
        select: { blankAreaClickDeselect: false }, widthMode: 'standard' });
    });
    await page.mouse.click(point.cell.x, point.cell.y);
    await page.mouse.click(point.blank.x, point.blank.y);
  },
  async verify(page) {
    // false 时点击表格空白处仍保留最后选择的单元格。
    await page.evaluate(() => {
      const ranges = window.__visualTable.getSelectedCellRanges();
      if (ranges.length !== 1 || ranges[0].start.col !== 1 || ranges[0].start.row !== 1)
        throw new Error(`空白区错误清除了选择：${JSON.stringify(ranges)}`);
    });
  }
};
