/**
 * BugServer case IDs: 692597e7cee9a0005d063c64
 * 验证目的：Sheet 公式结果格拖动填充柄并选择复制填充后，邻列写入相同显示值。
 * 改写：保留来源的 SUM(A2:A4) 和点击、拖动、菜单选择顺序，移除无关主菜单与主题。
 */
export default {
  mount(container) {
    // 固定矩阵令 D5 的求和结果与复制到 E5 后的显示值都可预测。
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true,
      sheets: [{ sheetKey: 'sheet1', sheetTitle: 'Sheet 1', rowCount: 20, columnCount: 10,
        data: [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['A', 'B', 'C']], active: true }]
    });
    const cell = { sheet: 'sheet1', row: 4, col: 3 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:A4)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error) throw new Error(`源公式错误：${result.error}`);
    sheet.getActiveSheet().tableInstance.changeCellValue(3, 4, result.value, false, false);
    window.__fillSourceValue = result.value;
    return sheet;
  },
  async exercise(page) {
    // 先选中源单元格，按填充柄实际边界拖到右侧，再点击复制填充菜单。
    const cellCenter = await page.evaluate(() => {
      const bounds = window.__visualTable.getActiveSheet().tableInstance.scenegraph.getCell(3, 4).globalAABBBounds;
      const canvas = window.__visualTable.getActiveSheet().tableInstance.canvas.getBoundingClientRect();
      return { x: canvas.x + (bounds.x1 + bounds.x2) / 2,
        y: canvas.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.click(cellCenter.x, cellCenter.y);
    const points = await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      const selected = [...table.scenegraph.selectedRangeComponents.values()][0];
      const handle = selected?.fillhandle?.globalAABBBounds;
      if (!handle) throw new Error('Sheet 填充柄未显示');
      const target = table.scenegraph.getCell(4, 4).globalAABBBounds;
      const canvas = table.canvas.getBoundingClientRect();
      return { start: { x: canvas.x + (handle.x1 + handle.x2) / 2,
        y: canvas.y + (handle.y1 + handle.y2) / 2 },
      end: { x: canvas.x + target.x2 - 8, y: canvas.y + target.y2 - 8 } };
    });
    await page.mouse.move(points.start.x, points.start.y);
    await page.mouse.down();
    await page.mouse.move(points.end.x, points.end.y, { steps: 10 });
    await page.mouse.up();
    await page.locator('.vtable__menu-element__item').filter({ hasText: '复制填充' }).click();
  },
  async verify(page) {
    // 当前复制填充行为将源格显示值 11 写到相邻单元格，源格仍为 11。
    await page.evaluate(() => {
      const sheet = window.__visualTable;
      const table = sheet.getActiveSheet().tableInstance;
      if (window.__fillSourceValue !== 11 || table.getCellValue(3, 4) !== 11 ||
        table.getCellValue(4, 4) !== 11)
        throw new Error(`公式自动填充结果错误：${table.getCellValue(3, 4)}, ${table.getCellValue(4, 4)}`);
    });
  }
};
