/**
 * BugServer case IDs: 6889ea68eb9ae000b36719b2
 * 验证目的：树列表中对第三级节点设置复选状态，且不级联到父节点。
 * 改写：分类与数值改为通用数据，保留树层级、行序号复选框与 setCellCheckboxState(1,3,true)。
 */
export default {
  mount(container) {
    // 展开两层树并关闭级联，再设置原始位置的子节点复选框。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'category', cellType: 'checkbox', tree: true, title: 'Category', width: 190 },
        { field: 'amount', title: 'Amount', width: 120 }],
      records: [{ category: 'Group A', amount: 100, children: [
        { category: 'Subgroup A1', amount: 60, children: [
          { category: 'Leaf A', amount: 30 }, { category: 'Leaf B', amount: 30 }] },
        { category: 'Subgroup A2', amount: 40 } ] },
      { category: 'Group B', amount: 80, children: [{ category: 'Subgroup B1', amount: 80 }] },
      { category: 'Lazy group', amount: 20, children: true }],
      hierarchyIndent: 20, hierarchyExpandLevel: 2, enableCheckboxCascade: false,
      rowSeriesNumber: { width: 50, cellType: 'checkbox', format: () => '' },
      select: { disableDragSelect: true }, theme: window.VTable.themes.BRIGHT
    });
    table.setCellCheckboxState(1, 3, true);
    return table;
  },
  async verify(page) {
    // 第三级节点已选中，未发生向父节点级联。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellCheckboxState(1, 3) !== true || table.getCellCheckboxState(1, 2) === true)
        throw new Error('树节点复选状态或级联不符合预期');
    });
  }
};
