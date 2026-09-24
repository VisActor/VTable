/**
 * BugServer case IDs: 66f5028c885776011c598a60
 * 验证目的：DARK 主题下的排序、冻结和悬停图标保持可见。
 * 改写：保留 DARK、两列冻结、cross 悬停及自动高度，缩减展示字段。
 */
export default {
  mount(container) {
    // 深色主题和图标相关配置保持在同一固定场景中。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'name', title: 'Name', width: 150, sort: true }],
      records: [100, 80, 1, 55, 28].map((progress, i) => ({ progress, id: i + 1, name: `Name ${i + 1}` })),
      showPin: true, widthMode: 'standard', frozenColCount: 2, allowFrozenColCount: 3,
      theme: window.VTable.themes.DARK, hover: { highlightMode: 'cross', disableHeaderHover: true },
      heightMode: 'autoHeight', autoWrapText: true
    });
  },
  async verify(page) {
    // 深色主题用例必须保留两列数据和冻结配置。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== 100 || table.frozenColCount !== 2)
        throw new Error('深色主题冻结列缺失');
    });
  }
};
