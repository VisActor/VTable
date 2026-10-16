/**
 * BugServer case IDs: 64745bc55d221c008666ee23
 * 验证目的：setRecords 的初始降序状态与自定义比较器共同排序。
 * 改写：缩减不影响排序的展示列，保留 name 排序事件的拦截回调。
 */
export default {
  mount(container) {
    // 来源按 id 降序设置记录，并阻止 name 列的排序点击。
    const table = new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150,
          fieldFormat: record => `Completed ${record.progress}%` },
        { field: 'id', title: 'ID', width: 100,
          sort: (a, b, order) => order === 'desc' ? b - a : a - b },
        { field: 'name', title: 'Name', width: 150, sort: true }
      ],
      records: [], widthMode: 'standard', allowFrozenColCount: 2
    });
    table.setRecords([
      { id: 1, progress: 100, name: 'A' }, { id: 2, progress: 80, name: 'B' },
      { id: 3, progress: 1, name: 'C' }, { id: 4, progress: 55, name: 'D' },
      { id: 5, progress: 28, name: 'E' }
    ], { field: 'id', order: 'desc' });
    table.on('sort_click', args => { if (args.field === 'name') return false; });
    return table;
  },
  async verify(page) {
    // 直接检查可见首尾记录顺序。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellOriginValue(1, 1) !== 5 || table.getCellOriginValue(1, 5) !== 1)
        throw new Error('初始降序未生效');
    });
  }
};
