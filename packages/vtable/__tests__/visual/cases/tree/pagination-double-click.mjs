/**
 * BugServer case IDs: 67371af030877400b3e630f6
 * 验证目的：树形列表在分页第二页双击表体单元格时，事件仍对应当前可见记录。
 * 改写：商品层级与数字替换为通用分组，保留分页、树节点与录制的双击动作。
 */
export default {
  mount(container) {
    // 每页两条根记录，第二页包含普通树和懒加载占位节点。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Group', tree: true, width: 200, sort: true },
        { field: 'value', title: 'Value', width: 120, sort: true }],
      records: [
        { name: 'Group A', value: 10, children: [{ name: 'A1', value: 10 }] },
        { name: 'Group B', value: 20, children: [{ name: 'B1', value: 20 }] },
        { name: 'Group C', value: 30, children: [{ name: 'C1', value: 30 }] },
        { name: 'Lazy group', value: 40, children: true }
      ],
      pagination: { perPageCount: 2, currentPage: 1 },
      hierarchyIndent: 20, hierarchyExpandLevel: 2,
      showPin: true, allowFrozenColCount: 2, theme: window.VTable.themes.BRIGHT,
      defaultRowHeight: 32
    });
    window.__treePageDoubleClicks = [];
    table.on(window.VTable.ListTable.EVENT_TYPE.DBLCLICK_CELL, event => {
      // 记录双击事件的行列位置与可见值，确认没有映射到第一页。
      window.__treePageDoubleClicks.push({ col: event.col, row: event.row,
        value: table.getCellValue(event.col, event.row) });
    });
    table.on(window.VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
      // 来源允许对分页中的懒加载占位行动态补充子记录。
      if (args.hierarchyState === window.VTable.TYPES.HierarchyState.expand &&
        !Array.isArray(args.originData.children))
        table.setRecordChildren([{ name: 'Lazy child', value: 40 }], args.col, args.row);
    });
    return table;
  },
  async exercise(page) {
    // 双击第二页首条记录的数据列，重放来源中的连续点击。
    const point = await page.evaluate(() => {
      const bounds = window.__visualTable.getCellRect(1, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (bounds.x1 + bounds.x2) / 2,
        y: host.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.dblclick(point.x, point.y, { delay: 80 });
    await page.waitForFunction(() => window.__treePageDoubleClicks.length > 0);
  },
  async verify(page) {
    // 事件值必须来自第二页当前可见的记录，并且树结构仍在。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const event = window.__treePageDoubleClicks[0];
      if (!event || event.value !== 30 || table.getCellValue(0, 1) !== 'Group C')
        throw new Error(`树分页双击映射错误：${JSON.stringify(event)}`);
    });
  }
};
