/**
 * BugServer case IDs: 68cba293e9f70b00b11e93d5
 * 验证目的：行列维度下的 sunburst 图表读取嵌套 children 数据并绘制层级扇区。
 * 改写：原有城市与类别改为通用分组，保留三层数据树。
 */
export default {
  mount(container) {
    // 两个维度单元格各使用不同层级值，防止退化为单一扇区。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['category'], indicatorsAsCol: false,
      indicators: [{ indicatorKey: 'name', title: 'Hierarchy', cellType: 'chart', chartModule: 'vchart',
        style: { padding: 1 }, chartSpec: { type: 'sunburst',
          categoryField: 'name', valueField: 'value', outerRadius: 1, innerRadius: 0,
          data: { id: 'data1' } } }],
      records: [
        { name: 'Collection A', group: 'Group A', category: 'Type 1', children: [
          { name: 'North', children: [{ name: 'One', value: 80 }, { name: 'Two', value: 120 }] },
          { name: 'South', children: [{ name: 'One', value: 60 }, { name: 'Two', value: 150 }] }
        ] },
        { name: 'Collection B', group: 'Group B', category: 'Type 1', children: [
          { name: 'East', children: [{ name: 'One', value: 90 }, { name: 'Two', value: 75 }] },
          { name: 'West', children: [{ name: 'One', value: 55 }, { name: 'Two', value: 110 }] }
        ] }
      ], defaultRowHeight: 220, defaultColWidth: 280, defaultHeaderRowHeight: 35
    });
  },
  async verify(page) {
    // 层级维度下必须有两个 chart 单元格；扇区层级由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let charts = 0;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') charts++;
      if (charts < 2) throw new Error('Sunburst 层级图表单元格缺失');
    });
  }
};
