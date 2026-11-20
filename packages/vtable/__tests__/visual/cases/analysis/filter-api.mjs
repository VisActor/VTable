/**
 * BugServer case IDs: 65bf7a3197cc3d008de5b474
 * 验证目的：字段枚举筛选和函数筛选同时应用于列表。
 * 改写：用通用编号和状态替换人员信息，并缩小数据量以便本地稳定运行。
 */
export default {
  mount(container) {
    // 60 条固定记录的交集是 10 条，便于直接验证筛选结果。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 }, { field: 'state', title: 'State', width: 120 },
        { field: 'name', title: 'Name', width: 150 }],
      records: Array.from({ length: 60 }, (_, i) => ({ id: i + 1, state: i % 2 === 0 ? 'A' : 'B', name: `Item ${i + 1}` })),
      frozenColCount: 1, widthMode: 'standard'
    });
    table.updateFilterRules([{ filterKey: 'state', filteredValues: ['A'] },
      { filterFunc: record => record.id % 3 === 0 }]);
    return table;
  },
  async verify(page) {
    // 两个过滤条件应同时生效，且首条可见记录符合交集。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount !== 11 || table.getCellValue(0, 1) !== 3)
        throw new Error(`筛选结果错误：${table.rowCount}`);
    });
  }
};
