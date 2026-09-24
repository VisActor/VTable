/**
 * BugServer case IDs: 66053ddec302f600a46921a1, 66053eb3a8fccc00acd37033
 * 验证目的：树形列表的过滤、懒加载子项和清除过滤依次保持正确层级。
 * 改写：商品层级替换为匿名节点，保留高低数值过滤及清除动作。
 */
export default {
  mount(container) {
    // 首个父项的子节点由展开事件提供，另一个父项被高分过滤排除。
    container.style.height = '400px';
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'label', title: 'Node', width: 220, tree: true },
        { field: 'score', title: 'Score', width: 120 }],
      records: [{ label: 'Group A', score: 90, children: true },
        { label: 'Group B', score: 10, children: [{ label: 'B1', score: 5 }] }],
      hierarchyExpandLevel: 1, hierarchyIndent: 20
    });
    table.on(window.VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
      if (args.hierarchyState === window.VTable.TYPES.HierarchyState.expand &&
        !Array.isArray(args.originData.children))
        table.setRecordChildren([{ label: 'A1', score: 70 },
          { label: 'A2', score: 20 }], args.col, args.row);
    });
    return table;
  },
  async exercise(page) {
    // 先确认过滤减少可见行，再展开留下的懒加载节点并清除规则。
    await page.evaluate(() => {
      const table = window.__visualTable;
      window.__treeRowsBefore = table.rowCount;
      table.updateFilterRules([{ filterFunc: record => record.score > 50 }]);
      window.__treeRowsFiltered = table.rowCount;
    });
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(0, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x1 + 23, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
    await page.evaluate(() => window.__visualTable.updateFilterRules());
  },
  async verify(page) {
    // 清除后原节点和懒加载子项均可见，行数回升。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const labels = Array.from({ length: table.rowCount }, (_, row) => table.getCellValue(0, row));
      if (window.__treeRowsFiltered >= window.__treeRowsBefore ||
        !labels.includes('Group B') || !labels.includes('A1'))
        throw new Error(`树过滤清除或懒加载失败：${JSON.stringify(labels)}`);
    });
  }
};
