/**
 * BugServer case IDs: 653b222c1053b2a37d5dc9a7
 * 验证目的：复选框对象值的选中、禁用与布尔值状态正确初始化。
 * 改写：保留来源的状态组合，缩减无关的文本与排序列。
 */
export default {
  mount(container) {
    // 覆盖未选、已选、禁用和直接布尔值四种输入形态。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'check', title: 'Check', width: 130, headerType: 'checkbox', cellType: 'checkbox' },
        { field: 'label', title: 'Label', width: 150 }
      ],
      records: [
        { check: { text: 'unchecked', checked: false, disable: false }, label: 'A' },
        { check: { text: 'unchecked', checked: false, disable: true }, label: 'B' },
        { check: { text: 'checked', checked: true, disable: false }, label: 'C' },
        { check: { text: 'checked', checked: true, disable: true }, label: 'D' },
        { check: true, label: 'E' }, { check: false, label: 'F' }
      ],
      frozenColCount: 1, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 用公开状态 API 验证两种初始状态，而非只检查配置对象。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const states = table.getCheckboxState('check');
      if (table.getCellType(0, 1) !== 'checkbox' || states.length !== 6)
        throw new Error('复选框未初始化');
      if (table.getCellCheckboxState(0, 1) !== false || table.getCellCheckboxState(0, 3) !== true)
        throw new Error('复选框初始状态错误');
    });
  }
};
