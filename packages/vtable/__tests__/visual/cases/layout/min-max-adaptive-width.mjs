/**
 * BugServer case IDs: 66f28be2885776011c598a30
 * 验证目的：自适应列宽同时遵守各列的 minWidth 和 maxWidth。
 * 改写：使用短文本和长文本的固定记录，去除来源的大型样式及数据。
 */
export default {
  mount(container) {
    // 三列均允许自动测量，但宽度应在 100px 至 150px 之间。
    container.style.width = '430px';
    container.style.height = '300px';
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'short', title: 'Short', width: 'auto', minWidth: 100, maxWidth: 150 },
        { field: 'long', title: 'Long label', width: 'auto', minWidth: 100, maxWidth: 150 },
        { field: 'mixed', title: 'Mixed', width: 'auto', minWidth: 100, maxWidth: 150 }
      ],
      records: [
        { short: 'A', long: 'A deliberately long text value for auto width', mixed: 'B' },
        { short: 'C', long: 'Another long text value', mixed: 'D' }
      ],
      widthMode: 'adaptive', heightMode: 'autoHeight', autoWrapText: true
    });
  },
  async verify(page) {
    // 实际计算后的三列宽度必须同时满足上下限。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const widths = [0, 1, 2].map(col => table.getColWidth(col));
      if (widths.some(width => width < 100 || width > 150))
        throw new Error(`自适应列宽越界：${JSON.stringify(widths)}`);
    });
  }
};
