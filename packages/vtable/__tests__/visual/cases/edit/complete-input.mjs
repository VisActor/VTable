/**
 * BugServer case IDs: 656856014c3611faee9b1a5c
 * 验证目的：输入编辑器写入新值并调用 completeEditCell 后记录被更新。
 * 改写：本地加载编辑器，保留来源通过 getEditor.element 修改值的路径。
 */
export default {
  mount(container) {
    // 第二条记录的 id 初始缺失，编辑完成后应成为明确的新值。
    const VTable = window.VTable;
    VTable.register.editor('input-editor', new VTable.editors.InputEditor({}));
    const table = new VTable.ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 150 },
        { field: 'date', title: 'Date', width: 150 },
        { field: 'id', title: 'ID', width: 100, editor: 'input-editor' }
      ],
      records: [{ name: 'A', date: '2019-01-01', id: 1 },
        { name: 'B', date: '2010-11-01' }, { name: 'C', date: '2013-10-20', id: 3 }]
    });
    table.startEditCell(2, 2);
    const editor = table.getEditor(2, 2);
    if (!editor?.element) throw new Error('输入编辑器没有挂载');
    editor.element.value = '11111';
    table.completeEditCell();
    return table;
  },
  async verify(page) {
    // 检查真实记录值，防止只在编辑框中显示新值而未提交。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (String(table.getCellOriginValue(2, 2)) !== '11111')
        throw new Error('编辑值未提交');
    });
  }
};
