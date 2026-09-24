/**
 * BugServer case IDs: 656d91b34c3611faee9b1b2e
 * 验证目的：第一页开启分页时，在记录索引 2 批量插入后可见顺序正确。
 * 改写：人员资料与联系方式替换为固定编号，保留 50 条数据和每页 7 条配置。
 */
export default {
  mount(container) {
    // 两条新记录应出现在第一页第 3-4 条，后续旧记录顺延。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { field: 'label', title: 'Label', width: 180 },
        { field: 'progress', title: 'Progress', width: 130 }],
      records: Array.from({ length: 50 }, (_, index) => ({ id: index + 1,
        label: `Item ${index + 1}`, progress: index })),
      pagination: { perPageCount: 7, currentPage: 0 },
      widthMode: 'standard', allowFrozenColCount: 2
    });
    table.addRecords([{ id: 201, label: 'Inserted A' },
      { id: 202, label: 'Inserted B' }], 2);
    return table;
  },
  async verify(page) {
    // 插入必须影响分页当前页而非仅修改原始 records 数组。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.records.length !== 52 || table.getCellValue(0, 3) !== 201 ||
        table.getCellValue(0, 4) !== 202 || table.getCellValue(0, 5) !== 3)
        throw new Error('分页插入顺序错误');
    });
  }
};
