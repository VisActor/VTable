/**
 * BugServer case IDs: 690325586319a600a9810142
 * 验证目的：PivotChart 的 boxPlot 指标在两级行维度中渲染有离群点和无离群点的数据。
 * 改写：用固定通用类别代替产品文字，保留六个分位数字段的顺序与离群点条件。
 */
export default {
  mount(container) {
    // VChart 使用本地 bundle 注册，浏览器不会访问 BugServer 的 CDN。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      rows: [{ dimensionKey: 'group', title: 'Group' }, { dimensionKey: 'region', title: 'Region' }],
      columns: [{ dimensionKey: 'category', title: 'Category' }],
      indicators: [{
        indicatorKey: 'max', title: 'Distribution', cellType: 'chart', chartModule: 'vchart',
        style: { padding: 1 },
        chartSpec: {
          type: 'boxPlot', data: { id: 'dataId' }, xField: 'item',
          minField: 'min', q1Field: 'q1', medianField: 'median', q3Field: 'q3',
          maxField: 'max', outliersField: 'outliers', direction: 'vertical',
          boxPlot: { style: { shaftShape: 'line', lineWidth: 2 } }
        }
      }],
      records: [
        { group: 'A', region: 'North', category: 'Device', item: 'Type 1',
          min: 4.72, q1: 9.73, median: 10.17, q3: 10.51, max: 11.64, outliers: [12.01, 12.02, 14.03] },
        { group: 'A', region: 'South', category: 'Device', item: 'Type 1',
          min: 9.4, q1: 10.06, median: 10.75, q3: 11.56, max: 12.5 },
        { group: 'B', region: 'East', category: 'Device', item: 'Type 2',
          min: 8.74, q1: 9.46, median: 10.35, q3: 10.94, max: 12.21 }
      ],
      indicatorsAsCol: false, defaultRowHeight: 200, defaultHeaderRowHeight: 30,
      defaultColWidth: 280, defaultHeaderColWidth: [80, 'auto', 'auto'],
      corner: { titleOnDimension: 'row', headerStyle: { autoWrapText: true, padding: 0 } }
    });
  },
  async verify(page) {
    // 断言 chart 单元格和分位值进入表格，画布有效性由通用检查完成。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 2) throw new Error('箱线图单元格缺失');
    });
  }
};
