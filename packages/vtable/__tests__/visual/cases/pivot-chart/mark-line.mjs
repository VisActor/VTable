/**
 * BugServer case IDs: 6614f1552acd9c00d1c98a65
 * 验证目的：透视柱状图同时绘制汇总标记线、百分比端点和起始三角符号。
 * 改写：数值与日期为固定示例，去除无关主题和远程 VChart 加载。
 */
export default {
  mount(container) {
    // 本地 VChart bundle 使标记线与图表进入相同的视觉快照。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      rows: [], columns: [], indicatorsAsCol: false,
      records: [
        { day: '2023-12-25', count: 6 }, { day: '2023-12-26', count: 59 },
        { day: '2023-12-28', count: 29 }, { day: '2023-12-29', count: 82 },
        { day: '2023-12-30', count: 107 }
      ],
      indicators: [{ indicatorKey: 'count', title: 'Count', cellType: 'chart', chartModule: 'vchart',
        style: { padding: 1 }, chartSpec: {
          type: 'common',
          series: [{ id: 'count', type: 'bar', data: { id: 'count' }, xField: 'day', yField: 'count',
            barMinWidth: 1, barMaxWidth: 30, barMinHeight: 1 }],
          axes: [{ orient: 'left', min: 0, seriesId: ['count'] }],
          markLine: [{ y1: 'sum', x: '2023-12-25', y: '10%', x1: '2023-12-30',
            autoRange: true, relativeSeriesIndex: 0,
            startSymbol: { visible: true, style: { symbolType: 'triangleDown', size: 8 } },
            endSymbol: { visible: false },
            line: { style: { stroke: '#000', lineDash: [5], lineWidth: 2 } },
            label: { visible: true, position: 'insideStartTop' } }]
        } }],
      defaultRowHeight: 200, defaultColWidth: 560, defaultHeaderRowHeight: 50,
      widthMode: 'standard', heightMode: 'autoHeight'
    });
  },
  async verify(page) {
    // 柱状图单元格必须实际存在，标记线形状由快照比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 1) throw new Error('标记线图表单元格缺失');
    });
  }
};
