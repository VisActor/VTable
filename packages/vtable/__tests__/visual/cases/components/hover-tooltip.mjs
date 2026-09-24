/**
 * BugServer case IDs: 64f81f827d8f46008b2df45e
 * 验证目的：鼠标依次经过两个进度条单元格时，showTooltip 更新内容。
 * 改写：缩短动态图标和数据，保留 mouseenter_cell、showTooltip 与两次悬停。
 */
export default {
  mount(container) {
    // 事件处理使用当前单元格值，第二次悬停必须替换第一次内容。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'value', title: 'Value', width: 120 },
        { field: 'percent', title: 'Progress', width: 160, cellType: 'progressbar' }],
      records: [{ value: 20, percent: '80%' }, { value: 10, percent: '40%' }]
    });
    table.on('mouseenter_cell', ({ col, row }) => {
      const rect = table.getVisibleCellRangeRelativeRect({ col, row });
      table.showTooltip(col, row, { content: `cell data: ${table.getCellValue(col, row)}`,
        referencePosition: { rect, placement: window.VTable.TYPES.Placement.right },
        className: 'visual-tooltip', style: { bgColor: 'black', color: 'white', arrowMark: true } });
    });
    return table;
  },
  async exercise(page) {
    // 两个坐标都来自表格矩形，分别断言悬停后真实浮层文本。
    for (const row of [1, 2]) {
      const point = await page.evaluate(row => {
        const b = window.__visualTable.getCellRect(0, row).bounds;
        const host = document.getElementById('table').getBoundingClientRect();
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      }, row);
      await page.mouse.move(point.x, point.y);
      await page.waitForFunction(value => document.body.innerText.includes(`cell data: ${value}`), row === 1 ? 20 : 10);
    }
  },
  async verify(page) {
    // 最终提示应显示第二行的值。
    await page.evaluate(() => {
      if (!document.body.innerText.includes('cell data: 10')) throw new Error('提示内容未更新');
    });
  }
};
