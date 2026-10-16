/**
 * BugServer case IDs: 677398b4d2dacd00b3443e9d
 * 验证目的：三级分组表头的末级列全部隐藏后，其余表头与数据仍可见。
 * 改写：缩减重复记录，保留两级嵌套和两个 hide 末级列。
 */
export default {
  mount(container) {
    // 同一分组下保留可见列与全隐藏子分组。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 }, { title: 'Name', columns: [
        { field: 'first', title: 'First', width: 100 }, { title: 'Hidden group', columns: [
          { field: 'second', title: 'Second', width: 100, hide: true },
          { field: 'third', title: 'Third', width: 150, hide: true }
        ] }
      ] }],
      records: [{ id: 1, first: 'A', second: 'B', third: 'C' }, { id: 2, first: 'D', second: 'E', third: 'F' }],
      widthMode: 'standard', autoWrapText: true, autoRowHeight: true, defaultColWidth: 150
    });
  },
  async verify(page) {
    // 只剩 ID 与 First 两个可见末级列。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 2 || !String(table.getCellValue(1, table.columnHeaderLevelCount)).includes('A'))
        throw new Error('嵌套隐藏表头未生效');
    });
  }
};
