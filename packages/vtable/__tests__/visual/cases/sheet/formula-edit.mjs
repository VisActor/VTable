/**
 * BugServer case IDs: 690076c72ab33400b4abb33a
 * 验证目的：Sheet 跨区域 SUM 公式回填后进入单元格编辑状态。
 * 改写：保留公式与编辑顺序，移除与此目的无关的菜单和插件配置。
 */
export default {
  mount(container) {
    // 固定数据让 SUM(A2:C2,B3,C3) 的结果可预测。
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true,
      sheets: [{ sheetKey: 'sheet1', sheetTitle: 'Sheet 1', rowCount: 20, columnCount: 10,
        columns: [{ title: 'Name', sort: true, width: 100 }],
        data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], active: true }]
    });
    const cell = { sheet: 'sheet1', row: 4, col: 3 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:C2,B3,C3)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error) throw new Error(`SUM 公式错误：${result.error}`);
    window.__formulaResult = result.value;
    const table = sheet.getActiveSheet().tableInstance;
    table.changeCellValue(3, 4, result.value, false, false);
    table.startEditCell(3, 4);
    return sheet;
  },
  async verify(page) {
    // 公式结果应保存在表格对应单元格中。
    await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      if (!Number.isFinite(window.__formulaResult) || table.getCellValue(3, 4) !== window.__formulaResult)
        throw new Error(`公式结果错误：${window.__formulaResult}`);
    });
  }
};
