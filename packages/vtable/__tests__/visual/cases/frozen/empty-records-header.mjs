/**
 * BugServer case IDs: 6a82f7a71d0efd005e397e9d
 * 验证目的：大量列横向滚到末端后，点击触发 setRecords([]) 不应清空冻结表头。
 * 改写：保留 311 列和双侧冻结边界，商品字段替换成编号与通用数值。
 */
export default {
  mount(container) {
    // 311 列保留来源的横向虚拟化压力，六条匿名记录足以触发空记录更新。
    container.style.width = '900px';
    container.style.height = '420px';
    const columns = Array.from({ length: 311 }, (_, col) => ({
      field: 'c' + col, title: 'Field ' + col, width: col < 11 ? 'auto' : 120
    }));
    const records = Array.from({ length: 6 }, (_, row) =>
      Object.fromEntries(columns.map((column, col) => [column.field, row * 1000 + col])));
    const table = new window.VTable.ListTable(container, {
      columns, records, frozenRowCount: 3, bottomFrozenRowCount: 1,
      frozenColCount: 2, rightFrozenColCount: 2, widthMode: 'standard',
      rowSeriesNumber: { width: 50, format: () => '', cellType: 'checkbox', headerType: 'checkbox' }
    });
    let triggered = false;
    table.on('click_cell', () => {
      // 保留来源的点击触发路径，只执行一次空记录更新。
      if (triggered) return;
      triggered = true;
      table.setScrollLeft(100000);
      table.setRecords([]);
    });
    return table;
  },
  async exercise(page) {
    // 先远距离横向滚动，再点击左冻结表体格触发 setRecords([])。
    await page.evaluate(() => window.__visualTable.setScrollLeft(100000));
    await page.waitForFunction(() => window.__visualTable.scrollLeft > 0);
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(1, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => window.__visualTable.records.length === 0);
  },
  async verify(page) {
    // 空记录更新后左右两侧表头仍有字段，截图检查中间表头绘制。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const left = table.getCellValue(1, 0);
      const right = table.getCellValue(table.colCount - 1, 0);
      if (table.records.length !== 0 || !left || !right || table.colCount < 300)
        throw new Error('空记录更新后冻结表头丢失');
    });
  }
};
