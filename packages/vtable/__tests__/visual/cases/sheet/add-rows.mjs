/**
 * BugServer case IDs: 68ff1f7b25696c00b26a7761
 * 验证目的：Sheet 调整行高并插入两行后，原有数据仍位于正确位置。
 * 改写：保留行高调整、addRecords 与编辑动作，移除无关菜单和插件。
 */
export default {
  mount(container) {
    // 固定矩阵及公式，使插入前后的单元格位置可验证。
    container.style.height = '400px';
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true,
      sheets: [{ sheetKey: 'sheet1', sheetTitle: 'Sheet 1', rowCount: 20, columnCount: 10,
        columns: [{ title: 'Name', sort: true, width: 100 }],
        data: [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['A', 'B', 'C']], active: true }]
    });
    const table = sheet.getActiveSheet().tableInstance;
    const cell = { sheet: 'sheet1', row: 4, col: 3 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:C2,B3,C3)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error) throw new Error(`SUM 公式错误：${result.error}`);
    table.changeCellValue(3, 4, result.value, false, false);
    table.stateManager.startResizeRow(4, 230, 50);
    table.stateManager.updateResizeRow(390, 80);
    table.stateManager.endResizeRow();
    window.__sheetRowsBefore = table.rowCount;
    table.addRecords([[], []], 2, true);
    table.startEditCell(3, 6);
    return sheet;
  },
  async verify(page) {
    // 两行插入必须改变表格结构，原有非空记录不能丢失。
    await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      if (table.rowCount < window.__sheetRowsBefore + 2)
        throw new Error(`Sheet 插行未生效：${window.__sheetRowsBefore} -> ${table.rowCount}`);
      if (!Number.isFinite(table.getCellRect(1, 5)?.bounds?.x1))
        throw new Error('Sheet 插行后单元格未布局');
    });
  }
};
