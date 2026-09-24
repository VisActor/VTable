/**
 * BugServer case IDs: 65d572a597cc3d008de5b5a4
 * 验证目的：PivotTable 图表指标使用回调生成面积图，并绘制固定阈值标记线。
 * 改写：将来源的气温表缩为两组固定数值，去除远程图表加载。
 */
export default {
  mount(container) {
    // 图表数据由记录的 trend 数组提供，markLine 在每个透视单元格内绘制。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    window.__pivotChartSpecCalls = 0;
    return new window.VTable.PivotTable(container, {
      rowTree: [{ dimensionKey: 'group', value: 'A' }, { dimensionKey: 'group', value: 'B' }],
      columnTree: [{ indicatorKey: 'trend', value: 'Trend' }],
      indicators: [{ indicatorKey: 'trend', title: 'Trend', cellType: 'chart', chartModule: 'vchart',
        chartSpec: () => {
          window.__pivotChartSpecCalls++;
          return { type: 'area', data: { id: 'data' }, xField: 'period', yField: 'value',
            animation: false, markLine: [{ y: 5,
              line: { style: { stroke: '#222', lineDash: [5, 5], lineWidth: 2 } } }] };
        } }],
      records: [
        { group: 'A', trend: [{ period: 'P1', value: 2 }, { period: 'P2', value: 7 }, { period: 'P3', value: 4 }] },
        { group: 'B', trend: [{ period: 'P1', value: 3 }, { period: 'P2', value: 6 }, { period: 'P3', value: 8 }] }
      ],
      defaultRowHeight: 190, defaultColWidth: 530, defaultHeaderColWidth: 80
    });
  },
  async verify(page) {
    // 运行时须进入图表配置回调并建立两个图表单元格。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts !== 2 || window.__pivotChartSpecCalls < 2)
        throw new Error('PivotTable 图表回调或标记线单元格缺失');
    });
  }
};
