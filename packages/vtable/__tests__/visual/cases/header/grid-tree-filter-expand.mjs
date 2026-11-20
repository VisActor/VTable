/**
 * BugServer case IDs: 694cee0bd8a329005c45bca3
 * 验证目的：FilterPlugin 与 headerExpandLevel 共存时，分组表头图标点击可展开下级列。
 * 改写：保留三级列、空 ID、插件与真实点击动作，字段值换成通用编号。
 */
export default {
  mount(container) {
    // 第二级默认展开，最深两列需要点击折叠图标后才进入表格。
    const table = new window.VTable.ListTable(container, {
      columns: [
        { field: 'id', title: 'ID', width: 100 },
        { field: 'name', title: 'Name', columns: [
          { field: 'name1', title: 'Name 1', width: 120 },
          { field: 'name2', title: 'Name 2', width: 150, columns: [
            { field: 'name21', title: 'Name 2.1', width: 150 },
            { field: 'name22', title: 'Name 2.2', width: 150 }
          ] }
        ] }
      ],
      records: Array.from({ length: 5 }, (_, index) => ({ id: index === 1 ? undefined : index + 1,
        name: `Group ${index + 1}`, name1: `A${index + 1}`, name2: `B${index + 1}`,
        name21: `C${index + 1}`, name22: `D${index + 1}` })),
      headerHierarchyType: 'grid-tree', headerExpandLevel: 2,
      widthMode: 'standard', defaultRowHeight: 40,
      plugins: [new window.VTable.plugins.FilterPlugin({})]
    });
    window.__headerColsBefore = table.colCount;
    return table;
  },
  async exercise(page) {
    // 按场景图标边界点击真实表头折叠图标，覆盖录制的“展开表头”动作。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      for (let row = 0; row < Math.min(table.rowCount, 3); row++) {
        for (let col = 0; col < table.colCount; col++) {
          const stack = [table.scenegraph.getCell(col, row)];
          while (stack.length) {
            const mark = stack.pop();
            if (mark?.attribute?.funcType === 'collapse') {
              const bounds = mark.globalAABBBounds;
              const host = document.getElementById('table').getBoundingClientRect();
              return { x: host.x + (bounds.x1 + bounds.x2) / 2,
                y: host.y + (bounds.y1 + bounds.y2) / 2 };
            }
            stack.push(...(mark?.children ?? []));
          }
        }
      }
      throw new Error('可展开表头图标缺失');
    });
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => window.__visualTable.colCount > window.__headerColsBefore);
  },
  async verify(page) {
    // 实际列数必须增加，且 FilterPlugin 仍保留在表格插件中。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount <= window.__headerColsBefore || table.options.headerExpandLevel !== 2)
        throw new Error(`分组表头未展开：${window.__headerColsBefore} -> ${table.colCount}`);
    });
  }
};
