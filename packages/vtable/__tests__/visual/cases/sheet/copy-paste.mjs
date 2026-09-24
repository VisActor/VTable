/**
 * BugServer case IDs: 6927f3ea215128005c991a9d
 * 验证目的：Sheet 公式结果经 copy 事件进入剪贴板，再经 paste 事件写入目标格。
 * 改写：移除菜单与展示插件，保留公式、同一 clipboardData 和事件先后顺序。
 */
export default {
  mount(container) {
    // 先把 SUM 结果写回表格，供复制事件读取。
    const sheet = new window.VTableSheet.VTableSheet(container, {
      showSheetTab: true, sheets: [{ sheetKey: 'sheet1', sheetTitle: 'Sheet 1',
        rowCount: 30, columnCount: 10, data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], active: true }]
    });
    const cell = { sheet: 'sheet1', row: 5, col: 0 };
    sheet.formulaManager.setCellContent(cell, '=SUM(A2:A4)');
    const result = sheet.formulaManager.getCellValue(cell);
    if (result.error) throw new Error(`Sheet 源公式错误: ${result.error}`);
    const table = sheet.getActiveSheet().tableInstance;
    table.changeCellValue(0, 5, result.value);
    window.__sheetCopySource = result.value;
    return sheet;
  },
  async exercise(page) {
    // 使用一个事件剪贴板对象重放来源的复制和粘贴顺序。
    await page.evaluate(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      const element = table.getElement();
      const store = {};
      const clipboardData = { setData(type, value) { store[type] = value; },
        getData(type) { return store[type] || ''; }, clearData(type) { delete store[type]; } };
      Object.defineProperty(clipboardData, 'types', { get: () => Object.keys(store) });
      const clipboardEvent = type => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', { value: clipboardData });
        return event;
      };
      const keyEvent = (key, keyCode) => {
        const event = document.createEvent('Event');
        event.initEvent('keydown', true, false);
        Object.assign(event, { ctrlKey: true, metaKey: true, altKey: true,
          which: keyCode, keyCode, key, code: 'Key' + key.toUpperCase() });
        element.focus();
        element.dispatchEvent(event);
      };
      table.selectCell(0, 5);
      keyEvent('c', 67);
      element.dispatchEvent(clipboardEvent('copy'));
      window.__sheetCopiedText = store['text/plain'] || store.text || '';
      table.selectCell(1, 5);
      keyEvent('v', 86);
      element.dispatchEvent(clipboardEvent('paste'));
    });
  },
  async verify(page) {
    // 剪贴板必须真的收到公式结果，目标格必须真的改变。
    await page.waitForFunction(() => {
      const table = window.__visualTable.getActiveSheet().tableInstance;
      return window.__sheetCopiedText &&
        String(window.__sheetCopiedText).trim() === String(window.__sheetCopySource) &&
        String(table.getCellValue(1, 5)).trim() === String(window.__sheetCopySource);
    });
  }
};
