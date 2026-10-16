/**
 * BugServer case IDs: 67f3395770dedf00a7f03228
 * 验证目的：grid-tree 分组表头与 transpose 同时启用时保持层级。
 * 改写：个人信息改为通用字段，保留转置、层级、默认表头宽度与拖动配置。
 */
export default {
  mount(container) {
    // 与非转置版本使用相同的分组列，单独覆盖转置布局。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'code', title: 'Code', width: 120 },
        { title: 'Group', field: 'group', columns: [
          { field: 'first', title: 'First', width: 120 },
          { field: 'last', title: 'Last', width: 120 }] },
        { field: 'city', title: 'City', width: 120 }],
      records: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, code: `C${i + 1}`,
        first: `First ${i + 1}`, last: `Last ${i + 1}`, city: 'City' })),
      defaultHeaderColWidth: 130, headerHierarchyType: 'grid-tree', transpose: true,
      widthMode: 'standard', dragHeaderMode: 'all', limitMinWidth: 20,
      theme: window.VTable.themes.DEFAULT.extends({ headerStyle: { color: 'red',
        frameStyle: { borderColor: 'red', borderLineWidth: 2 } } })
    });
  },
  async verify(page) {
    // 转置配置必须生效并生成可读数据区。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (!table.options.transpose || table.options.headerHierarchyType !== 'grid-tree' ||
        table.colCount < 10 || table.rowCount < 4)
        throw new Error('转置 grid-tree 表头未正确建立');
    });
  }
};
