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
      brush: { visible: true, brushType: 'x', brushMode: 'multiple', delayTime: 0,
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
    table.onVChartEvent('brushEnd', event => {
      window.__brushEndCount++;
      window.__brushSelection = {
        inside: event.value.inBrushData.map(row => row.category),
        outside: event.value.outOfBrushData.map(row => row.category)
      };
    });
    return table;
  },
  async exercise(page) {
    // 根据 B 柱的实际位置框选，避免固定坐标把所有类别一起选中。
    const segment = await page.evaluate(() => {
      const table = window.__visualTable;
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++)
          if (table.getCellType(col, row) === 'chart') {
            const b = table.getCellRect(col, row).bounds;
            const host = document.getElementById('table').getBoundingClientRect();
            const position = table.getChartDatumPosition(
              { group: 'All', bucket: 'One', category: 'B', amount: 16 },
              table.getCellHeaderPaths(col, row));
            if (!position) throw new Error('无法定位 B 柱');
            const y = host.y + (b.y1 + b.y2) / 2;
            return { start: { x: host.x + position.x - 20, y },
              end: { x: host.x + position.x + 20, y } };
          }
      throw new Error('框选图表单元格缺失');
    });
    await page.mouse.move(segment.start.x - 15, segment.start.y);
    await page.mouse.move(segment.start.x, segment.start.y, { steps: 5 });
    // 激活图表后先完成一次表格绘制，避免首次 viewBox 同步在框选后清掉选框。
    await page.evaluate(() => new Promise(resolve => {
      const table = window.__visualTable;
      const listener = table.on('after_render', () => {
        table.off(listener);
        resolve();
      });
      table.renderAsync();
    }));
    await page.mouse.down();
    await page.mouse.move(segment.end.x, segment.end.y, { steps: 12 });
    await page.mouse.up();
    await page.waitForFunction(() => window.__brushEndCount > 0);
    // 框选状态会刷新图表缓存；等待表格实际绘制，截图不依赖异步帧的先后顺序。
    await page.evaluate(() => new Promise(resolve => {
      const table = window.__visualTable;
      const listener = table.on('after_render', () => {
        table.off(listener);
        resolve();
      });
      table.renderAsync();
    }));
    // 活动图表和表格共用画布；表格完成后绘制已存在的选框，不修改选中状态。
    await page.evaluate(() => window.__visualTable.scenegraph.brushingChartInstance.getStage().render());
  },
  async verify(page) {
    // 结束事件与真实选中/未选中数据同时成立，跳过拖动不能通过。
    await page.evaluate(() => {
      if (window.__brushEndCount < 1) throw new Error('透视图未触发框选结束事件');
      const selected = window.__brushSelection;
      if (!selected.inside.includes('B') || !selected.outside.includes('C'))
        throw new Error(`透视图框选数据状态错误：${JSON.stringify(selected)}`);
    });
  }
};
