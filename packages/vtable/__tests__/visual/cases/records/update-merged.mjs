/**
 * BugServer case IDs: 6614e8b42acd9c00d1c98a64
 * 验证目的：分组合并单元格存在时，updateRecords 更新目标记录且合并范围保持正确。
 * 改写：用通用组编号与短文本替换原示例，保留五行分组和索引 1 的更新路径。
 */
export default {
  mount(container) {
    // 前三行同组、后两行同组，用于检查更新后的跨行合并。
    const table = new window.VTable.ListTable(container, {
      columns: [
        { field: 'select', title: '', width: 60, cellType: 'checkbox', headerType: 'checkbox' },
        { field: 'groupNo', title: 'Group No.', width: 120 },
        { field: 'groupName', title: 'Group', width: 150, mergeCell: true },
        { field: 'item', title: 'Item', width: 120 }
      ],
      records: [
        { groupNo: '0001', groupName: 'Group 1', item: 'A' },
        { groupNo: '0001', groupName: 'Group 1', item: 'B' },
        { groupNo: '0001', groupName: 'Group 1', item: 'C' },
        { groupNo: '0002', groupName: 'Group 2', item: 'D' },
        { groupNo: '0002', groupName: 'Group 2', item: 'E' }
      ],
      autoWrapText: true, heightMode: 'autoHeight'
    });
    table.updateRecords([{ groupNo: '0001', groupName: 'Group 1', item: 'Updated' }], [1]);
    return table;
  },
  async verify(page) {
    // 更新值与第一组合并区间都应真实可读。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(3, 2) !== 'Updated') throw new Error('记录更新未生效');
      const range = table.getCellRange(2, 1);
      if (range.start.row !== 1 || range.end.row !== 3) throw new Error('分组合并范围错误');
    });
  }
};
