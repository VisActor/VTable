/**
 * BugServer case IDs: 64745a465d221c008666ee1f
 * 验证目的：普通、拖动、表头和外部点击依次保留预期选择范围及自定义样式。
 * 改写：用单元格矩形执行录制动作，记录改为固定公开数据。
 */
export default {
  mount(container) {
    // 保留来源的选择样式、表头排序入口和悬停配置。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100 },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [
        { progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' },
        { progress: 1, id: 3, name: 'C' }, { progress: 55, id: 4, name: 'D' }
      ],
      showPin: true,
      allowFrozenColCount: 2,
      widthMode: 'standard',
      theme: { selectionStyle: { cellBgColor: 'rgba(130, 178, 245, 0.2)', cellBorderLineWidth: 2, cellBorderColor: '#0000ff' } },
      hover: { highlightMode: 'cross', disableHover: false, disableHeaderHover: true }
    });
  },
  async exercise(page) {
    // 按来源顺序执行单选、拖选、表头选择、再次拖选和表外点击。
    const point = (col, row) => page.evaluate(({ col, row }) => {
      const b = window.__visualTable.getCellRect(col, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    }, { col, row });
    const drag = async (start, end) => {
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(end.x, end.y, { steps: 8 });
      await page.mouse.up();
    };
    const first = await point(0, 1);
    await page.mouse.click(first.x, first.y);
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 1);
    await drag(await point(0, 2), await point(2, 3));
    await page.waitForFunction(() => {
      const range = window.__visualTable.getSelectedCellRanges()[0];
      return range && range.end.col - range.start.col >= 2 && range.end.row - range.start.row >= 1;
    });
    const header = await point(1, 0);
    await page.mouse.click(header.x, header.y);
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 0);
    await drag(await point(0, 1), await point(2, 3));
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.end.col >= 2);
    await page.mouse.click(850, 650);
  },
  async verify(page) {
    // 来源的表外点击不清除已选区域，最终范围和选择样式由截图共同验证。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellOriginValue(0, 1) !== 100) throw new Error('记录数据缺失');
      if (table.theme.selectionStyle?.cellBorderColor !== '#0000ff') throw new Error('选择样式未应用');
      const range = table.getSelectedCellRanges()[0];
      if (!range || range.end.col < 2 || range.end.row < 3) throw new Error('表外点击后选择范围丢失');
    });
  }
};
