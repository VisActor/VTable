/**
 * BugServer case IDs: 65ed9e7aa5483e00afa5869c
 * 验证目的：同值合并、SUM 聚合和每页两条记录的分页共同显示。
 * 改写：商品名称换成通用项，保留来源的 100/1/1/2/2/2 数值关系。
 */
export default {
  mount(container) {
    // 固定六条记录，第一页包含 100 与 1，聚合总和可见。
    return new window.VTable.ListTable(container, {
      records: [100, 1, 1, 2, 2, 2].map((price, index) => ({ area: 'A', product: `Item ${index + 1}`, price })),
      columns: [
        { field: 'area', title: 'Area', width: 'auto', mergeCell: true,
          aggregation: [{ aggregationType: window.VTable.TYPES.AggregationType.NONE, formatFun: () => 'Total' }] },
        { field: 'product', title: 'Product', width: 'auto' },
        { field: 'price', title: 'Price', width: 'auto',
          aggregation: [{ aggregationType: window.VTable.TYPES.AggregationType.SUM,
            formatFun: value => Math.round(value) }] }
      ],
      widthMode: 'standard', pagination: { perPageCount: 2, currentPage: 0 }
    });
  },
  async verify(page) {
    // 检查分页数据与数值聚合在可见表格中出现。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellValue(col, row));
      if (!values.includes('Item 1') || !values.includes('Item 2') || values.includes('Item 3'))
        throw new Error('分页记录错误');
      if (!values.some(value => Number(value) === 101 || Number(value) === 108))
        throw new Error('SUM 聚合缺失');
    });
  }
};
