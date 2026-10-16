/**
 * BugServer case IDs: 65be028bce3320008eecf685
 * 验证目的：按指定指标和列路径排序行维度，同时显示该维度的小计。
 * 改写：维度标签改为通用名称，保留两级行列、两指标、query、sortRules 与 subTotalsDimensions。
 */
export default {
  mount(container) {
    // 同一查询路径中给多个区域不同数值，以展示排序与小计。
    return new window.VTable.PivotTable(container, {
      rows: ['region', 'site'], columns: ['category', 'variant'],
      indicators: ['sales', 'number'], enableDataAnalysis: true,
      indicatorsAsCol: true, indicatorTitle: 'Metric',
      dataConfig: { sortRules: [{ sortField: 'region', sortByIndicator: 'sales',
        sortType: window.VTable.TYPES.SortType.ASC, query: ['Type A', 'Variant X'] }],
        totals: { row: { subTotalsDimensions: ['region'] } } },
      corner: { titleOnDimension: 'row' },
      records: [{ sales: 1295, number: 43, region: 'Region A', site: 'Site 1', category: 'Type A', variant: 'Variant X' },
        { sales: 995, number: 53, region: 'Region A', site: 'Site 2', category: 'Type A', variant: 'Variant X' },
        { sales: 1045, number: 33, region: 'Region A', site: 'Site 3', category: 'Type A', variant: 'Variant X' },
        { sales: 792, number: 14, region: 'Region B', site: 'Site 4', category: 'Type A', variant: 'Variant X' },
        { sales: 800, number: 24, region: 'Region C', site: 'Site 5', category: 'Type A', variant: 'Variant X' }],
      widthMode: 'autoWidth'
    });
  },
  async verify(page) {
    // 三个区域和指标小计应使透视行数大于原始五条记录。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount < 8 || table.colCount < 3 || !table.options.dataConfig.totals.row.subTotalsDimensions.includes('region'))
        throw new Error('指标排序与小计场景未建立');
    });
  }
};
