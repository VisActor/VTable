/**
 * BugServer case IDs: 65c1d09f97cc3d008de5b4bb
 * 验证目的：单元格边框颜色数组与虚线样式同时绘制。
 * 改写：缩小记录和无关列，保留红字、双色边框和 [4,4] 线型。
 */
export default {
  mount(container) {
    // 两条记录足以让虚线与相邻单元格边框进入截图。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150,
        style: { color: 'red', borderColor: ['red', 'green'], borderLineDash: [4, 4] } },
        { field: 'name', title: 'Name', width: 150 }],
      records: [{ progress: 100, name: 'A' }, { progress: 80, name: 'B' }]
    });
  },
  async verify(page) {
    // 读取实际单元格样式，确认虚线配置没有被主题覆盖。
    await page.evaluate(() => {
      const dash = window.__visualTable.getCellStyle(0, 1).borderLineDash;
      if (!Array.isArray(dash) || dash.join(',') !== '4,4') throw new Error('虚线边框配置缺失');
    });
  }
};
