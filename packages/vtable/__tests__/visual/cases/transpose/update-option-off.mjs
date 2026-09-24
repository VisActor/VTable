/**
 * BugServer case IDs: 65a60e2cc2cd3f0ae258d5e5
 * 验证目的：先以转置模式设定 100 条记录，再用 updateOption 关闭转置。
 * 改写：保留操作顺序和记录规模，移除无关复杂 SVG 与日期字段。
 */
export default {
  mount(container) {
    // 转置状态下先设置记录，再复用配置对象切回普通表格。
    const option = { columns: [{ field: 'progress', title: 'Progress', width: 120 },
      { field: 'id', title: 'ID', width: 100 }, { field: 'name', title: 'Name', width: 150 }],
      widthMode: 'standard', transpose: true, hover: { highlightMode: 'cross' } };
    const table = new window.VTable.ListTable(container, option);
    table.setRecords(Array.from({ length: 100 }, (_, i) => ({ progress: i, id: i + 1, name: `Name ${i + 1}` })));
    option.transpose = false;
    table.updateOption(option);
    return table;
  },
  async verify(page) {
    // 更新后必须恢复三列一百行的普通表格。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 3 || table.rowCount !== 101 || table.getCellValue(1, 1) !== 1)
        throw new Error('updateOption 未关闭转置');
    });
  }
};
