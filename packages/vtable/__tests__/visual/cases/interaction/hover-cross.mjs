/**
 * BugServer case IDs: 6474561b5d221c008666ee1c
 * 验证目的：录制的表头与表体悬停触发 cross 高亮模式。
 * 改写：以单元格矩形代替旧录制坐标，固定公开记录和颜色。
 */
export default {
  mount(container) {
    // 固定同一组列和记录，仅切换来源的 hover 模式与表头禁用项。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100 },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [
        { progress: 100, id: 1, name: 'A' },
        { progress: 80, id: 2, name: 'B' },
        { progress: 1, id: 3, name: 'C' }
      ],
      showPin: true,
      allowFrozenColCount: 2,
      widthMode: 'standard',
      hover: { highlightMode: 'cross', disableHover: false, disableHeaderHover: true },
      theme: {
        bodyStyle: { hover: { cellBgColor: '#CCE0FF', inlineRowBgColor: '#F3F8FF', inlineColumnBgColor: '#F3F8FF' } },
        headerStyle: { hover: { cellBgColor: '#CCE0FF', inlineRowBgColor: '#F3F8FF', inlineColumnBgColor: '#F3F8FF' } }
      }
    });
  },
  async exercise(page) {
    // 先执行录制的表头悬停，再移动到表体，保留最终高亮供截图比较。
    const cellPoint = row => page.evaluate(row => {
      const b = window.__visualTable.getCellRect(1, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    }, row);
    await page.mouse.move(850, 60);
    const header = await cellPoint(0);
    await page.mouse.move(header.x, header.y);
    await page.waitForFunction(disabled => {
      const hover = window.__visualTable.stateManager.hover;
      return hover.disableHeader === disabled && (disabled || hover.cellPos.row === 0);
    }, true);
    const body = await cellPoint(2);
    await page.mouse.move(body.x, body.y);
    await page.waitForFunction(() => {
      const pos = window.__visualTable.stateManager.hover.cellPos;
      return pos.col === 1 && pos.row === 2;
    });
  },
  async verify(page) {
    // 模式与真实悬停位置必须一致，截图验证着色范围。
    await page.evaluate(expected => {
      const table = window.__visualTable;
      const hover = table.stateManager.hover;
      if (hover.highlightScope !== expected || hover.cellPos.col !== 1 || hover.cellPos.row !== 2)
        throw new Error('悬停高亮模式或位置错误');
      if (table.getCellOriginValue(1, 2) !== 2) throw new Error('测试数据缺失');
    }, 'cross');
  }
};
