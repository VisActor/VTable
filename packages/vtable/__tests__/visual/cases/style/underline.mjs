/**
 * BugServer case IDs: 65e6dd18603de700d1d8ba05
 * 验证目的：普通、虚线和带偏移下划线与虚线边框共存。
 * 改写：保留四列差异及换行记录，修正来源 widthMode 拼写错误。
 */
export default {
  mount(container) {
    // 同一行配置多种下划线参数，便于视觉比较细节。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150,
        style: { underline: true, color: 'red', borderColor: ['red', 'green'], borderLineDash: [4, 8] } },
      { field: 'id', title: 'ID', width: 100,
        style: { underline: true, underlineDash: [4, 1], underlineOffset: 10,
          color: 'red', borderColor: ['red', 'green'], borderLineDash: [8, 8] } },
      { field: 'note', title: 'Note', width: 150,
        style: { autoWrapText: true, underline: true, underlineDash: [4, 1], underlineOffset: 10,
          color: 'red', borderColor: ['red', 'green'], borderLineDash: [4, 8] } },
      { field: 'name', title: 'Name', width: 150,
        style: { autoWrapText: true, underline: true, color: 'red', borderColor: ['red', 'green'], borderLineDash: [4, 8] } }],
      records: [{ progress: 100, id: 1, note: 'Line 1\nLine 2', name: 'A\nB' },
        { progress: 80, id: 2, note: 'Short', name: 'C' }],
      widthMode: 'standard', heightMode: 'autoHeight', enableLineBreak: true
    });
  },
  async verify(page) {
    // 四列样式都已配置，文字边界仍通过截图判定。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 4 || table.getCellValue(2, 1) !== 'Line 1\nLine 2' ||
        table.options.columns[1].style.underlineOffset !== 10)
        throw new Error('下划线样式场景无效');
    });
  }
};
