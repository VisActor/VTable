/**
 * BugServer case IDs: 684bf27f12d99200a8e2dd42
 * 验证目的：autoWidth 与 containerFit=true 同时启用时宽高都适配固定容器。
 * 改写：保留布尔配置和固定宿主尺寸，缩减重复展示字段。
 */
export default {
  mount(container) {
    // 固定容器后使用布尔适配，区分已有的仅适配高度场景。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'name', title: 'Name', width: 150 }],
      records: [100, 80, 1, 55, 28].map((progress, i) => ({ progress, id: i + 1, name: `Name ${i + 1}` })),
      widthMode: 'autoWidth', containerFit: true, showPin: true, allowFrozenColCount: 2
    });
  },
  async verify(page) {
    // 适配后末条记录和表格宽高都必须有效；具体布局交给截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 5) !== 28 || table.tableNoFrameWidth <= 0 || table.tableNoFrameHeight <= 0)
        throw new Error('布尔 containerFit 适配失败');
    });
  }
};
