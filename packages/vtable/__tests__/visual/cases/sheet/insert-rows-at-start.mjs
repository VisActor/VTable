/** 为列与行插入边界用例创建相同的匿名 Sheet 初始矩阵。 */
function createInsertSheet(container) {
  container.style.height = '400px';
  return new window.VTableSheet.VTableSheet(container, {
    showSheetTab: true,
    sheets: [{ sheetKey: 'sheet1', sheetTitle: 'Sheet 1', rowCount: 200, columnCount: 10,
      columns: [{ title: 'Values', width: 100 }],
      data: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]], active: true }]
  });
}

/**
 * BugServer case IDs: 68ff243743ec0700a96ec5b8
 * 验证目的：公式回填与行高调整后，在第一条记录前插入两行。
 * 改写：使用匿名数值矩阵，保留插入位置与编辑动作。
 */
export default {
  mount(container) {
    // 固定多区域公式结果，随后复现首行插入前的行高调整。
    const sheet = createInsertSheet(container);
    const cell = { sheet: 'sheet1', row: 4, col: 3 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:C2,B3,C3)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error || result.value !== 17) throw new Error(`SUM 结果错误：${JSON.stringify(result)}`);
    const table = sheet.getActiveSheet().tableInstance;
    table.changeCellValue(3, 4, result.value, false, false);
    table.stateManager.startResizeRow(1, 230, 50);
    table.stateManager.updateResizeRow(390, 80);
    table.stateManager.endResizeRow();
    window.__insertRowsBefore = table.rowCount;
    table.addRecords([[], []], 0, true);
    table.startEditCell(3, 6);
    return sheet;
  },
  async verify(page) {
    // 两行空记录位于最前，首条原记录的数值下移两行。
    await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      if (table.rowCount !== window.__insertRowsBefore + 2 ||
        table.getCellValue(0, 1) !== undefined || table.getCellValue(0, 2) !== undefined ||
        table.getCellValue(0, 3) !== 1 || table.getCellValue(0, 4) !== 4)
        throw new Error('Sheet 首行插入位置或数值错误');
    });
  }
};
