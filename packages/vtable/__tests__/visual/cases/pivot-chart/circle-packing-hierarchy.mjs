/**
 * BugServer case IDs: 68cba2db5d163300b3f67f84
 * 验证目的：透视图中的 circlePacking 层级数据可绘制叶节点与父节点。
 * 改写：用固定的甲乙组和数值代替来源的大型分类数据。
 */
export default {
  mount(container) {
    // 两层子组和四个叶节点足以显示圆形打包图的嵌套关系。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.width = '700px';
    container.style.height = '400px';
    return new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['bucket'], indicatorsAsCol: false,
      indicators: [{ indicatorKey: 'name', title: 'Hierarchy', cellType: 'chart', chartModule: 'vchart',
        style: { padding: 1 }, chartSpec: {
          type: 'circlePacking', data: { id: 'data1' }, categoryField: 'name', valueField: 'value',
          circlePacking: { style: { fillOpacity: datum => datum.isLeaf ? 0.75 : 0.25 } },
          layoutPadding: 5, label: { style: { fontSize: 10, visible: datum => datum.depth === 1 } },
          animation: false
        } }],
      records: [{ group: 'All', bucket: 'One', name: 'root', children: [
        { name: 'Group A', children: [{ name: 'A1', value: 8 }, { name: 'A2', value: 12 }] },
        { name: 'Group B', children: [{ name: 'B1', value: 10 }, { name: 'B2', value: 6 }] }
      ] }],
      defaultRowHeight: 250, defaultHeaderRowHeight: 40, defaultColWidth: 320, defaultHeaderColWidth: 90
    });
  },
  async verify(page) {
    // 层级记录和图表单元格都必须存在，避免仅渲染表头。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const chartCells = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') chartCells.push({ col, row });
      if (!chartCells.length || table.records[0]?.children?.length !== 2)
        throw new Error('圆形打包图的层级记录或图表单元格缺失');
    });
  }
};
