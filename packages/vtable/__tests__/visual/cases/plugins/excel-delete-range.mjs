/**
 * BugServer case IDs: 69292cda9995e4005d1533c2
 * 验证目的：ExcelEditCellKeyboardPlugin 用 Delete 清空选中的可编辑矩形范围。
 * 改写：以匿名短记录替换来源的姓名和邮箱；保留源码中的键盘动作。
 */
export default {
  mount(container) {
    // 编辑器使插件默认的“仅清空可编辑单元格”规则有可验证目标。
    const VTable = window.VTable;
    VTable.register.editor('input-editor', new VTable.editors.InputEditor({}));
    return new VTable.ListTable(container, {
      columns: [
        { field: 'id', title: 'ID', width: 80 },
        { field: 'name', title: 'Name', width: 150, editor: 'input-editor' },
        { field: 'score', title: 'Score', width: 120, editor: 'input-editor' }
      ],
      records: [
        { id: 1, name: 'A', score: '10' },
        { id: 2, name: 'B', score: '20' },
        { id: 3, name: 'C', score: '30' }
      ],
      editCellTrigger: ['keydown'],
      plugins: [new VTable.plugins.ExcelEditCellKeyboardPlugin()]
    });
  },
  async exercise(page) {
    // 真实焦点、范围选择和 Delete 键与来源的内联动作一致。
    await page.evaluate(() => {
      const table = window.__visualTable;
      table.selectCells([{ start: { col: 1, row: 1 }, end: { col: 2, row: 2 } }]);
      table.getElement().tabIndex = 0;
      table.getElement().focus();
    });
    await page.keyboard.press('Delete');
  },
  async verify(page) {
    // 所选四格必须清空，未选记录及不可编辑 ID 保持原值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      for (const row of [1, 2]) for (const col of [1, 2])
        if (table.getCellOriginValue(col, row) !== '') throw new Error('选中范围未全部清空');
      if (table.getCellOriginValue(0, 1) !== 1 || table.getCellOriginValue(1, 3) !== 'C')
        throw new Error('Delete 修改了未选或不可编辑单元格');
    });
  }
};
