/**
 * BugServer case IDs: 693a765f2f9376005c0328e3
 * 验证目的：第二张 Sheet 的跨表 SUM 范围在第一张 Sheet 显示计算结果。
 * 改写：原范围重复写入 Sheet 名，改为受支持的单表范围；保留中文感叹号归一化条件。
 */
export default {
  mount(container) {
    // 两张表使用固定矩阵，Data！A2:A4 的结果应为 11。
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true,
      sheets: [{ sheetKey: 'sheet1', sheetTitle: 'Summary', rowCount: 20, columnCount: 8,
        data: [[1, 2, 3], [4, 5, 6]], active: true },
      { sheetKey: 'sheet2', sheetTitle: 'Data', rowCount: 20, columnCount: 8,
        data: [[2, 4, 6], [4, 5, 6], [7, 8, 9], ['A', 'B', 'C']] }]
    });
    const cell = { sheet: 'sheet1', row: 5, col: 0 };
    sheet.formulaManager.setCellContent(cell, '=SUM(Data！A2:A4)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error) throw new Error(`跨 Sheet SUM 错误：${result.error}`);
    window.__crossSheetValue = result.value;
    sheet.getActiveSheet().tableInstance.changeCellValue(0, 5, result.value, false, false);
    return sheet;
  },
  async verify(page) {
    // 公式管理器与可见单元格都应保存第二张表的求和值。
    await page.evaluate(() => {
      const sheet = window.__visualTable;
      const value = sheet.getActiveSheet().tableInstance.getCellValue(0, 5);
      if (window.__crossSheetValue !== 11 || value !== 11)
        throw new Error(`跨 Sheet 计算值错误：${window.__crossSheetValue}, ${value}`);
    });
  }
};
