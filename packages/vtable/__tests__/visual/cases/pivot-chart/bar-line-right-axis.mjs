/**
 * BugServer case IDs: 65a8a7d436599cd39121a863, 67287bffe4bb4400b299cba7, 692904557eb69c005d1e0a18
 * 验证目的：百分比柱宽与按 seriesId 分配的左右轴可在柱线透视图中绘制。
 * 改写：两个指标分成固定数据流，保留柱宽字符串、seriesId 数组和右轴。
 */
export default {
  mount(container) {
    // 每个指标拥有独立数据流，避免一侧轴吞掉另一侧的图元。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      rows: [], columns: [], indicatorsAsCol: false,
      records: [
        { period: 'A', amount: 10 }, { period: 'B', amount: 18 },
        { period: 'C', amount: 13 }, { period: 'A', rate: 0.2 },
        { period: 'B', rate: 0.6 }, { period: 'C', rate: 0.4 }
      ],
      indicators: [
        { indicatorKey: 'amount', title: 'Amount', cellType: 'chart', chartModule: 'vchart',
          chartSpec: { type: 'common',
            series: [{ id: 'amount', type: 'bar', data: { id: 'amount' },
              xField: 'period', yField: 'amount', barWidth: '100%' }],
            axes: [{ orient: 'left', seriesId: ['amount'], min: 0 }] } },
        { indicatorKey: 'rate', title: 'Rate', cellType: 'chart', chartModule: 'vchart',
          chartSpec: { type: 'common',
            series: [{ id: 'rate', type: 'line', data: { id: 'rate' },
              xField: 'period', yField: 'rate', point: { visible: true } }],
            axes: [{ orient: 'right', seriesId: ['rate'], min: 0, max: 1 }] } }
      ],
      defaultRowHeight: 180, defaultColWidth: 560,
      widthMode: 'autoWidth', heightMode: 'autoHeight'
    });
  },
  async verify(page) {
    // 两种图元都要占据可见图表单元格，避免只比较空轴。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts !== 2) throw new Error(`双轴图表单元格数量错误：${charts}`);
    });
  }
};
