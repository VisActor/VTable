/**
 * BugServer case IDs: 65656abf7bb49c240fa99c78
 * 验证目的：悬停状态存在时 updateColumns 增加重复字段列。
 * 改写：展示字段换成通用项，保留更新时机与新增列结构。
 */
export default {
  mount(container) {
    // 先设置悬停位置，再追加第二列同字段 Name。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150 },
        { field: 'id', title: 'ID', width: 100 }, { field: 'name', title: 'Name', width: 150 }],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' }]
    });
    table.stateManager.updateHoverPos(2, 2);
    table.updateColumns([...table.columns, { field: 'name', title: 'Name copy', width: 150 }]);
    return table;
  },
  async verify(page) {
    // 重复字段新列应正确读取原记录。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 4 || table.getCellValue(3, 1) !== 'A') throw new Error('列更新失败');
    });
  }
};
