/**
 * BugServer case IDs: 656701ec4c3611faee9b19db
 * 验证目的：点击懒加载树节点后，在层级事件中 setRecordChildren 并显示新子节点。
 * 改写：商品分类与金额替换成通用分组，保留 children:true 与真实展开点击。
 */
export default {
  mount(container) {
    // 初始懒加载节点无数组 children，展开事件负责补入固定子记录。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Group', tree: true, width: 200, sort: true },
        { field: 'value', title: 'Value', width: 120, sort: true }],
      records: [{ name: 'Group A', value: 10, children: [
        { name: 'A1', value: 5 }, { name: 'A2', value: 5 }
      ] }, { name: 'Lazy group', value: 20, children: true },
      { name: 'Group B', value: 30, children: [{ name: 'B1', value: 30 }] }],
      hierarchyIndent: 20, hierarchyExpandLevel: 2, allowFrozenColCount: 2,
      showPin: true, theme: window.VTable.themes.BRIGHT, defaultRowHeight: 32
    });
    table.on(window.VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
      // 仅对首次展开的占位节点补入子行，避免重复展开时覆盖数据。
      if (args.hierarchyState !== window.VTable.TYPES.HierarchyState.expand ||
        Array.isArray(args.originData.children)) return;
      table.setRecordChildren([{ name: 'Lazy child A', value: 7 },
        { name: 'Lazy child B', value: 13 }], args.col, args.row);
    });
    return table;
  },
  async exercise(page) {
    // 用单元格位置定位懒加载行的层级图标，避免依赖录制时的固定像素。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      let row = 1;
      while (row < table.rowCount && table.getCellValue(0, row) !== 'Lazy group') row++;
      if (row === table.rowCount) throw new Error('懒加载节点缺失');
      const bounds = table.getCellRect(0, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + bounds.x1 + 22, y: host.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 异步式子节点注入必须改变源记录和可见表体。
    await page.waitForFunction(() => Array.isArray(window.__visualTable.records[1].children));
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = Array.from({ length: table.rowCount - 1 }, (_, index) => table.getCellValue(0, index + 1));
      if (!values.includes('Lazy child A') || !values.includes('Lazy child B'))
        throw new Error(`懒加载子节点未显示：${values.join(', ')}`);
    });
  }
};
