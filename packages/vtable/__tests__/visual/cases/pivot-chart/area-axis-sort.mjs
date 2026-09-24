/**
 * BugServer case IDs: 6541cdd044dadd6b7cb441cd
 * 验证目的：PivotChart 面积图启用 sortDataByAxis 并绘制两组输入点。
 * 改写：把来源的大型透视数据缩成匿名的三期两组记录。
 */
export default {
  mount(container) {
    // sortDataByAxis 保留来源的面积图轴排序配置。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    return new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['bucket'], indicatorsAsCol: false,
      indicators: [{ indicatorKey: 'value', title: 'Area', cellType: 'chart', chartModule: 'vchart',
        chartSpec: { type: 'area', data: { id: 'data' }, xField: 'period', yField: 'value',
          seriesField: 'series', sortDataByAxis: true, animation: false } }],
      records: [
        { group: 'G', bucket: 'One', period: 'P3', series: 'A', value: 7 },
        { group: 'G', bucket: 'One', period: 'P1', series: 'A', value: 3 },
        { group: 'G', bucket: 'One', period: 'P2', series: 'A', value: 5 },
        { group: 'G', bucket: 'One', period: 'P2', series: 'B', value: 4 },
        { group: 'G', bucket: 'One', period: 'P3', series: 'B', value: 6 },
        { group: 'G', bucket: 'One', period: 'P1', series: 'B', value: 2 }
      ],
      defaultRowHeight: 270, defaultHeaderRowHeight: 40,
      defaultColWidth: 550, defaultHeaderColWidth: 80, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 确认实际建立面积图单元格，具体区域形状由视觉快照比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 1) throw new Error('面积图单元格缺失');
    });
  }
};
