/**
 * BugServer case IDs: 6690fbcd49841700ac76649e
 * 验证目的：同一透视图中 bar 和 scatter 指标各自绑定 seriesId 轴。
 * 改写：类别改为通用文字，保留两个不同量级数据流、左右轴配置与自动尺寸。
 */
export default {
  mount(container) {
    // 分开两个记录流，确保 bar 与 scatter 不会错误共享数值轴。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    const chart = (key, type) => ({ indicatorKey: key, title: key, cellType: 'chart', chartModule: 'vchart',
      chartSpec: { type: 'common', series: [{ id: key, type, data: { id: key },
        xField: 'group', yField: key, ...(type === 'scatter' ? { point: { style: { size: 8 } } } : {}) }],
        axes: [{ orient: 'left', min: 0, seriesId: [key] },
          { orient: 'right', visible: false, seriesId: [key] }] },
      style: { padding: 1 } });
    return new window.VTable.PivotChart(container, {
      indicatorsAsCol: false, rows: [], columns: [],
      records: [{ group: 'A', count: 11581 }, { group: 'B', count: 19173 },
        { group: 'C', count: 6780 }, { group: 'A', value: 681967.69 },
        { group: 'B', value: 1053092.69 }, { group: 'C', value: 412478.55 }],
      indicators: [chart('count', 'bar'), chart('value', 'scatter')],
      corner: { titleOnDimension: 'row', disableHeaderHover: true },
      widthMode: 'autoWidth', heightMode: 'autoHeight', defaultRowHeight: 200,
      defaultHeaderRowHeight: 50, defaultColWidth: 280, defaultHeaderColWidth: 120,
      autoFillWidth: true, autoFillHeight: true, tooltip: { confine: false },
      hover: { disableAxisHover: true }
    });
  },
  async verify(page) {
    // bar 和 scatter 均须成为真实的 chart 单元格。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 2) throw new Error('双轴散点透视图缺失');
    });
  }
};
