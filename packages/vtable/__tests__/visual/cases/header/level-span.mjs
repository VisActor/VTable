/**
 * BugServer case IDs: 684656c47c20ee00b3e9c578
 * 验证目的：多层列表表头中的 levelSpan 跨层占位与叶列数据正常渲染。
 * 改写：缩短通用学科文字，保留四层树和两个不同的 levelSpan 值。
 */
export default {
  mount(container) {
    // 保留来源的四层表头及中间节点跨层设置。
    return new window.VTable.ListTable(container, {
      columns: [
        { title: 'Object', columns: [{ title: 'Field 1', columns: [
          { title: 'F11', columns: [{ field: 'math', title: 'Math', width: 150 }] },
          { title: 'F12', levelSpan: 3, columns: [{ field: 'chinese', title: 'Language', width: 150 }] },
          { title: 'F13', columns: [{ field: 'english', title: 'English', width: 150 }] }
        ] }] },
        { title: 'Basic', levelSpan: 2, columns: [{ title: 'F21', columns: [{ field: 'computer', title: 'Computer', width: 150 }] }] }
      ],
      records: [{ math: 'math', chinese: 'language', english: 'english', computer: 'computer' }],
      widthMode: 'auto', heightMode: 'autoHeight', defaultColWidth: 120, defaultRowHeight: 40,
      autoWrapText: true, theme: window.VTable.themes.DEFAULT
    });
  },
  async verify(page) {
    // 检查四层表头与叶列数据同时存在。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.columnHeaderLevelCount < 4 || table.colCount !== 4) throw new Error('层级表头未展开');
      if (table.getCellValue(0, table.columnHeaderLevelCount) !== 'math') throw new Error('叶列数据缺失');
    });
  }
};
