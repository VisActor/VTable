/**
 * BugServer case IDs: 676e6ce88e768100b114c2f0
 * 验证目的：透视表冻结行头超过 maxFrozenWidth 时逐列解冻而非全部解冻。
 * 改写：用三层匿名行维度及固定金额代替来源的大型数据表。
 */
export default {
  mount(container) {
    // 三层行头的总宽超过容器一半，触发冻结宽度裁剪。
    container.style.width = '700px';
    container.style.height = '320px';
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'type', 'item'], columns: ['period'], indicators: ['amount'],
      records: [
        { group: 'A', type: 'X', item: 'X1', period: 'First', amount: 10 },
        { group: 'A', type: 'X', item: 'X2', period: 'Second', amount: 20 },
        { group: 'B', type: 'Y', item: 'Y1', period: 'First', amount: 30 }
      ],
      defaultHeaderColWidth: 170, defaultColWidth: 150,
      frozenColCount: 3, maxFrozenWidth: '40%', unfreezeAllOnExceedsMaxWidth: false,
      widthMode: 'standard'
    });
  },
  async verify(page) {
    // 冻结列必须少于请求的三列且仍保留至少一列。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.frozenColCount < 1 || table.frozenColCount >= 3)
        throw new Error(`冻结宽度未逐列裁剪：${table.frozenColCount}`);
    });
  }
};
