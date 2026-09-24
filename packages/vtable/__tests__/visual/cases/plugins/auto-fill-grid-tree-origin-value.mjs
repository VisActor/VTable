/**
 * BugServer case IDs: 69d614f2e41b43005d89a624
 * 验证目的：grid-tree 表头下拖动填充柄，插件将原单元格值复制到目标行。
 * 改写：用三条匿名记录重建树形表头，保留真实拖动和填充菜单选择。
 */
export default {
  mount(container) {
    // 由 AutoFillPlugin 处理填充柄拖动，首列源格为固定文本 Seed。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { title: 'Group', columns: [{ field: 'name', title: 'Name', width: 150 },
          { field: 'value', title: 'Value', width: 150 }] }],
      records: [{ id: 1, name: 'Seed', value: 10 },
        { id: 2, name: 'Other', value: 20 }, { id: 3, name: 'Third', value: 30 }],
      headerHierarchyType: 'grid-tree', headerExpandLevel: 2,
      excelOptions: { fillHandle: true },
      plugins: [new window.VTable.plugins.AutoFillPlugin()]
    });
    return table;
  },
  async exercise(page) {
    // 先选中源值，再从实际填充柄拖至下一行并选择复制填充。
    const source = await page.evaluate(() => {
      const table = window.__visualTable;
      const row = table.columnHeaderLevelCount;
      const b = table.scenegraph.getCell(1, row).globalAABBBounds;
      const canvas = table.canvas.getBoundingClientRect();
      return { x: canvas.x + (b.x1 + b.x2) / 2,
        y: canvas.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(source.x, source.y);
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const row = table.columnHeaderLevelCount;
      const handle = [...table.scenegraph.selectedRangeComponents.values()][0]?.fillhandle?.globalAABBBounds;
      if (!handle) throw new Error('列表填充柄未显示');
      const target = table.scenegraph.getCell(1, row + 1).globalAABBBounds;
      const canvas = table.canvas.getBoundingClientRect();
      return { start: { x: canvas.x + (handle.x1 + handle.x2) / 2,
        y: canvas.y + (handle.y1 + handle.y2) / 2 },
      end: { x: canvas.x + target.x2 - 8, y: canvas.y + target.y2 - 8 } };
    });
    await page.mouse.move(points.start.x, points.start.y);
    await page.mouse.down();
    await page.mouse.move(points.end.x, points.end.y, { steps: 10 });
    await page.mouse.up();
    await page.locator('.vtable__menu-element__item').filter({ hasText: '复制填充' }).click();
  },
  async verify(page) {
    // 目标行必须由 Other 变为 Seed，源行和下一行保持各自值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const row = table.columnHeaderLevelCount;
      const values = [row, row + 1, row + 2].map(r => table.getCellValue(1, r));
      if (values[0] !== 'Seed' || values[1] !== 'Seed' || values[2] !== 'Third')
        throw new Error(`列表复制填充结果错误：${values}`);
    });
  }
};
