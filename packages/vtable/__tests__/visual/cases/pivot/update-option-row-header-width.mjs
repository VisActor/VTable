/**
 * BugServer case IDs: 6a95269bcf3b32005d0b9b74
 * 验证目的：grid-tree 透视表 updateOption 后，四级行表头列宽不回退到默认值。
 * 改写：压缩重复记录和状态标签，保留相同配置更新及列宽前后比较。
 */
export default {
  mount(container) {
    // 四级行维度和行列合计共同触发行头宽度重算路径。
    container.style.height = '500px';
    const option = {
      records: [{ year: '2022', region: 'East', segment: 'Consumer', mode: 'First', category: 'A', item: 'A1', sales: 891, profit: 112 },
        { year: '2022', region: 'East', segment: 'Corporate', mode: 'Second', category: 'A', item: 'A2', sales: 496, profit: 48 },
        { year: '2023', region: 'West', segment: 'Consumer', mode: 'Standard', category: 'B', item: 'B1', sales: 895, profit: 152 }],
      rows: ['year', 'region', 'segment', 'mode'], columns: ['category', 'item'],
      indicators: ['sales', 'profit'], enableDataAnalysis: true, indicatorTitle: 'Indicators',
      rowExpandLevel: Infinity, defaultColWidth: 120, defaultRowHeight: 32,
      widthMode: 'standard', heightMode: 'standard',
      rowHierarchyType: 'grid-tree', columnHierarchyType: 'grid-tree',
      corner: { titleOnDimension: 'column' },
      dataConfig: { totals: { row: { showGrandTotals: true, showSubTotals: true,
        subTotalsDimensions: ['year', 'region', 'segment'], grandTotalLabel: 'Total', subTotalLabel: 'Subtotal' },
      column: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['category'],
        grandTotalLabel: 'Total', subTotalLabel: 'Subtotal' } } }
    };
    const table = new window.VTable.PivotTable(container, option);
    window.__beforeWidths = [0, 1, 2, 3].map(col => table.getColWidth(col));
    table.updateOption(option, { clearColWidthCache: false });
    return table;
  },
  async verify(page) {
    // 更新后的行头宽度应与更新前一致且不会全回退到 80。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const after = [0, 1, 2, 3].map(col => table.getColWidth(col));
      if (after.some((width, i) => Math.abs(width - window.__beforeWidths[i]) > 1) ||
        after.every(width => Math.round(width) === 80))
        throw new Error(`行头宽度更新异常: ${window.__beforeWidths} => ${after}`);
    });
  }
};
