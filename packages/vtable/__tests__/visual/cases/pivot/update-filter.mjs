/**
 * BugServer case IDs: 66da9cdd0846a700faef5def
 * 验证目的：透视表初始化过滤规则后由 updateFilterRules 替换条件并重新聚合。
 * 改写：记录换成固定交叉分组，保留先过滤一组再改为另一组的顺序。
 */
export default {
  mount(container) {
    // 最终规则剔除 R1/A，允许 R2/A 重新进入汇总。
    const table = new window.VTable.PivotTable(container, {
      rows: ['region', 'item'], columns: ['kind', 'variant'], indicators: ['amount', 'count'],
      enableDataAnalysis: true, indicatorsAsCol: true,
      dataConfig: { filterRules: [{ filterFunc: record => !(record.region === 'R2' && record.kind === 'A') }],
        totals: { row: { subTotalsDimensions: ['region'] } } },
      records: [{ region: 'R1', item: 'I1', kind: 'A', variant: 'A1', amount: 10, count: 1 },
        { region: 'R1', item: 'I2', kind: 'B', variant: 'B1', amount: 20, count: 2 },
        { region: 'R2', item: 'I1', kind: 'A', variant: 'A1', amount: 30, count: 3 },
        { region: 'R2', item: 'I2', kind: 'B', variant: 'B1', amount: 40, count: 4 }]
    });
    table.updateFilterRules([{ filterFunc: record => !(record.region === 'R1' && record.kind === 'A') }]);
    return table;
  },
  async verify(page) {
    // 更新后的透视值应包含 R2/A 的 30，且排除 R1/A 的 10。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellOriginValue(col, row));
      if (!values.includes(30) || values.includes(10)) throw new Error('透视过滤规则未替换');
    });
  }
};
