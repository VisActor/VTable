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
 * BugServer case IDs: 68ff1e7c479d9000abdefaf9
 * 验证目的：保留多区域公式配置，在第三列前插入两列且原数据右移。
 * 改写：使用匿名数值矩阵，保留列宽调整、插入位置及编辑动作。
 */
export default {
  mount(container) {
    // 只设置公式，与来源一样不在插列前手动回填计算值。
    const sheet = createInsertSheet(container);
    const cell = { sheet: 'sheet1', row: 4, col: 3 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:C2,B3,C3)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error || result.value !== 17) throw new Error(`SUM 结果错误：${JSON.stringify(result)}`);
    const table = sheet.getActiveSheet().tableInstance;
    table.stateManager.startResizeCol(1, 230, 50);
    table.stateManager.updateResizeCol(200, 50);
    table.stateManager.endResizeCol();
    table.stateManager.startResizeCol(3, 230, 50);
    table.stateManager.updateResizeCol(300, 50);
    table.stateManager.endResizeCol();
    window.__insertColumnsBefore = table.colCount;
    table.addColumns([{ field: 0 }, { field: 4 }], 2, true);
    table.startEditCell(5, 4);
    return sheet;
  },
  async verify(page) {
    // 原前两列不变，新增两列为空，原第三列位于第五列。
    await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      if (table.colCount !== window.__insertColumnsBefore + 2 ||
        table.getCellValue(0, 1) !== 1 || table.getCellValue(1, 1) !== 2 ||
        table.getCellValue(2, 1) !== undefined || table.getCellValue(3, 1) !== undefined ||
        table.getCellValue(4, 1) !== 3)
        throw new Error('Sheet 第三列前插入位置或数值错误');
    });
  }
};
