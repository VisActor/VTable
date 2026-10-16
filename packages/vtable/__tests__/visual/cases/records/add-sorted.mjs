/**
 * BugServer case IDs: 656d93014c3611faee9b1b30
 * 验证目的：按名字排序后，在索引 2 插入缺名字和有名字的两条记录。
 * 改写：保留 50 条初始记录、排序状态和两种插入边界，去掉展示型 SVG。
 */
export default {
  mount(container) {
    // 在已有排序状态下批量插入，其中第一条缺失排序字段。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { field: 'fname', title: 'First Name', width: 150, sort: true },
        { field: 'progress', title: 'Progress', width: 120 }],
      widthMode: 'standard'
    });
    const names = ['Sophia', 'Emma', 'Olivia', 'Isabella', 'Ava', 'Mia', 'Emily', 'Abigail', 'Madison', 'Elizabeth'];
    table.setRecords(Array.from({ length: 50 }, (_, i) =>
      ({ id: i + 1, fname: names[i % names.length], progress: i })), { field: 'fname', order: 'asc' });
    table.addRecords([{ id: 201 }, { id: 202, fname: 'Zsagjkf' }], 2);
    return table;
  },
  async verify(page) {
    // 两条不同形态的新记录都应保留，且排序状态没有丢失。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const ids = Array.from({ length: table.rowCount - 1 }, (_, i) => table.getCellOriginValue(0, i + 1));
      if (table.rowCount !== 53 || !ids.includes(201) || !ids.includes(202) || table.sortState?.field !== 'fname')
        throw new Error('排序后插入记录失败');
    });
  }
};
