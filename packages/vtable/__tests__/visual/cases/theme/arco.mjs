/**
 * BugServer case IDs: 647460d15d221c008666ee29
 * 验证目的：ARCO 主题与交叉悬停模式、自动行高共同渲染。
 * 改写：使用通用固定记录，保留主题和相关布局配置。
 */
export default {
  mount(container) {
    // 主题配置由当前侧 VTable bundle 提供，避免外部资源。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 100, id: 1, name: 'A' }, { progress: 80, id: 2, name: 'B' }],
      showPin: true, widthMode: 'standard', allowFrozenColCount: 2,
      theme: window.VTable.themes.ARCO,
      hover: { highlightMode: 'cross', disableHeaderHover: true },
      heightMode: 'autoHeight', autoWrapText: true
    });
  },
  async verify(page) {
    // 验证主题表格完成数据渲染，颜色差异由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(2, 1) !== 'A') throw new Error('ARCO 主题表格数据缺失');
    });
  }
};
