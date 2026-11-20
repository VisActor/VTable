/**
 * BugServer case IDs: 68cba1911ef44500a8bec33f
 * 验证目的：透视直方图的多个系列存在重叠区间时，区间端点与指标仍被绘制。
 * 改写：来源的大量重复区间缩减到跨城市、跨类别的代表组合，并缩小标题尺寸让柱体进入截图。
 */
export default {
  mount(container) {
    // 保留 0-100 与 50-150 的重叠，以及同区间不同系列。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      columns: ['category'], rows: ['city'],
      indicators: [{ indicatorKey: 'profit', title: 'Value', cellType: 'chart', chartModule: 'vchart',
        headerStyle: { color: 'red', borderLineWidth: [1, 0, 1, 0], autoWrapText: true },
        style: { padding: 1 }, chartSpec: { type: 'histogram', xField: 'from', x2Field: 'to',
          yField: 'profit', seriesField: 'type', data: { id: 'data1' },
          bar: { style: { stroke: 'white', lineWidth: 1 } } } }],
      records: [{ from: 0, to: 100, profit: 300, type: 'A', city: 'North', category: 'Device' },
        { from: 0, to: 100, profit: 100, type: 'B', city: 'North', category: 'Device' },
        { from: 50, to: 150, profit: 30, type: 'B', city: 'North', category: 'Device' },
        { from: 120, to: 130, profit: 150, type: 'D', city: 'North', category: 'Device' },
        { from: 10, to: 16, profit: 3, type: 'B', city: 'South', category: 'Office' },
        { from: 16, to: 18, profit: 15, type: 'C', city: 'South', category: 'Office' }],
      indicatorsAsCol: false, defaultRowHeight: 200, defaultColWidth: 280,
      defaultHeaderRowHeight: 40, defaultHeaderColWidth: 80
    });
  },
  async verify(page) {
    // 两个透视分组都必须生成图表格。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 2) throw new Error('重叠区间直方图缺失');
    });
  }
};
