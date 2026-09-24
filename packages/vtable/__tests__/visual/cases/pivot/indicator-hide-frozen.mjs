/**
 * BugServer case IDs: 676a70de0982bf00b14e2316, 654311df0dc4c5635dc0d9ee
 * 验证目的：按列维度隐藏指定指标，同时保留右侧列和底部行冻结。
 * 改写：把来源的多级地区和商品数据缩为两个匿名维度值。
 */
export default {
  mount(container) {
    // B 列的 count 被隐藏，A 列的两个指标仍显示。
    window.__pivotHidePaths = [];
    return new window.VTable.PivotTable(container, {
      rows: ['group'], columns: ['category'], indicatorsAsCol: true,
      indicators: [
        { indicatorKey: 'amount', title: 'Amount' },
        { indicatorKey: 'count', title: 'Count', hide({ dimensionPaths }) {
          const values = dimensionPaths.map(path => path.value);
          window.__pivotHidePaths.push(values);
          return values.includes('B');
        } }
      ],
      records: [
        { group: 'G1', category: 'A', amount: 11, count: 17 },
        { group: 'G1', category: 'B', amount: 23, count: 29 },
        { group: 'G2', category: 'A', amount: 31, count: 37 },
        { group: 'G2', category: 'B', amount: 41, count: 43 }
      ],
      rightFrozenColCount: 1, bottomFrozenRowCount: 1,
      defaultColWidth: 135, defaultHeaderColWidth: 90, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 唯一的 B/count 数值不可见，其余指标与冻结数量必须保留。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellOriginValue(col, row));
      if (![11, 17, 23, 31, 37, 41].every(value => values.includes(value)) ||
          values.includes(29) || values.includes(43))
        throw new Error('透视指标隐藏结果错误');
      if (!window.__pivotHidePaths.some(paths => paths.includes('B')) ||
          table.rightFrozenColCount !== 1 || table.bottomFrozenRowCount !== 1)
        throw new Error('隐藏回调或冻结配置未生效');
    });
  }
};
