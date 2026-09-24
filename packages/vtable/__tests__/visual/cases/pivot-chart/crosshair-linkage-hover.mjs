/**
 * BugServer case IDs: 6916c732711d9200a827cda3
 * 验证目的：两个透视图指标共享维度时，悬停可显示跨图表的准线与提示。
 * 改写：固定 A/B/C 维度和柱线两图，去除来源的大型多指标数据。
 */
export default {
  mount(container) {
    // 两个独立图表指标在同一透视表中共用 period 维度。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.height = '430px';
    window.__crosshairHoverCount = 0;
    const table = new window.VTable.PivotChart(container, {
      rows: [], columns: [], indicatorsAsCol: false,
      records: [
        { period: 'A', amount: 10 }, { period: 'B', amount: 18 }, { period: 'C', amount: 13 },
        { period: 'A', rate: 4 }, { period: 'B', rate: 9 }, { period: 'C', rate: 6 }
      ],
      indicators: [
        { indicatorKey: 'amount', title: 'Amount', cellType: 'chart', chartModule: 'vchart',
          chartSpec: { type: 'common',
            series: [{ id: 'amount', type: 'bar', data: { id: 'amount' },
              xField: 'period', yField: 'amount' }],
            crosshair: { xField: { visible: true } }, animation: false } },
        { indicatorKey: 'rate', title: 'Rate', cellType: 'chart', chartModule: 'vchart',
          chartSpec: { type: 'common',
            series: [{ id: 'rate', type: 'line', data: { id: 'rate' },
              xField: 'period', yField: 'rate', point: { visible: true } }],
            crosshair: { xField: { visible: true } }, animation: false } }
      ],
      chartDimensionLinkage: { showTooltip: true },
      defaultRowHeight: 180, defaultColWidth: 560,
      widthMode: 'autoWidth', heightMode: 'autoHeight'
    });
    table.onVChartEvent('pointermove', () => { window.__crosshairHoverCount++; });
    return table;
  },
  async exercise(page) {
    // 鼠标进入首个图表的绘图区，停留后由截图保存准线与提示状态。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') {
            const b = table.getCellRect(col, row).bounds;
            const host = document.getElementById('table').getBoundingClientRect();
            return { x: host.x + b.x1 + 80, y: host.y + (b.y1 + b.y2) / 2 };
          }
      throw new Error('联动图表单元格缺失');
    });
    await page.mouse.move(point.x - 20, point.y);
    await page.mouse.move(point.x + 4, point.y, { steps: 8 });
    await page.waitForTimeout(150);
  },
  async verify(page) {
    // 图表应收到真实指针事件，避免将静态双图误作悬停覆盖。
    await page.evaluate(() => {
      if (window.__crosshairHoverCount < 1)
        throw new Error('图表未收到悬停事件');
    });
  }
};
