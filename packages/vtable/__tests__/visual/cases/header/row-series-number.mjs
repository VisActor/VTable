/**
 * BugServer case IDs: 66c56702c3ab4200c6b4fe01
 * 验证目的：仅开启行序号列时仍能渲染并显示连续序号。
 * 改写：原例中的人物记录替换为固定通用记录，保留序号拖动配置。
 */
export default {
  mount(container) {
    // 不配置普通数据列，保留来源的只有行序号列这一边界。
    return new window.VTable.ListTable(container, {
      records: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
      dragHeaderMode: 'column',
      rowSeriesNumber: { enable: true, title: 'No.', field: 'name', dragOrder: true, style: { color: 'red' } }
    });
  },
  async verify(page) {
    // 序号列必须有实际数据单元格和有效布局。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount < 1 || table.rowCount < 4) throw new Error('序号列未创建');
      const range = table.getCellRect(0, 1)?.bounds;
      if (!range || range.x2 <= range.x1) throw new Error('序号列未布局');
    });
  }
};
