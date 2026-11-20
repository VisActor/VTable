/**
 * BugServer case IDs: 65c0882697cc3d008de5b483
 * 验证目的：列允许排序但 showSort=false 时，初始降序数据保持可读且排序图标隐藏。
 * 改写：保留 sort 与 showSort 的冲突组合，去掉重复的说明列。
 */
export default {
  mount(container) {
    // 排序能力和图标可见性分别配置，视觉断言依赖截图。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, sort: true, showSort: false },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'name', title: 'Name', width: 150, sort: true }], widthMode: 'standard'
    });
    table.setRecords([{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' },
      { progress: 1, id: 3, name: 'C' }], { field: 'progress', order: 'desc' });
    return table;
  },
  async verify(page) {
    // 数据确实按 progress 降序，而图标是否隐藏由稳定截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== 100 || table.getCellValue(0, 3) !== 1)
        throw new Error('隐藏排序图标场景排序失败');
    });
  }
};
