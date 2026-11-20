/**
 * BugServer case IDs: 69d89a775bd8c7005e123da1
 * 验证目的：小数数据的 AVG 与顶部 SUM 聚合在同一列表中显示。
 * 改写：原例的未声明变量和错误释放调用改为直接返回实例。
 */
export default {
  mount(container) {
    // 用 0.1 与 0.2 触发浮点聚合，保留顶部和底部聚合位置。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'value', title: 'Value', width: 120, aggregation: [
        { aggregationType: window.VTable.TYPES.AggregationType.AVG },
        { aggregationType: window.VTable.TYPES.AggregationType.SUM, showOnTop: true }
      ] }],
      records: [{ value: 0.1 }, { value: 0.2 }],
      bottomFrozenRowCount: 3, widthMode: 'autoWidth', heightMode: 'autoHeight', autoWrapText: true
    });
  },
  async verify(page) {
    // 小数记录和聚合行均存在，外观及聚合文本交给截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount < 5 || table.getCellOriginValue(0, 2) !== 0.1)
        throw new Error('聚合行或小数记录缺失');
    });
  }
};
