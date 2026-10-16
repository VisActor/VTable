/**
 * BugServer case IDs: 64ba680378943290ce95d080
 * 验证目的：顶部标题、副标题和表格表头布局正确，录制的表头点击可用。
 * 改写：标题和记录换成通用内容，点击点由表头矩形计算。
 */
export default {
  mount(container) {
    // 保留标题顶部方向、内边距与换行副标题。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true,
          fieldFormat: record => `${record.progress}%` },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 50, id: 2, name: 'B' }],
      title: { text: 'Table title', align: 'left', subtext: 'Subtitle line 1\nSubtitle line 2', orient: 'top', padding: 40 },
      widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 按录制动作点击首列表头，但使用当前布局的矩形坐标。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 标题占位和首列内容均应在表格中。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== '100%') throw new Error('标题下表格内容缺失');
      if (!table.internalProps.title?.getComponentGraphic()?.AABBBounds.height() || table.tableY <= 0)
        throw new Error('标题未占顶部空间');
    });
  }
};
