/**
 * BugServer case IDs: 64745b3b5d221c008666ee22
 * 验证目的：格式化字段和值相同的相邻记录按列合并，并保持样式回调。
 * 改写：仅保留可触发合并的记录，保留 mergeCell 和动态样式设置。
 */
export default {
  mount(container) {
    // 相邻两条 A 记录触发名称列合并，ID 格式化触发另一列合并。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'id', title: 'ID', width: 100, mergeCell: true,
          fieldFormat: record => record.id === 2 ? 3 : record.id },
        { field: 'name', title: 'Name', width: 150, mergeCell: true,
          style: { color: args => args.row === 1 ? 'blue' : 'red',
            fontSize: args => args.row === 1 ? 16 : 20 } }
      ],
      records: [{ id: 2, name: 'A' }, { id: 3, name: 'A' }, { id: 4, name: 'B' }],
      widthMode: 'standard'
    });
  },
  async verify(page) {
    // 相邻两格应返回同一合并范围，第三格保持独立。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const first = table.getCellRange(1, 1);
      const second = table.getCellRange(1, 2);
      const third = table.getCellRange(1, 3);
      if (first.start.row !== 1 || first.end.row !== 2 || second.end.row !== 2 || third.start.row !== 3)
        throw new Error('单元格合并范围错误');
    });
  }
};
