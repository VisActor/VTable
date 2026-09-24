/**
 * BugServer case IDs: 64bdffe85134109a76ccddd9
 * 验证目的：adaptive 模式将多列分配到容器宽度。
 * 改写：使用通用字段，保留定宽列与 adaptive 模式。
 */
export default {
  mount(container) {
    // 设定小于容器宽度的列宽，让 adaptive 分配剩余空间。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, fieldFormat: r => `${r.progress}%` },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'name', title: 'Name', width: 150 }],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' }],
      widthMode: 'adaptive', allowFrozenColCount: 2
    });
  },
  async verify(page) {
    // 最后一列表头应扩展到接近容器右边界。
    await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(2, 0).bounds;
      if (b.x2 < 700) throw new Error(`adaptive 宽度不足：${b.x2}`);
    });
  }
};
