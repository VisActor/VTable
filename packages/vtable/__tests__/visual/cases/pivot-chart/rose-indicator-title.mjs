/**
 * BugServer case IDs: 695347df862ee80066b9cc60
 * 验证目的：PivotChart 玫瑰图显示指标标题和两组扇形数据。
 * 改写：保留 rose、角度及系列字段，删除来源的大型指标数据。
 */
export default {
  mount(container) {
    // 使用本地 VChart 绘制 rose，避免来源的远程依赖和动画波动。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    return new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['period'], indicatorsAsCol: false, hideIndicatorName: false,
      indicators: [{ indicatorKey: 'value', title: 'Amount', cellType: 'chart', chartModule: 'vchart',
        chartSpec: { type: 'rose', data: { id: 'data' }, categoryField: 'category',
          valueField: 'value', seriesField: 'series', outerRadius: 0.82,
          innerRadius: 0, animation: false } }],
      records: [
        { group: 'G', period: 'P', category: 'A', series: 'One', value: 7 },
        { group: 'G', period: 'P', category: 'B', series: 'One', value: 11 },
        { group: 'G', period: 'P', category: 'C', series: 'One', value: 5 },
        { group: 'G', period: 'P', category: 'A', series: 'Two', value: 4 },
        { group: 'G', period: 'P', category: 'B', series: 'Two', value: 8 },
        { group: 'G', period: 'P', category: 'C', series: 'Two', value: 10 }
      ],
      defaultRowHeight: 300, defaultHeaderRowHeight: 40,
      defaultColWidth: 480, defaultHeaderColWidth: 130, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 指标标题与 rose 图表单元格必须进入实际布局。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 1 || table.colCount < 1 || table.rowCount < 2)
        throw new Error('玫瑰图或指标标题未建立');
    });
  }
};
