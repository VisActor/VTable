/**
 * BugServer case IDs: 66bf0a981140a800e454d5dd
 * 验证目的：两个指标各自组合历史柱、趋势线和预测柱，且尺度独立。
 * 改写：匿名化指标与数值，保留三条 series 对应的数据流及年份关系。
 */
export default {
  mount(container) {
    // 每个指标使用独立的 common 图表配置，同时包含三种时间段的数据流。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    // 生成第二指标时只替换数据字段，图表组合结构保持一致。
    const indicator = (key, title) => ({ indicatorKey: key, title, cellType: 'chart',
      chartModule: 'vchart', style: { padding: 1 }, chartSpec: {
        type: 'common', series: [
          { id: key, type: 'bar', data: { id: key }, xField: 'year', yField: key,
            barMinWidth: 1, barMaxWidth: 30 },
          { id: `trend_${key}`, type: 'line', data: { id: `trend_${key}` },
            xField: 'year', yField: `trend_${key}`, point: { visible: false },
            line: { style: { stroke: '#999', lineDash: [5], lineWidth: 2 } } },
          { id: `forecast_${key}`, type: 'bar', data: { id: `forecast_${key}` },
            xField: 'year', yField: `forecast_${key}`,
            bar: { style: { fill: '#36a269' } } }
        ], axes: [{ orient: 'left', min: 0,
          seriesId: [key, `trend_${key}`, `forecast_${key}`] }]
      } });
    const records = [];
    // 固定的历史与预测数据使两个数量级都可稳定比较。
    for (let i = 0; i < 4; i++) {
      const year = String(2020 + i);
      records.push({ year, quantity: 60 + i * 15 }, { year, trend_quantity: 65 + i * 15 },
        { year, amount: 3600 + i * 800 }, { year, trend_amount: 3800 + i * 750 });
    }
    for (let i = 0; i < 3; i++) {
      const year = String(2024 + i);
      records.push({ year, forecast_quantity: 115 + i * 5 },
        { year, forecast_amount: 5800 + i * 250 });
    }
    return new window.VTable.PivotChart(container, {
      rows: [], columns: [], indicatorsAsCol: false, records,
      indicators: [indicator('quantity', 'Quantity'), indicator('amount', 'Amount')],
      defaultRowHeight: 200, defaultColWidth: 400, defaultHeaderRowHeight: 50
    });
  },
  async verify(page) {
    // 两个独立 chart 单元格都需要进入布局，避免只渲染单个指标。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 2) throw new Error('组合图指标未完整绘制');
    });
  }
};
