/**
 * BugServer case IDs: 68ff1c25f11ddd816792f91a
 * 验证目的：Sheet 中公式和表格列插入后仍能渲染。
 * 改写：移除与列插入无关的菜单、主题和实验性插件配置，保留公式与 addColumns 调用。
 */
export default {
  mount(container) {
    // 使用固定矩阵避免异步数据源影响列插入的可重复性。
    container.style.height = '400px';
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true,
      sheets: [{
        rowCount: 20, columnCount: 10, sheetKey: 'sheet1', sheetTitle: 'Sheet 1',
        filter: true, columns: [{ title: 'Name', sort: true, width: 100 }],
        data: [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['A', 'B', 'C']], active: true
      }]
    });
    sheet.formulaManager.setCellContent({ sheet: 'sheet1', row: 4, col: 3 }, '=SUM(A2:C2)');
    const table = sheet.getActiveSheet().tableInstance;
    window.__sheetColsBefore = table.colCount;
    table.addColumns([{ field: 3 }, { field: 4 }], 3, true);
    return sheet;
  },
  async verify(page) {
    // 断言活动 Sheet 存在且插入操作改变列结构。
    await page.evaluate(() => {
      const sheet = window.__visualTable;
      const table = sheet.getActiveSheet()?.tableInstance;
      if (!table || table.colCount <= window.__sheetColsBefore) throw new Error('Sheet 列插入未生效');
      if (!Number.isFinite(table.getCellRect(1, 1)?.bounds?.x1)) throw new Error('Sheet 单元格未布局');
    });
  }
};
