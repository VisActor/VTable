/**
 * BugServer case IDs: 6a69af4d02c575005f77ab2c
 * 验证目的：过滤后高度为零的树子行在折叠与展开后不阻止可见行填满视口。
 * 改写：来源的 300 个隐藏行及 40 个可见行缩为固定匿名分组。
 */
export default {
  mount(container) {
    // 第一组可在过滤后隐藏子行，第二组保留足够多的可见行填满视口。
    container.style.width = '720px';
    container.style.height = '360px';
    const hiddenChildren = Array.from({ length: 24 }, (_, index) => ({
      name: `Hidden ${index + 1}`, visible: true
    }));
    const records = [
      { name: 'Filtered group', visible: true, hierarchyState: 'expand', children: hiddenChildren },
      { name: 'Visible group', visible: true, hierarchyState: 'expand',
        children: Array.from({ length: 12 }, (_, index) => ({ name: `Visible ${index + 1}`, visible: true })) }
    ];
    const options = {
      columns: [{ field: 'name', title: 'Name', tree: true, width: 260 }],
      records, defaultRowHeight: 40, hierarchyExpandLevel: 2,
      customComputeRowHeight({ row, table }) {
        // 已过滤的原始记录占零高度，其他树行维持固定高度。
        return table.getCellOriginRecord(0, row)?.visible === false ? 0 : 40;
      }
    };
    const table = new window.VTable.ListTable(container, options);
    return {
      table, hiddenChildren, options,
      async renderAsync() {
        // 等待树形表初始绘制。
        await table.renderAsync?.();
      },
      release() {
        // 清理树形表实例。
        table.release();
      }
    };
  },
  async exercise(page) {
    // 标记子记录不可见、清空行高缓存并重复折叠展开首个分组。
    await page.evaluate(async () => {
      const fixture = window.__visualTable;
      fixture.hiddenChildren.forEach(child => { child.visible = false; });
      await fixture.table.updateOption(fixture.options, { clearRowHeightCache: true, clearColWidthCache: false });
      fixture.table.toggleHierarchyState(0, 1, false);
      fixture.table.toggleHierarchyState(0, 1, false);
    });
  },
  async verify(page) {
    // 第一隐藏行仍为零高，场景图已把后续可见行拉进可视区域。
    await page.evaluate(() => {
      const table = window.__visualTable.table;
      const bodyHeight = table.tableNoFrameHeight - table.getFrozenRowsHeight() - table.getBottomFrozenRowsHeight();
      const renderedHeight = table.getRowsHeight(table.frozenRowCount, table.scenegraph.proxy.rowEnd);
      const hiddenHeight = table.getRowHeight(table.columnHeaderLevelCount + 1);
      if (hiddenHeight !== 0 || renderedHeight < bodyHeight)
        throw new Error(`零高度树行未正确处理：${JSON.stringify({ hiddenHeight, renderedHeight, bodyHeight })}`);
    });
  }
};
