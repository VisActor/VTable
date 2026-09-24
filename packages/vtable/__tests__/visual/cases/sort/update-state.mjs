/**
 * BugServer case IDs: 65c086ce97cc3d008de5b482
 * 验证目的：setRecords 降序后通过 updateSortState 切换到升序。
 * 改写：仅保留排序列与固定数值，避免重复的展示字段。
 */
export default {
  mount(container) {
    // 两次排序调用顺序与来源一致，结果首行应为最小值。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, sort: true },
        { field: 'name', title: 'Name', width: 150 }], widthMode: 'standard'
    });
    table.setRecords([{ progress: 100, name: 'A' }, { progress: 80, name: 'B' },
      { progress: 1, name: 'C' }], { field: 'progress', order: 'desc' });
    table.updateSortState({ field: 'progress', order: 'asc' });
    return table;
  },
  async verify(page) {
    // 最终排序后的第一条记录须是数值 1。
    await page.evaluate(() => {
      if (window.__visualTable.getCellValue(0, 1) !== 1) throw new Error('排序状态未更新');
    });
  }
};
