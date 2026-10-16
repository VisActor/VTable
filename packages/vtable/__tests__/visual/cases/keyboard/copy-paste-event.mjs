/**
 * BugServer case IDs: 6a8c0450aa6e45005ce41013
 * 验证目的：列表复制一格后，粘贴事件把文本写入另一行的空单元格。
 * 改写：使用本地事件剪贴板代替宿主 clipboard 权限；保留实际 copy/paste 事件路径。
 */
export default {
  mount(container) {
    // 目标格初始为空，不能由现有记录误判为粘贴成功。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 120, editor: 'input' },
        { field: 'age', title: 'Age', width: 100, editor: 'input' },
        { field: 'city', title: 'City', width: 140, editor: 'input' }],
      records: [{ name: 'Source', age: 'A1', city: 'Source' },
        { name: '', age: '', city: 'Target row' }],
      keyboardOptions: { copySelected: true, pasteValueToCell: true },
      editCellTrigger: ['keydown', 'dblclick']
    });
  },
  async exercise(page) {
    // 和来源一样先选中源格复制，再选中目标格派发 paste。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const element = table.getElement();
      const store = {};
      const clipboardData = { setData(type, value) { store[type] = String(value); },
        getData(type) { return store[type] || ''; }, clearData(type) { delete store[type]; } };
      const event = type => {
        const value = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(value, 'clipboardData', { value: clipboardData });
        return value;
      };
      table.selectCell(0, 1);
      element.focus();
      element.dispatchEvent(event('copy'));
      window.__listCopiedText = store['text/plain'] || store.text || '';
      table.selectCell(0, 2);
      element.dispatchEvent(event('paste'));
    });
  },
  async verify(page) {
    // 复制文本与目标格都须等于源格，缺动作时断言失败。
    await page.waitForFunction(() => {
      const table = window.__visualTable;
      return window.__listCopiedText?.trim() === 'Source' && table.getCellValue(0, 2) === 'Source';
    });
  }
};
