/**
 * BugServer case IDs: 69290d62e84559005d355243
 * 验证目的：透视直方图按指定 ordinal 颜色域绘制含零值的多个区间。
 * 改写：用固定通用形状与区间数值代替来源数据，增加固定行维度保证图表可见，保留 bin 起止字段和颜色配置。
 */
export default {
  mount(container) {
    // 两种形状分别落在独立图表单元格内，零值区间检验空柱绘制。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    const records = [];
    // 每种形状都有相同 bin 边界，但各自数据量不同。
    for (const [shape, values] of [['Circle', [6, 2, 0, 4]], ['Square', [3, 0, 5, 1]]])
      values.forEach((value, index) => records.push({ group: 'All', shape, from: index + 1,
        to: index + 2, value }));
    return new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['shape'],
      indicators: [{ indicatorKey: 'value', title: 'Value', cellType: 'chart', chartModule: 'vchart',
        chartSpec: { type: 'histogram', xField: 'from', x2Field: 'to',
          yField: 'value', seriesField: 'shape', data: { id: 'data1' }, barGap: 2,
          color: { type: 'ordinal', domain: ['Circle', 'Square'], range: ['red', 'blue'] },
          legends: { visible: false } }, style: { padding: [1, 1, 0, 1] } }],
      records, indicatorsAsCol: false, defaultRowHeight: 230, defaultColWidth: 290,
      defaultHeaderRowHeight: 40, defaultHeaderColWidth: 80
    });
  },
  async verify(page) {
    // 两组 bin 数据都需要成为 chart 单元格，颜色和空柱由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      const rect = table.getCellRect(2, 1).bounds;
      if (charts < 2 || rect.x2 > 800 || rect.y2 > 400)
        throw new Error(`直方图单元格未完整进入视口：${JSON.stringify(rect)}`);
    });
  }
};
