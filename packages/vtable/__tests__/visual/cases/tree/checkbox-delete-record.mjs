/**
 * BugServer case IDs: 6889e710e565f800a58eb402
 * 验证目的：树形列表同时删除根节点及子节点后，行序号复选状态与树结构仍可用。
 * 改写：用通用节点替换商品和金额文字，保留 deleteRecords 的混合路径参数。
 */
export default {
  mount(container) {
    // 多层树里预设复选状态，然后删除第一个根和第二根的首个子节点。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', cellType: 'checkbox', tree: true, title: 'Group', width: 190 },
        { field: 'value', title: 'Value', width: 120 }],
      records: [{ name: 'Group A', value: 100, children: [
        { name: 'A1', value: 60, children: [{ name: 'A1a', value: 30 }, { name: 'A1b', value: 30 }] },
        { name: 'A2', value: 40 }
      ] }, { name: 'Group B', value: 80, children: [
        { name: 'B1', value: 40 }, { name: 'B2', value: 40 }
      ] }, { name: 'Group C', value: 70, children: [{ name: 'C1', value: 70 }] },
      { name: 'Lazy group', value: 20, children: true }],
      hierarchyIndent: 20, hierarchyExpandLevel: 2, enableCheckboxCascade: false,
      // 行序号空文字复选框保留来源的状态场景。
      rowSeriesNumber: { width: 50, cellType: 'checkbox', format: () => '' },
      select: { disableDragSelect: true }, theme: window.VTable.themes.BRIGHT
    });
    table.setCellCheckboxState(1, 3, true);
    table.setCellCheckboxState(0, 1, true);
    table.setCellCheckboxState(0, 2, true);
    table.setCellCheckboxState(0, 6, true);
    window.__treeRowsBefore = table.rowCount;
    table.deleteRecords([0, [1, 0]]);
    return table;
  },
  async verify(page) {
    // 混合层级删除应缩短可见树，剩余行仍可读取复选状态。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount >= window.__treeRowsBefore || !table.records.some(record => record.name === 'Group C'))
        throw new Error(`树记录删除失败：${window.__treeRowsBefore} -> ${table.rowCount}`);
      const states = Array.from({ length: table.rowCount - 1 }, (_, index) => table.getCellCheckboxState(0, index + 1));
      if (!states.some(state => state === true))
        throw new Error(`删除后已选行丢失：${JSON.stringify(states)}；records=${JSON.stringify(table.records)}`);
    });
  }
};
