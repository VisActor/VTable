/**
 * BugServer case IDs: 696dd1827a558400611ce035
 * 验证目的：透视饼图连续点击多个扇区时保留 element-select 多选状态。
 * 改写：将来源的区域和度量字段换成固定 A/B/C/D 类别与整数。
 */
export default {
  mount(container) {
    // 多选交互通过图元状态改变透明度，最终状态由像素快照保存。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.width = '700px';
    container.style.height = '400px';
    window.__pieClicks = [];
    const table = new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['bucket'], indicatorsAsCol: false,
      indicators: [{ indicatorKey: 'value', title: 'Amount', cellType: 'chart',
        chartModule: 'vchart', style: { padding: 1 }, chartSpec: {
          type: 'pie', data: { id: 'data1' }, categoryField: 'category', valueField: 'value',
          outerRadius: 0.8, innerRadius: 0,
          pie: { state: { selected: { opacity: 1 }, selected_reverse: { opacity: 0.2 } } },
          interactions: [{ type: 'element-select', isMultiple: true, triggerOff: 'empty' }],
          animation: false
        } }],
      records: [
        { group: 'All', bucket: 'One', category: 'A', value: 6 },
        { group: 'All', bucket: 'One', category: 'B', value: 9 },
        { group: 'All', bucket: 'One', category: 'C', value: 12 },
        { group: 'All', bucket: 'One', category: 'D', value: 8 }
      ],
      defaultRowHeight: 230, defaultColWidth: 290,
      defaultHeaderRowHeight: 40, defaultHeaderColWidth: 80,
      chartDimensionLinkage: { showTooltip: true }
    });
    table.onVChartEvent('click', args => { window.__pieClicks.push(args?.datum?.category ?? 'chart'); });
    return table;
  },
  async exercise(page) {
    // 用图元数据求真实扇区坐标，避免图表在不同平台的单元格内偏移影响命中。
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const cell = Array.from({ length: table.rowCount }, (_, row) =>
        Array.from({ length: table.colCount }, (_, col) => ({ col, row })))
        .flat().find(({ col, row }) => table.getCellType(col, row) === 'chart');
      if (!cell) throw new Error('饼图单元格未渲染');
      const paths = table.getCellHeaderPaths(cell.col, cell.row);
      const host = document.getElementById('table').getBoundingClientRect();
      return [{ category: 'A', value: 6 }, { category: 'B', value: 9 }, { category: 'C', value: 12 }]
        .map(datum => {
          const position = table.getChartDatumPosition({ group: 'All', bucket: 'One', ...datum }, paths);
          if (!position) throw new Error(`无法定位扇区 ${datum.category}`);
          return { x: host.x + position.x, y: host.y + position.y };
        });
    });
    for (const point of points) await page.mouse.click(point.x, point.y);
    await page.mouse.move(650, 350);
  },
  async verify(page) {
    // 至少两个不同图元必须收到真实图表点击，避免点击到空白区域。
    await page.evaluate(() => {
      if (new Set(window.__pieClicks).size < 2)
        throw new Error(`饼图多选未点击不同扇区：${JSON.stringify(window.__pieClicks)}`);
    });
  }
};
