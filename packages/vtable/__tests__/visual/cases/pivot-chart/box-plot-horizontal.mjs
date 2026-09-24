/**
 * BugServer case IDs: 690325fb1ef44500a8bec374
 * 验证目的：箱线图水平布局在两级列维度中绘制有无离群点的数据。
 * 改写：缩减重复分组记录，保留六个分位数字段、水平轴和两级列维度。
 */
export default {
  mount(container) {
    // 图表模块从本地 bundle 注册，箱线图方向为 horizontal。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      columns: [{ dimensionKey: 'country', title: 'Country' }, { dimensionKey: 'region', title: 'Region' }],
      rows: [{ dimensionKey: 'category', title: 'Category' }],
      indicators: [{ indicatorKey: 'max', title: 'Distribution', cellType: 'chart', chartModule: 'vchart',
        style: { padding: 1 }, chartSpec: { type: 'boxPlot', data: { id: 'dataId' },
          yField: 'item', minField: 'min', q1Field: 'q1', medianField: 'median',
          q3Field: 'q3', maxField: 'max', outliersField: 'outliers', direction: 'horizontal',
          boxPlot: { style: { shaftShape: 'line', lineWidth: 2 } } } }],
      records: [{ country: 'A', region: 'South', category: 'Device', item: 'Type 1',
        min: 4.72, q1: 9.73, median: 10.17, q3: 10.51, max: 11.64, outliers: [12.01, 12.02, 14.03] },
      { country: 'A', region: 'North', category: 'Device', item: 'Type 1',
        min: 9.4, q1: 10.06, median: 10.75, q3: 11.56, max: 12.5 },
      { country: 'B', region: 'East', category: 'Device', item: 'Type 2',
        min: 8.74, q1: 9.46, median: 10.35, q3: 10.94, max: 12.21 }],
      indicatorsAsCol: true, defaultRowHeight: 200, defaultHeaderRowHeight: 30,
      defaultColWidth: 280, defaultHeaderColWidth: [80, 'auto', 'auto'],
      corner: { titleOnDimension: 'row', headerStyle: { autoWrapText: true, padding: 0 } }
    });
  },
  async verify(page) {
    // 水平箱线图至少占据两个分组单元格。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 2) throw new Error('水平箱线图单元格缺失');
    });
  }
};
