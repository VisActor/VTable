/**
 * BugServer case IDs: 66960d6749841700ac7664d4
 * 验证目的：输入编辑器通过 startEditCell 的初始值参数打开并显示该值。
 * 改写：编辑器从本地 bundle 加载，删除带时间戳的内网 CDN 请求。
 */
export default {
  mount(container) {
    // 本地注册与来源相同的输入和日期编辑器，再用第三列第二行启动编辑。
    const VTable = window.VTable;
    VTable.register.editor('input-editor', new VTable.editors.InputEditor({}));
    VTable.register.editor('date-editor', new VTable.editors.DateInputEditor({}));
    const table = new VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, editor: 'input-editor' },
        { field: 'birthday', title: 'Birthday', width: 150, editor: 'date-editor' },
        { field: 'id', title: 'ID', width: 100, editor: 'input-editor' },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [
        { progress: 100, id: 1, name: 'A', birthday: '2019-01-01' },
        { progress: 80, name: 'B', birthday: '2010-11-01' },
        { progress: 1, id: 3, name: 'C', birthday: '2013-10-20' }
      ],
      widthMode: 'standard', allowFrozenColCount: 2
    });
    table.startEditCell(2, 2, 'nihao');
    return table;
  },
  async verify(page) {
    // 确认实际编辑控件已挂载，并接收 startEditCell 指定的初始值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const editor = table.getEditor(2, 2);
      if (!editor?.element || editor.element.value !== 'nihao')
        throw new Error('输入编辑器初始值不正确');
    });
  }
};
