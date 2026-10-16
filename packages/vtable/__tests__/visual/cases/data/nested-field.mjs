/**
 * BugServer case IDs: 6720b9ea30877400b3e630d7
 * 验证目的：数组形式字段路径读取嵌套值，缺失路径不使表格失败。
 * 改写：将文字改为通用项，保留第三条缺失嵌套对象。
 */
export default {
  mount(container) {
    // 第三条不包含 type，验证字段路径的缺失值分支。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 120, sort: true },
        { field: 'age', title: 'Age', width: 100, sort: true },
        { field: ['type', 'name'], title: 'Type', width: 130, sort: true }],
      records: [{ name: 'A', age: 12, type: { name: 'One' } },
        { name: 'B', age: 42, type: { name: 'Two' } }, { name: 'C', age: 42 }],
      widthMode: 'standard'
    });
  },
  async verify(page) {
    // 有值与缺值两条路径都应返回预期结果。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(2, 1) !== 'One' || table.getCellValue(2, 3))
        throw new Error('嵌套字段读取错误');
    });
  }
};
