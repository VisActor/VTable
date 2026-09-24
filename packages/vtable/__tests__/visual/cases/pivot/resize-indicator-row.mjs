/**
 * BugServer case IDs: 662e204dd4511700f6885624
 * 验证目的：指标放在行上的透视表可拖动行头边界调整指标行高。
 * 改写：维度和数值换成固定匿名示例，保留 indicatorsAsCol=false 与拖拽。
 */
export default {
  mount(container) {
    // 两个指标在每个行维度下形成可调整的指标行。
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'], columns: ['region'],
      indicators: ['amount', 'count'], indicatorsAsCol: false,
      records: [
        { group: 'A', item: 'A1', region: 'East', amount: 10, count: 1 },
        { group: 'A', item: 'A2', region: 'West', amount: 20, count: 2 },
        { group: 'B', item: 'B1', region: 'East', amount: 30, count: 3 }
      ], defaultRowHeight: 32, widthMode: 'standard', resize: { rowResizeMode: 'all' }
    });
  },
  async exercise(page) {
    // 在首个指标行的左侧行头边界向下拖动。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const row = table.columnHeaderLevelCount;
      const b = table.getCellRect(table.rowHeaderLevelCount - 1, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__pivotResizeRow = row;
      window.__pivotResizeCol = table.rowHeaderLevelCount - 1;
      window.__pivotHeightBefore = b.y2 - b.y1;
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + b.y2 + 1 };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x, point.y + 30, { steps: 10 });
    await page.mouse.up();
  },
  async verify(page) {
    // 指标行相对矩形应比初始配置高至少 15px。
    await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(window.__pivotResizeCol, window.__pivotResizeRow).bounds;
      if (b.y2 - b.y1 < window.__pivotHeightBefore + 15)
        throw new Error('透视指标行高未调整');
    });
  }
};
