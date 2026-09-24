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
 * BugServer case IDs: 68ff1d7f07d0a000a8414c50
 * 验证目的：公式回填与两列宽调整后，在第二列前插入两列。
 * 改写：使用匿名数值矩阵，保留公式、列宽调整、插入位置及编辑动作。
 */
export default {
  mount(container) {
    // 固定求和值使列插入前的公式结果可以直接校验。
    const sheet = createInsertSheet(container);
    const cell = { sheet: 'sheet1', row: 4, col: 3 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:C2)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error || result.value !== 6) throw new Error(`SUM 结果错误：${JSON.stringify(result)}`);
    const table = sheet.getActiveSheet().tableInstance;
    table.changeCellValue(3, 4, result.value, false, false);
    table.stateManager.startResizeCol(0, 230, 50);
    table.stateManager.updateResizeCol(300, 50);
    table.stateManager.endResizeCol();
    table.stateManager.startResizeCol(1, 230, 50);
    table.stateManager.updateResizeCol(150, 50);
    table.stateManager.endResizeCol();
    window.__insertColumnsBefore = table.colCount;
    table.addColumns([{ field: 1 }, { field: 4 }], 1, true);
    table.startEditCell(5, 4);
    return sheet;
  },
  async verify(page) {
    // 新列必须位于原第二列前，原数值要保持顺序并向右移动两格。
    await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      if (table.colCount !== window.__insertColumnsBefore + 2 ||
        table.getCellValue(0, 1) !== 1 || table.getCellValue(1, 1) !== undefined ||
        table.getCellValue(2, 1) !== undefined || table.getCellValue(3, 1) !== 2)
        throw new Error('Sheet 第二列前插入位置或数值错误');
    });
  }
};
