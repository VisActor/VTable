/**
 * BugServer case IDs: 665ed085faec2700ad74955b
 * 验证目的：Ctrl/Command+A 选中表体时，disableHeaderSelect 排除表头。
 * 改写：来源虽无 interactions 字段，但源码会自行派发 keydown；保留该事件路径并移除远程编辑器加载。
 */
export default {
  mount(container) {
    // 固定三列与三行，便于检查全选范围的上下边界。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 150 },
        { field: 'date', title: 'Date', width: 150 },
        { field: 'id', title: 'ID', width: 100 }
      ],
      records: [
        { name: 'A', date: '2019-01-01', id: 1 },
        { name: 'B', date: '2020-02-02', id: 2 },
        { name: 'C', date: '2021-03-03', id: 3 }
      ],
      keyboardOptions: { copySelected: true, pasteValueToCell: true,
        selectAllOnCtrlA: { disableHeaderSelect: true } }
    });
  },
  async exercise(page) {
    // 来源先选局部区域，再向表格根元素派发组合键事件。
    await page.evaluate(() => {
      const table = window.__visualTable;
      table.selectCells([{ start: { col: 0, row: 2 }, end: { col: 2, row: 3 } }]);
      table.getElement().tabIndex = 0;
      table.getElement().focus();
      const event = document.createEvent('Event');
      event.initEvent('keydown', true, false);
      Object.assign(event, { ctrlKey: true, metaKey: true, altKey: true,
        which: 67, keyCode: 67, key: 'a', code: 'KeyA' });
      table.getElement().dispatchEvent(event);
    });
  },
  async verify(page) {
    // 全选覆盖表体首末行，且任一范围都不含第零行表头。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const ranges = table.getSelectedCellRanges();
      if (ranges.length !== 1 || ranges[0].start.row !== 1 || ranges[0].end.row !== table.rowCount - 1)
        throw new Error(`Ctrl/Command+A 未选中完整表体：${JSON.stringify(ranges)}`);
    });
  }
};
