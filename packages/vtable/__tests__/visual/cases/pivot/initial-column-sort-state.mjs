/**
 * BugServer case IDs: 64bdfdee5134109a76ccddd5
 * 验证目的：透视列树指定分支的初始 pivotSortState 与自动填宽共同绘制。
 * 改写：保留非角头两级列路径、降序状态及 autoFillWidth，使用固定通用维度与记录。
 */
export default {
  mount(container) {
    // 两级列树包含排序目标 Second 分支，并由固定记录提供可见指标值。
    return new window.VTable.PivotTable(container, {
      rows: [{ dimensionKey: 'category', title: 'Category' }],
      columns: [{ dimensionKey: 'region', title: 'Region' },
        { dimensionKey: 'method', title: 'Method', showSort: true }],
      indicators: [{ indicatorKey: 'amount', title: 'Amount', showSort: true }],
      columnTree: [{ dimensionKey: 'region', value: 'North', children: [
        { dimensionKey: 'method', value: 'First', children: [{ indicatorKey: 'amount' }] },
        { dimensionKey: 'method', value: 'Second', children: [{ indicatorKey: 'amount' }] }
      ] }],
      records: [
        { category: 'A', region: 'North', method: 'First', amount: 10 },
        { category: 'A', region: 'North', method: 'Second', amount: 20 },
        { category: 'B', region: 'North', method: 'First', amount: 30 },
        { category: 'B', region: 'North', method: 'Second', amount: 40 }
      ],
      pivotSortState: [{ dimensions: [
        { dimensionKey: 'region', value: 'North', isPivotCorner: false },
        { dimensionKey: 'method', value: 'Second', isPivotCorner: false }
      ], order: 'desc' }],
      enableDataAnalysis: true, autoFillWidth: true, widthMode: 'standard',
      defaultHeaderRowHeight: 40, defaultHeaderColWidth: 90
    });
  },
  async verify(page) {
    // 初始排序路径、列树和数据值都应被透视表接受。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const state = table.pivotSortState?.[0];
      if (state?.order !== 'desc' || state.dimensions?.[1]?.value !== 'Second' || table.colCount < 3)
        throw new Error(`初始透视排序状态缺失：${JSON.stringify(table.pivotSortState)}`);
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellOriginValue(col, row));
      if (!values.includes(20) || !values.includes(40)) throw new Error('列树排序目标的指标数据缺失');
    });
  }
};
