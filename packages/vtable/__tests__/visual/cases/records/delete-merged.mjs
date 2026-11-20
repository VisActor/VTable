/**
 * BugServer case IDs: 6614e84b2acd9c00d1c98a63
 * 验证目的：删除合并单元格分组中的记录后合并区域正常重算。
 * 改写：使用通用编号，保留末行删除。
 */
export default {
  mount(container) {
    // 删除第二组末行，防止合并边界残留。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'select', title: '', cellType: 'checkbox', headerType: 'checkbox', width: 60 },
        { field: 'group', title: 'Group', width: 120 },
        { field: 'label', title: 'Label', width: 150, mergeCell: true },
        { field: 'id', title: 'ID', width: 100 }],
      records: [{ group: 'A', label: 'Group A', id: 1 }, { group: 'A', label: 'Group A', id: 2 },
        { group: 'B', label: 'Group B', id: 3 }, { group: 'B', label: 'Group B', id: 4 }],
      autoWrapText: true, heightMode: 'autoHeight'
    });
    table.deleteRecords([3]);
    return table;
  },
  async verify(page) {
    // 最后一行变为 ID 3，合并组名仍可见。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount !== 4 || table.getCellOriginValue(3, 3) !== 3 || table.getCellValue(2, 3) !== 'Group B')
        throw new Error('合并分组删除失败');
    });
  }
};
