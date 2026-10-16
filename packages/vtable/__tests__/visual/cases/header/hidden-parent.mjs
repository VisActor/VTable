/**
 * BugServer case IDs: 68998fa58af47900b375bcd4
 * 验证目的：隐藏三级分组的父节点后，同字段的独立列仍可见。
 * 改写：保留父节点 hide、重复 name2 字段和三层嵌套，缩短记录。
 */
export default {
  mount(container) {
    // 隐藏整棵分组树，独立列复用被隐藏分组中的字段。
    return new window.VTable.ListTable(container, {
      columns: [{ title: 'Name', hide: true, columns: [{ title: 'name-level-2', columns: [
        { field: 'name2', title: 'name2', width: 100 }, { field: 'name3', title: 'name3', width: 150 }
      ] }] }, { field: 'name2', title: 'name2', width: 100 }],
      records: [{ name2: 'a2', name3: 'a3' }, { name2: 'b2', name3: 'b3' }],
      widthMode: 'standard', autoWrapText: true, autoRowHeight: true
    });
  },
  async verify(page) {
    // 隐藏父组后只显示独立 name2 列。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 1 || table.getCellValue(0, table.columnHeaderLevelCount) !== 'a2')
        throw new Error('隐藏父表头后独立列未保留');
    });
  }
};
