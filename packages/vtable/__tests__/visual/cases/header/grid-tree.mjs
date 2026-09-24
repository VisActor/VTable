/**
 * BugServer case IDs: 67f33ab520aeff00a653bc6c
 * 验证目的：普通列表中的 grid-tree 分组表头正常排列。
 * 改写：个人姓名、电话和邮箱改为通用字段，保留分组列和层级配置。
 */
export default {
  mount(container) {
    // 顶层列与双子列并列，启用可拖动的 grid-tree 表头。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'code', title: 'Code', width: 120 },
        { title: 'Group', field: 'group', columns: [
          { field: 'first', title: 'First', width: 120 },
          { field: 'last', title: 'Last', width: 120 }] },
        { field: 'city', title: 'City', width: 120 }],
      records: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, code: `C${i + 1}`,
        first: `First ${i + 1}`, last: `Last ${i + 1}`, city: 'City' })),
      defaultColWidth: 120, headerHierarchyType: 'grid-tree', widthMode: 'standard',
      dragHeaderMode: 'all', limitMinWidth: 20,
      theme: window.VTable.themes.DEFAULT.extends({ headerStyle: { color: 'red',
        frameStyle: { borderColor: 'red', borderLineWidth: 2 } } })
    });
  },
  async verify(page) {
    // grid-tree 将分组子列折叠为一列，并保留全部记录。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.options.headerHierarchyType !== 'grid-tree' || table.colCount !== 4 || table.rowCount < 11)
        throw new Error(`grid-tree 分组表头未正确建立: ${JSON.stringify({ type: table.options.headerHierarchyType, cols: table.colCount, rows: table.rowCount })}`);
    });
  }
};
