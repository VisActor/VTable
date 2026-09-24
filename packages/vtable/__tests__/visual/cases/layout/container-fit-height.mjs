/**
 * BugServer case IDs: 684bf2cd228c0a00a7015501
 * 验证目的：autoWidth 与 containerFit.height 同时启用时，列表适配容器。
 * 改写：缩减展示字段，保留高度单独适配的对象形式。
 */
export default {
  mount(container) {
    // 明确固定宿主尺寸，触发与普通 autoWidth 不同的高度适配。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100, sort: true }, { field: 'name', title: 'Name', width: 150 }],
      records: [100, 80, 1, 55, 28].map((progress, i) => ({ progress, id: i + 1, name: `Name ${i + 1}` })),
      widthMode: 'autoWidth', containerFit: { height: true }, allowFrozenColCount: 2
    });
  },
  async verify(page) {
    // 记录和配置必须有效，容器适配外观由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 5) !== 28 || table.rowCount !== 6)
        throw new Error('高度适配场景未完成绘制');
    });
  }
};
