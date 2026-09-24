/**
 * BugServer case IDs: 66deb9600846a700faef5e60
 * 验证目的：值为数字 0 的透视树父节点仍能展开子维度。
 * 改写：将来源远程数据替换为固定公开记录，保留零值、双层行维度及录制展开动作。
 */
export default {
  mount(container) {
    // 零值类别和普通类别并存，用于识别把 0 错当空值的层级处理。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.PivotTable(container, {
      records: [
        { category: 0, item: 'Zero A', region: 'East', quantity: 2 },
        { category: 0, item: 'Zero B', region: 'West', quantity: 3 },
        { category: 'Other', item: 'Other A', region: 'East', quantity: 4 },
        { category: 'Other', item: 'Other B', region: 'West', quantity: 5 }
      ],
      rows: [{ dimensionKey: 'category', title: 'Category', width: 'auto' },
        { dimensionKey: 'item', title: 'Item', width: 'auto' }],
      columns: [{ dimensionKey: 'region', title: 'Region', width: 'auto' }],
      indicators: [{ indicatorKey: 'quantity', title: 'Quantity', width: 'auto' }],
      rowHierarchyType: 'tree', rowExpandLevel: 1, widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 在表头以下定位数字 0 所在行，再点击该行左侧层级图标。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const row = Array.from({ length: table.rowCount }, (_, index) => index)
        .find(index => table.getCellValue(0, index) === 0);
      if (row === undefined || table.getHierarchyState(0, row) !== 'collapse')
        throw new Error('未找到可展开的零值父节点');
      const b = table.getCellRect(0, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x1 + 23, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 数字 0 父节点必须转为展开并显示两个子项。
    await page.waitForFunction(() => {
      const table = window.__visualTable;
      const row = Array.from({ length: table.rowCount }, (_, index) => index)
        .find(index => table.getCellValue(0, index) === 0);
      return row !== undefined && table.getHierarchyState(0, row) === 'expand';
    });
    await page.evaluate(() => {
      if (window.__visualTable.rowCount < 5) throw new Error('零值类别的子项未进入可见行');
    });
  }
};
