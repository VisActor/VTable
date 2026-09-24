/**
 * BugServer case IDs: 6544ad1a4280163c75d7fa98
 * 验证目的：列级 disableSelect 与 disableHeaderSelect 分别阻止表体和表头选择。
 * 改写：将录制坐标换成固定单元格矩形，记录改为公开数据。
 */
export default {
  mount(container) {
    // 保留来源的选择与列级配置，使用同一组固定数据。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true, disableSelect: true },
        { field: 'id', title: 'ID', width: 100, disableHeaderSelect: true },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' }, { progress: 1, id: 3, name: 'C' }],
      widthMode: 'standard',
      theme: { selectionStyle: { cellBgColor: 'rgba(130, 178, 245, 0.2)', cellBorderLineWidth: 2, cellBorderColor: '#0000ff' } },
      hover: { highlightMode: 'cross', disableHeaderHover: true },
      select: {  }
    });
  },
  async exercise(page) {
    // 重放来源的表体和表头点击，并逐步核对选择结果。
    const click = async (col, row) => {
      const point = await page.evaluate(({ col, row }) => {
        const b = window.__visualTable.getCellRect(col, row).bounds;
        const host = document.getElementById('table').getBoundingClientRect();
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      }, { col, row });
      await page.mouse.click(point.x, point.y);
    };
    await click(0, 1);
    await page.waitForTimeout(100);
    if (await page.evaluate(() => window.__visualTable.getSelectedCellRanges().length))
      throw new Error('禁选表体列仍被选中');
    await click(1, 0);
    await page.waitForTimeout(100);
  },
  async verify(page) {
    // 最终语义状态与截图中的选择外观应对应。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getSelectedCellRanges().length) throw new Error('禁选表头仍被选中');
      if (table.getCellOriginValue(1, 1) !== 1) throw new Error('测试数据缺失');
    });
  }
};
