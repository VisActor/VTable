/**
 * BugServer case IDs: 653102ad8632117ed798a270
 * 验证目的：headerSelectMode 为 cell 时，点击表头只选中该表头格。
 * 改写：将录制坐标换成固定单元格矩形，记录改为公开数据。
 */
export default {
  mount(container) {
    // 保留来源的选择与列级配置，使用同一组固定数据。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100 },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' }, { progress: 1, id: 3, name: 'C' }],
      widthMode: 'standard',
      theme: { selectionStyle: { cellBgColor: 'rgba(130, 178, 245, 0.2)', cellBorderLineWidth: 2, cellBorderColor: '#0000ff' } },
      hover: { highlightMode: 'cross', disableHeaderHover: true },
      select: { headerSelectMode: 'cell' }
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
    await click(2, 0);
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.col === 2);
  },
  async verify(page) {
    // 最终语义状态与截图中的选择外观应对应。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const range = table.getSelectedCellRanges()[0];
      if (!range || range.start.col !== 2 || range.end.col !== 2 || range.start.row !== 0 || range.end.row !== 0)
        throw new Error('表头未保持单格选择');
    });
  }
};
