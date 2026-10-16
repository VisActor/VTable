/**
 * BugServer case IDs: 6a83c8713335650068dcf413
 * 验证目的：顶部冻结三行、底部冻结一行时，红色外边框仍连续绘制。
 * 改写：保留冻结数量和四边框配置，使用固定编号数据。
 */
export default {
  mount(container) {
    // 表体与两端冻结区同时可见，边框问题由截图比较发现。
    container.style.height = '500px';
    return new window.VTable.ListTable(container, {
      columns: ['id', 'name', 'city', 'sales', 'profit'].map(field => ({ field, title: field, width: 170 })),
      records: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1, name: `Name ${i + 1}`, city: `City ${i + 1}`, sales: 1000 + i * 100, profit: 120 + i * 10
      })),
      frozenRowCount: 3, bottomFrozenRowCount: 1, widthMode: 'standard',
      theme: { frameStyle: { borderLineWidth: [1, 1, 1, 1], borderColor: 'red' } }
    });
  },
  async verify(page) {
    // 最后冻结行仍指向最后一条记录。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.frozenRowCount !== 3 || table.bottomFrozenRowCount !== 1 || table.getCellValue(0, 6) !== 6)
        throw new Error('上下冻结行边界错误');
    });
  }
};
