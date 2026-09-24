/**
 * BugServer case IDs: 65af6e6906085f008cf8f85f
 * 验证目的：点击选中单元格的回调内调用 updateColumns 后，选中状态与内容仍有效。
 * 改写：匿名固定记录保留点击触发更新的时机，用新标题使更新可观察。
 */
export default {
  mount(container) {
    // 一次点击触发一次相同结构列的重新配置。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150 },
        { field: 'id', title: 'ID', width: 110 }, { field: 'name', title: 'Name', width: 150 }],
      records: [{ progress: 20, id: 1, name: 'A' }, { progress: 40, id: 2, name: 'B' }]
    });
    window.__selectedColumnUpdates = 0;
    table.on('click_cell', () => {
      // 在点击事件同步调用 updateColumns，保留来源的重入路径。
      if (window.__selectedColumnUpdates++) return;
      table.updateColumns([{ field: 'progress', title: 'Progress', width: 150 },
        { field: 'id', title: 'ID', width: 110 }, { field: 'name', title: 'Name updated', width: 150 }]);
    });
    return table;
  },
  async exercise(page) {
    // 实际点击第二列数据格，不通过 selectCell API 注入选中状态。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(1, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => window.__selectedColumnUpdates > 0);
  },
  async verify(page) {
    // 点击时列结构重建完成，选中范围与新增标题同时保持。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const range = table.getSelectedCellRanges()[0];
      if (window.__selectedColumnUpdates < 1 || table.colCount !== 3 ||
        table.getCellValue(2, 0) !== 'Name updated' || !range || range.start.col !== 1)
        throw new Error(`点击更新后的选择状态异常：${JSON.stringify(range)}`);
    });
  }
};
