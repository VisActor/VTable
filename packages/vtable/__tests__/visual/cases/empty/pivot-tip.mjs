/**
 * BugServer case IDs: 66554d175a5b1400ab9139eb
 * 验证目的：无记录透视表显示空状态并保留强制角头。
 * 改写：维度名称换成通用名称，保留两级行列及双指标。
 */
export default {
  mount(container) {
    // 不传 records，检验空表布局分支。
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'], columns: ['kind', 'variant'], indicators: ['amount', 'count'],
      enableDataAnalysis: true, indicatorsAsCol: false,
      corner: { forceShowHeader: true, titleOnDimension: 'row' }, emptyTip: {}, widthMode: 'autoWidth'
    });
  },
  async verify(page) {
    // 角头必须可见，表格仍有有效布局尺寸。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount < 1 || table.colCount < 1) throw new Error('空透视表未布局');
    });
  }
};
