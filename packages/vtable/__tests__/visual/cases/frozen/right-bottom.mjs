/**
 * BugServer case IDs: 65e1837e7c3a0c00c99f2c4a
 * 验证目的：左右冻结列与底部冻结行同时配置时可绘制。
 * 改写：原例的订单字段换成普通编号；保留左右冻结计数重叠的边界条件。
 */
export default {
  mount(container) {
    // 两列共用字段，左冻一列、右冻两列覆盖来源边界组合。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 'auto', sort: true },
        { field: 'id', title: 'ID copy', width: 'auto', sort: true }],
      records: [{ id: 'A-001' }], frozenColCount: 1, rightFrozenColCount: 2,
      bottomFrozenRowCount: 1, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 冻结交叠不应损坏唯一记录或表格尺寸。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== 'A-001' || table.colCount !== 2) throw new Error('冻结列绘制异常');
    });
  }
};
