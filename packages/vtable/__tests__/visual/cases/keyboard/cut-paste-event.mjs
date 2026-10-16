/**
 * BugServer case IDs: 6a8c0450eb8e12005e80be38
 * 验证目的：剪切两格时事件剪贴板写入原值、清空源格，再粘贴到目标行。
 * 改写：用浏览器内存事件剪贴板代替系统权限，记录只含固定短文本。
 */
export default {
  mount(container) {
    // 两列连续源格和同列空目标格构成最小剪切粘贴场景。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 140, editor: 'input' },
        { field: 'city', title: 'City', width: 140, editor: 'input' }],
      records: [{ name: 'Alpha', city: 'North' },
        { name: 'Beta', city: 'South' },
        { name: '', city: '' }],
      keyboardOptions: { copySelected: true, cutSelected: true, pasteValueToCell: true },
      editCellTrigger: ['keydown', 'dblclick']
    });
  },
  async exercise(page) {
    // 明确走 ClipboardEvent 回退路径，保留 cut 和 paste 的实际事件处理。
    await page.evaluate(async () => {
      const table = window.__visualTable;
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
      const store = {};
      const clipboardData = { setData(type, value) { store[type] = String(value); return true; },
        getData(type) { return store[type] || ''; },
        clearData(type) { if (type) delete store[type]; else Object.keys(store).forEach(key => delete store[key]); } };
      const event = type => {
        const value = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(value, 'clipboardData', { value: clipboardData });
        return value;
      };
      table.selectCells([{ start: { col: 0, row: 1 }, end: { col: 1, row: 1 } }]);
      window.__cutExpected = table.getCopyValue();
      const input = document.querySelector('#table input.table-focus-control');
      if (input) { input.removeAttribute('readonly'); input.value = 'placeholder'; input.focus(); input.select(); }
      table.getElement().focus();
      table.getElement().dispatchEvent(event('cut'));
      await new Promise(resolve => setTimeout(resolve, 150));
      window.__cutText = store['text/plain'] || store.text || '';
      table.selectCell(0, 3);
      table.getElement().focus();
      table.getElement().dispatchEvent(event('paste'));
      await new Promise(resolve => setTimeout(resolve, 150));
    });
  },
  async verify(page) {
    // 数据源、复制文本和目标两格都必须反映真实的剪切结果。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const state = { expected: window.__cutExpected, copied: window.__cutText,
        source: [table.getCellValue(0, 1), table.getCellValue(1, 1)],
        target: [table.getCellValue(0, 3), table.getCellValue(1, 3)] };
      if (state.copied !== state.expected || state.source.join('|') !== '|' ||
        state.target.join('|') !== 'Alpha|North')
        throw new Error(`剪切粘贴状态异常：${JSON.stringify(state)}`);
    });
  }
};
