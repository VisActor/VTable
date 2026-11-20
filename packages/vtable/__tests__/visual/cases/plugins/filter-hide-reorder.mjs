/**
 * BugServer case IDs: 6a0c22678e0a21005e44ed8a
 * 验证目的：FilterPlugin 与隐藏列、移动表头连续执行后筛选结果仍正确。
 * 改写：来源的人事字段及示例姓名改为通用项，保留三步调用顺序。
 */
export default {
  mount(container) {
    // 记录包含两种保留状态与一种剔除状态，验证插件筛选生效。
    const filter = new window.VTable.plugins.FilterPlugin({});
    const table = new window.VTable.ListTable(container, {
      columns: [
        { field: 'id', title: 'ID', width: 80, sort: true },
        { field: 'name', title: 'Name', width: 120, sort: true },
        { field: 'group', title: 'Group', width: 100 },
        { field: 'city', title: 'City', width: 120 },
        { field: 'status', title: 'Status', width: 120 }
      ],
      records: [
        { id: 1, name: 'A', group: 'G1', city: 'North', status: 'Active' },
        { id: 2, name: 'B', group: 'G2', city: 'South', status: 'Leave' },
        { id: 3, name: 'C', group: 'G1', city: 'East', status: 'Active' },
        { id: 4, name: 'D', group: 'G2', city: 'West', status: 'Inactive' }
      ],
      padding: 10, dragHeaderMode: 'all', plugins: [filter]
    });
    const nextColumns = table.columns.map(column => ({ ...column, ...(column.field === 'group' ? { hide: true } : {}) }));
    table.updateColumns(nextColumns, { clearRowHeightCache: false });
    const city = table.columns.findIndex(column => column.field === 'city');
    const name = table.columns.findIndex(column => column.field === 'name');
    table.changeHeaderPosition({ source: { col: city, row: 0 }, target: { col: name + 1, row: 0 }, movingColumnOrRow: 'column' });
    filter.applyFilterSnapshot({ filters: [{ field: 'status', type: 'byValue', values: ['Active', 'Leave'], enable: true }] });
    return table;
  },
  async verify(page) {
    // 验证筛选剔除了目标记录，且隐藏列及表头移动调用未丢失。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const records = table.getFilteredRecords();
      if (records.length !== 3 || records.some(record => record.status === 'Inactive'))
        throw new Error('插件筛选结果错误');
      if (!table.columns.some(column => column.field === 'group' && column.hide))
        throw new Error('隐藏列未保留');
      if (table.columns.findIndex(column => column.field === 'city') <= table.columns.findIndex(column => column.field === 'name'))
        throw new Error('表头移动未保留');
    });
  }
};
