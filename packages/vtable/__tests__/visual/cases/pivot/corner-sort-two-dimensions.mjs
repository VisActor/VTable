/**
 * BugServer case IDs: 69d5d380361ead005d3155e3
 * 验证目的：角头启用排序图标时，透视排序状态可指向两级角头维度。
 * 改写：使用固定 A/B 分类与整数指标，保留 showSortInCorner 和 isPivotCorner 路径。
 */
export default {
  mount(container) {
    // 两级行维度与单级列维度共同显示角头排序状态及两个数值指标。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.PivotTable(container, {
      records: [
        { category: 'A', item: 'A1', sales: 100, profit: 10 },
        { category: 'A', item: 'A2', sales: 150, profit: 15 },
        { category: 'B', item: 'B1', sales: 200, profit: 20 },
        { category: 'B', item: 'B2', sales: 250, profit: 25 }
      ],
      rows: [
        { dimensionKey: 'item', title: 'Item', showSortInCorner: true },
        { dimensionKey: 'category', title: 'Category', showSortInCorner: true }
      ],
      columns: [{ dimensionKey: 'category', title: 'Category', showSortInCorner: true }],
      indicators: [
        { indicatorKey: 'sales', title: 'Sales', showSortInCorner: true },
        { indicatorKey: 'profit', title: 'Profit', showSortInCorner: true }
      ],
      corner: { titleOnDimension: 'all' },
      pivotSortState: [{ dimensions: [{ dimensionKey: 'item', isPivotCorner: true },
        { dimensionKey: 'category', isPivotCorner: true }], order: 'desc' }]
    });
  },
  async verify(page) {
    // 角头排序路径和指标值都应被实际透视表接收并绘制。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const state = table.pivotSortState?.[0];
      if (state?.order !== 'desc' || state.dimensions?.length !== 2 ||
        state.dimensions.some(d => !d.isPivotCorner) || table.rowCount < 3)
        throw new Error(`角头排序状态缺失：${JSON.stringify(table.pivotSortState)}`);
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellOriginValue(col, row));
      if (!values.includes(100) || !values.includes(250)) throw new Error('角头排序的指标数据缺失');
    });
  }
};
