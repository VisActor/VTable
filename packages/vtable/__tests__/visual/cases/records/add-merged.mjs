/**
 * BugServer case IDs: 6614e7b82acd9c00d1c98a62
 * 验证目的：合并单元格分组中插入记录后合并区域正常重算。
 * 改写：分组和编号改成通用值，保留中间位置插入。
 */
export default {
  mount(container) {
    // 在第二组已有记录前插入同组项目。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'select', title: '', cellType: 'checkbox', headerType: 'checkbox', width: 60 },
        { field: 'group', title: 'Group', width: 120 },
        { field: 'label', title: 'Label', width: 150, mergeCell: true },
        { field: 'id', title: 'ID', width: 100 }],
      records: [{ group: 'A', label: 'Group A', id: 1 }, { group: 'A', label: 'Group A', id: 2 },
        { group: 'B', label: 'Group B', id: 3 }, { group: 'B', label: 'Group B', id: 4 }],
      autoWrapText: true, heightMode: 'autoHeight'
    });
    table.addRecord({ group: 'B', label: 'Group B', id: 5 }, 3);
    return table;
  },
  async verify(page) {
    // 插入记录可见，且合并列仍返回组名。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount !== 6 || table.getCellOriginValue(3, 4) !== 5 || table.getCellValue(2, 4) !== 'Group B')
        throw new Error('合并分组插入失败');
    });
  }
};
