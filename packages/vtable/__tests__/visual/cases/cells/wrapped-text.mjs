/**
 * BugServer case IDs: 64744f315d221c008666ee10
 * 验证目的：字段格式化后的长文本和显式换行在自动行高下显示。
 * 改写：删除与换行无关的排序回调，保留格式化、autoWrapText 和 enableLineBreak。
 */
export default {
  mount(container) {
    // 固定多行记录，使长文本及显式换行都进入可见区域。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, style: { autoWrapText: true },
          fieldFormat: record => `Completed completed completed ${record.progress}%` },
        { field: 'id', title: 'ID', width: 150,
          fieldFormat: record => `Line one\nLine two ${record.id}` },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: Array.from({ length: 10 }, (_, index) => ({ progress: index, id: index + 1, name: 'name' })),
      widthMode: 'standard', heightMode: 'autoHeight', defaultRowHeight: 50,
      autoWrapText: true, enableLineBreak: true
    });
  },
  async verify(page) {
    // 同时检查格式化文字与表格的有效行高。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (!String(table.getCellValue(0, 1)).includes('Completed')) throw new Error('格式化文本缺失');
      if (!String(table.getCellValue(1, 1)).includes('\n')) throw new Error('显式换行缺失');
      if (table.getRowHeight(1) < 50) throw new Error('自动行高未生效');
    });
  }
};
