/**
 * BugServer case IDs: 65adebb6af6266008c860c51
 * 验证目的：唯一一列配置为左冻结列时，表格仍能绘制记录。
 * 改写：保留单列、showPin 与 frozenColCount=1；名称改为通用值。
 */
export default {
  mount(container) {
    // 单列表格不能借其他非冻结列掩盖边界问题。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 }],
      records: [{ id: 1 }], showPin: true, widthMode: 'standard', frozenColCount: 1
    });
  },
  async verify(page) {
    // 验证唯一数据格仍可访问且原始左冻结配置仍被保留。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 1 || table.getCellValue(0, 1) !== 1 || table.options.frozenColCount !== 1)
        throw new Error('单列左冻结配置或绘制失效');
    });
  }
};
