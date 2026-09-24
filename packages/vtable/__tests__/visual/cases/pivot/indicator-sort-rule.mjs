/**
 * BugServer case IDs: 64ed9123d4858ce3fbd85ad9
 * 验证目的：透视表按指定指标和列维度路径对行维度降序排序，并映射背景色。
 * 改写：销售明细换成固定 A/B/C 数值，保留 sortByIndicator、query 与 mappingRules。
 */
export default {
  mount(container) {
    // 三个城市的 amount 分别为 10、30、20，降序应先 C 再 B 再 A。
    return new window.VTable.PivotTable(container, {
      rows: ['region', 'city'], columns: ['kind', 'variant'], indicators: ['amount', 'count'],
      enableDataAnalysis: true, indicatorsAsCol: false,
      dataConfig: { sortRules: [{ sortField: 'city', sortByIndicator: 'amount',
        sortType: window.VTable.TYPES.SortType.DESC, query: ['X', 'X1'] }],
      mappingRules: [{ bgColor: { indicatorKey: 'amount', mapping: ({ value }) => value >= 20 ? '#ffc0c0' : '#ffffff' } }] },
      records: [{ region: 'R', city: 'A', kind: 'X', variant: 'X1', amount: 10, count: 1 },
        { region: 'R', city: 'C', kind: 'X', variant: 'X1', amount: 30, count: 3 },
        { region: 'R', city: 'B', kind: 'X', variant: 'X1', amount: 20, count: 2 }]
    });
  },
  async verify(page) {
    // 扫描行标题顺序，避免只确认规则被保存却未实际排序。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const labels = Array.from({ length: table.rowCount }, (_, row) => table.getCellValue(1, row));
      const positions = ['C', 'B', 'A'].map(value => labels.indexOf(value));
      if (positions.some(index => index < 0) || !(positions[0] < positions[1] && positions[1] < positions[2]))
        throw new Error(`透视指标排序错误：${labels}`);
    });
  }
};
