/**
 * BugServer case IDs: 65d45c7a97cc3d008de5b576
 * 验证目的：鼠标离开单元格回调中更新列结构后表格继续正常绘制。
 * 改写：使用匿名记录，保留 mouseleave_cell 中 updateColumns 的调用时机。
 */
export default {
  mount(container) {
    // 多行记录提供真实的单元格离开事件；回调只运行一次。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 110 },
        { field: 'name', title: 'Name', width: 180 }, { field: 'value', title: 'Value', width: 130 }],
      records: [{ id: 1, name: 'A', value: 10 }, { id: 2, name: 'B', value: 20 },
        { id: 3, name: 'C', value: 30 }]
    });
    window.__mouseleaveUpdates = 0;
    table.on('mouseleave_cell', () => {
      // 事件回调里重建列是本例要验证的路径。
      if (window.__mouseleaveUpdates++) return;
      table.updateColumns([{ field: 'name', title: 'Name', width: 180 }]);
    });
    return table;
  },
  async exercise(page) {
    // 从首个数据格移出到表格外侧，触发真实 mouseleave_cell。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(0, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.move(850, 550);
    await page.waitForFunction(() => window.__mouseleaveUpdates > 0);
  },
  async verify(page) {
    // 更新后只保留 Name 列，原始记录仍可渲染。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (window.__mouseleaveUpdates < 1 || table.colCount !== 1 || table.getCellValue(0, 1) !== 'A')
        throw new Error('鼠标离开后列更新失败');
    });
  }
};
