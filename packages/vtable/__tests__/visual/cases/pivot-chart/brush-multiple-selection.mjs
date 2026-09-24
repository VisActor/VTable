/**
 * BugServer case IDs: 6954de338ff7e3005dfc6526
 * 验证目的：透视柱状图启用 multiple x 轴框选时，拖动触发 brushEnd 并保留选区。
 * 改写：用三个匿名维度和本地 VChart 构建最小图表，保留实际鼠标拖动。
 */
export default {
  mount(container) {
    // 本地图表模块使用两个共享维度指标，两个图表均开启 multiple 框选。
    window.VTable.register.chartModule('vchart', window.VChart.default ?? window.VChart);
    container.style.width = '760px';
    container.style.height = '380px';
    window.__brushEndCount = 0;
    // 为两个指标创建相同的横向多次框选配置。
    const chartSpec = (id, field) => ({
      type: 'bar', direction: 'vertical', data: { id },
      xField: 'category', yField: field,
      brush: { visible: true, brushType: 'x', brushMode: 'multiple',
        inBrush: { colorAlpha: 1 }, outOfBrush: { colorAlpha: 0.2 } },
      animation: false
    });
    const table = new window.VTable.PivotChart(container, {
      rows: ['group'], columns: ['bucket'], indicatorsAsCol: false,
      indicators: [
        { indicatorKey: 'amount', title: 'Amount', cellType: 'chart', chartModule: 'vchart',
          chartSpec: chartSpec('amount', 'amount') },
        { indicatorKey: 'count', title: 'Count', cellType: 'chart', chartModule: 'vchart',
          chartSpec: chartSpec('count', 'count') }
      ],
      records: [
        { group: 'All', bucket: 'One', category: 'A', amount: 10, count: 4 },
        { group: 'All', bucket: 'One', category: 'B', amount: 16, count: 8 },
        { group: 'All', bucket: 'One', category: 'C', amount: 12, count: 5 }
      ],
      defaultRowHeight: 250, defaultColWidth: 500,
      defaultHeaderRowHeight: 30, defaultHeaderColWidth: 80,
      chartDimensionLinkage: {}
    });
    table.onVChartEvent('brushEnd', () => { window.__brushEndCount++; });
    return table;
  },
  async exercise(page) {
    // 在首个可见图表单元格的绘图区水平拖动创建框选。
    const segment = await page.evaluate(() => {
      const table = window.__visualTable;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') {
            const b = table.getCellRect(col, row).bounds;
            const host = document.getElementById('table').getBoundingClientRect();
            return { start: { x: host.x + b.x1 + 100,
              y: host.y + (b.y1 + b.y2) / 2 },
            end: { x: host.x + b.x1 + 360,
              y: host.y + (b.y1 + b.y2) / 2 } };
          }
      throw new Error('框选图表单元格缺失');
    });
    await page.mouse.move(segment.start.x - 15, segment.start.y);
    await page.mouse.move(segment.start.x, segment.start.y, { steps: 5 });
    await page.waitForTimeout(150);
    await page.mouse.down();
    await page.mouse.move(segment.end.x, segment.end.y, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(150);
  },
  async verify(page) {
    // 至少一个图表收到 brushEnd，证明录制的拖动进入了 VChart 框选路径。
    await page.evaluate(() => {
      if (window.__brushEndCount < 1) throw new Error('透视图未触发框选结束事件');
    });
  }
};
