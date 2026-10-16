/**
 * BugServer case IDs: 6567f9cc69022a32a0625120
 * 验证目的：创建 ARCO 主题列表后 updateTheme 立即更新画布底色。
 * 改写：缩减展示列，保留 cross 悬停、自动行高与 ARCO extends 更新顺序。
 */
export default {
  mount(container) {
    // 先创建 ARCO，再覆盖 underlayBackgroundColor，避免仅测试初始主题。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100, sort: true }, { field: 'name', title: 'Name', width: 150 }],
      records: [100, 80, 1, 55, 28].map((progress, i) => ({ progress, id: i + 1, name: `Name ${i + 1}` })),
      theme: window.VTable.themes.ARCO, hover: { highlightMode: 'cross', disableHeaderHover: true },
      widthMode: 'standard', heightMode: 'autoHeight', autoWrapText: true
    });
    table.updateTheme(window.VTable.themes.ARCO.extends({ underlayBackgroundColor: 'red' }));
    return table;
  },
  async verify(page) {
    // 更新后数据仍可访问且主题覆盖被表格接收；具体底色由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== 100 || table.theme.underlayBackgroundColor !== 'red')
        throw new Error('updateTheme 未应用底色');
    });
  }
};
