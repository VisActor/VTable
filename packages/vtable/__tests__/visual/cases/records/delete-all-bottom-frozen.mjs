/**
 * BugServer case IDs: 6aacad9f168db9005cc382be
 * 验证目的：删除全部记录后，底部冻结行数量重置为零。
 * 改写：保留左右冻结列、底部冻结行和删除两条记录的顺序。
 */
export default {
  mount(container) {
    // 先创建冻结区，再删除所有数据，防止仅测试空表初始化。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 120 }, { field: 'name', title: 'Name', width: 300 },
        { field: 'total', title: 'Total', width: 180 }],
      records: [{ id: 1, name: 'A', total: 120 }, { id: 2, name: 'B', total: 180 }],
      frozenColCount: 1, rightFrozenColCount: 1, bottomFrozenRowCount: 1, widthMode: 'standard'
    });
    table.deleteRecords([0, 1]);
    return table;
  },
  async verify(page) {
    // 删除必须同时清空数据和底部冻结计数。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.records.length !== 0 || table.bottomFrozenRowCount !== 0)
        throw new Error('删除全部记录后仍保留底部冻结行');
    });
  }
};
