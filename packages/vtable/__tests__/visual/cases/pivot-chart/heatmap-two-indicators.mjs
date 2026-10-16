/**
 * BugServer case IDs: 68cb7de11cfd3a00b25a86ed, 68cb7f3a597cd100b2f74a00, 69899a7209038a005df130d0
 * 验证目的：两个独立记录流的热力图指标与反向颜色图例共同绘制。
 * 改写：三条来源源码完全相同，虽名称不同均为 heatmap；用固定通用字段替换展示文字。
 */
export default {
  mount(container) {
    // 来源是两个 indicatorKey 分别绑定两个数据流；共用颜色域但 y 字段不同。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    const makeIndicator = (key, yField) => ({ indicatorKey: key, cellType: 'chart', chartModule: 'vchart',
      style: { padding: [1, 1, 0, 1] }, chartSpec: {
        type: 'heatmap', direction: 'vertical', xField: 'year', yField, seriesField: 'kind',
        valueField: key, padding: 0, data: { id: key },
        axes: [{ type: 'band', orient: 'left', bandPadding: 0 },
          { type: 'band', orient: 'bottom', bandPadding: 0 }],
        region: [{ clip: true }], background: 'transparent',
        color: { type: 'linear', range: ['#C2CEFF', '#5766EC'], domain: [{ dataId: key, fields: ['colorValue'] }] },
        label: { visible: true, smartInvert: true },
        cell: { style: { shape: 'rect', stroke: '#ffffff', lineWidth: 1,
          fill: { field: 'colorValue', scale: 'color' } } }
      } });
    return new window.VTable.PivotChart(container, {
      rows: [], columns: [], indicators: [makeIndicator('line1', 'salesLabel'),
        makeIndicator('line2', 'profitLabel')],
      records: { line1: [{ year: '2019', salesLabel: 'Sales', kind: 'sales', line1: 200000, colorValue: 200000 },
        { year: '2020', salesLabel: 'Sales', kind: 'sales', line1: 400000, colorValue: 400000 }],
      line2: [{ year: '2019', profitLabel: 'Profit', kind: 'sales', line2: 10000, colorValue: 200000 },
        { year: '2020', profitLabel: 'Profit', kind: 'sales', line2: 20000, colorValue: 400000 }] },
      widthMode: 'adaptive', heightMode: 'adaptive', indicatorsAsCol: false,
      legends: { visible: true, type: 'color', orient: 'right', position: 'start',
        colors: ['#C2CEFF', '#5766EC'], value: [1000000, 200000], min: 1000000, max: 200000, maxWidth: '30%' }
    });
  },
  async verify(page) {
    // 两个指标都必须产出 chart 单元格，不能只展示图例。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let count = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) if (table.getCellType(col, row) === 'chart') count++;
      if (count < 2) throw new Error('双热力图指标缺失');
    });
  }
};
