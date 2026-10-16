/**
 * BugServer case IDs: 6555e6399dabd71aa3845bb7
 * 验证目的：拖宽列后双击列边界，列宽按内容重新计算。
 * 改写：用匿名文本代替原始记录，按当前单元格边界计算鼠标位置。
 */
export default {
  mount(container) {
    // 长文本列初始宽度固定为 150px，双击应自动测量其内容。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'a', title: 'A', width: 150 },
        { field: 'b', title: 'B', width: 100 },
        { field: 'description', title: 'Description', width: 150 },
        { field: 'name', title: 'Name', width: 150 }],
      records: [{ a: 1, b: 2, description: 'A much longer description value', name: 'Item A' },
        { a: 3, b: 4, description: 'Short', name: 'Item B' }],
      resize: { colResizeMode: 'all' }
    });
  },
  async exercise(page) {
    // 先把第三列拖宽，再双击其新的右侧边界。
    const edge = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(2, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(edge.x, edge.y);
    await page.mouse.down();
    await page.mouse.move(edge.x + 120, edge.y, { steps: 10 });
    await page.mouse.up();
    const resized = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(2, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__draggedColumnWidth = b.x2 - b.x1;
      return { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.dblclick(resized.x, resized.y, { delay: 80 });
  },
  async verify(page) {
    // 拖动必须先增宽，双击后列宽应收缩至文本测量宽度。
    await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(2, 0).bounds;
      const width = b.x2 - b.x1;
      if (window.__draggedColumnWidth < 240 || width >= window.__draggedColumnWidth - 20 || width < 150)
        throw new Error(`双击自动列宽未生效：${window.__draggedColumnWidth} -> ${width}`);
    });
  }
};
