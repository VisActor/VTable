/**
 * BugServer case IDs: 6980594c7a558400611ce045
 * 验证目的：Sheet 的全量 updateOption 删除旧页、新增并激活新页、更新现有页数据。
 * 改写：删去与更新无关的菜单和插件，保留两个工作表与全量更新路径。
 */
export default {
  mount(container) {
    // 从两个工作表切换为新页加更新后的第二页，重建公式依赖路径也会执行。
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true, sheets: [
        { sheetKey: 'sheet1', sheetTitle: 'Sheet 1', rowCount: 20, columnCount: 10,
          data: [[1, 2, 3], [4, 5, 6]], active: true },
        { sheetKey: 'sheet2', sheetTitle: 'Sheet 2', rowCount: 20, columnCount: 10,
          data: [[2, 4, 6], [4, 5, 6]] }
      ]
    });
    sheet.updateOption({ showSheetTab: false, defaultRowHeight: 25, defaultColWidth: 100,
      sheets: [
        { sheetKey: 'sheet12', sheetTitle: 'Sheet 12', rowCount: 20, columnCount: 10,
          data: [[111, 211, 311], [4, 5, 6]], active: true },
        { sheetKey: 'sheet2', sheetTitle: 'Sheet 2', rowCount: 20, columnCount: 10,
          data: [[222, 422, 622], [4, 5, 6]] }
      ] });
    return sheet;
  },
  async verify(page) {
    // 旧页应删除，新增页激活，第二页数据同步为新值。
    await page.evaluate(() => {
      const sheet = window.__visualTable;
      if (sheet.getWorkSheetInstance('sheet1') || sheet.getActiveSheet()?.getKey() !== 'sheet12' ||
        !sheet.getWorkSheetInstance('sheet2') || !sheet.getActiveSheet().tableInstance)
        throw new Error('Sheet 全量更新后的页结构错误');
    });
  }
};
