/**
 * BugServer case IDs: 656d995d4c3611faee9b1b33
 * 验证目的：按名字排序的 50 条记录删除索引 0 和 8 后重算表体。
 * 改写：保留排序与双索引删除，去掉展示型 SVG 和无关字段。
 */
export default {
  mount(container) {
    // 排序完成后删除两个非连续索引，检查记录数和排序状态。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { field: 'fname', title: 'First Name', width: 150, sort: true },
        { field: 'progress', title: 'Progress', width: 120 }],
      widthMode: 'standard'
    });
    const names = ['Sophia', 'Emma', 'Olivia', 'Isabella', 'Ava', 'Mia', 'Emily', 'Abigail', 'Madison', 'Elizabeth'];
    table.setRecords(Array.from({ length: 50 }, (_, i) =>
      ({ id: i + 1, fname: names[i % names.length], progress: i })), { field: 'fname', order: 'asc' });
    table.deleteRecords([0, 8]);
    return table;
  },
  async verify(page) {
    // 删除后只余 48 条记录，排序状态仍指向 fname。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount !== 49 || table.sortState?.field !== 'fname' ||
        !Number.isFinite(table.getCellRect(1, 48)?.bounds?.y1))
        throw new Error('排序后删除记录失败');
    });
  }
};
