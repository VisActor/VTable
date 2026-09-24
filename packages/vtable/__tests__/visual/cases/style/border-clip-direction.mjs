/**
 * BugServer case IDs: 66e28a3d0eae0a00f267b41e
 * 验证目的：cellBorderClipDirection=bottom-right 与内边框同用时边线不断裂。
 * 改写：删除展示性说明，保留四边红色单元格边框和无外框条件。
 */
export default {
  mount(container) {
    // 相邻多行让边框裁剪方向在截图中有可比差异。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', width: 150,
        fieldFormat: record => `${record.progress}%`, style: { textAlign: 'center', borderColor: ['red', 'red', 'red', 'red'] } }],
      records: [100, 80, 1, 55, 28].map(progress => ({ progress })),
      widthMode: 'standard', theme: {
        frameStyle: { borderLineWidth: 0 }, cellInnerBorder: true,
        cellBorderClipDirection: 'bottom-right'
      }
    });
  },
  async verify(page) {
    // 最小值和最大值进入两端单元格，边线交给截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== '100%' || table.getCellValue(0, 5) !== '28%')
        throw new Error('裁剪边框测试数据缺失');
    });
  }
};
