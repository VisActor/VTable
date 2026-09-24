/**
 * BugServer case IDs: 662e20c6d4511700f6885626
 * 验证目的：indicatorGroup 拖动一个指标行边界时按比例调整同组的两个指标行。
 * 改写：来源的地区商品数据改为三个匿名行维度组合。
 */
export default {
  mount(container) {
    // 每个条目有金额和数量两个指标行，拖动组边界应影响两行。
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'], columns: ['period'],
      indicators: ['amount', 'count'], indicatorsAsCol: false,
      records: [
        { group: 'A', item: 'A1', period: 'First', amount: 10, count: 1 },
        { group: 'A', item: 'A2', period: 'First', amount: 20, count: 2 },
        { group: 'B', item: 'B1', period: 'Second', amount: 30, count: 3 }
      ],
      defaultRowHeight: 32, resize: { rowResizeMode: 'all', rowResizeType: 'indicatorGroup' }
    });
  },
  async exercise(page) {
    // 在第一个条目的指标行下边界拖动，并记录同组两行原始高度。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const row = table.columnHeaderLevelCount;
      const b = table.getCellRect(table.rowHeaderLevelCount - 1, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__indicatorGroupStartRow = row;
      window.__indicatorGroupBefore = [table.getRowHeight(row), table.getRowHeight(row + 1)];
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + b.y2 + 1 };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x, point.y + 36, { steps: 10 });
    await page.mouse.up();
  },
  async verify(page) {
    // 同一指标组的两行都应增高，区别于单行调整。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const row = window.__indicatorGroupStartRow;
      const heights = [table.getRowHeight(row), table.getRowHeight(row + 1)];
      if (heights.some((height, index) => height < window.__indicatorGroupBefore[index] + 5))
        throw new Error(`指标组行高未同时改变：${JSON.stringify(heights)}`);
    });
  }
};
