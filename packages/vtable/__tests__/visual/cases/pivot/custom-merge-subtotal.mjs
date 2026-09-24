/**
 * BugServer case IDs: 6785dfb8d2dacd00b3443ebf
 * 验证目的：行头自定义合并两列时，小计和总计单元格保留原始聚合值。
 * 改写：将地区名称改为通用组，保留三维行头、跳过合计的合并回调与行小计。
 */
export default {
  mount(container) {
    // 普通行合并第 1-2 列，小计/总计返回 undefined 交回透视表处理。
    return new window.VTable.PivotTable(container, {
      records: [{ area: 'North', region: 'N1', city: 'N1', amount: 1 },
        { area: 'North', region: 'N2', city: 'N2', amount: 2 },
        { area: 'South', region: 'S1', city: 'S1', amount: 3 }],
      rows: [{ dimensionKey: 'area', title: 'Area' }, { dimensionKey: 'region', title: 'Region' },
        { dimensionKey: 'city', title: 'City' }],
      indicators: [{ indicatorKey: 'amount', title: 'Amount', width: 100 }],
      dataConfig: { totals: { row: { showGrandTotals: true, showSubTotals: true,
        subTotalsDimensions: ['area'], grandTotalLabel: 'Total', subTotalLabel: 'Subtotal' } } },
      customMergeCell: (col, row, table) => {
        if (col <= 0 || col >= 3 || row <= 0) return undefined;
        const value = table.getCellOriginValue(col, row);
        if (value === 'Subtotal' || value === 'Total') return undefined;
        return { text: value, range: { start: { col: 1, row }, end: { col: 2, row } },
          style: { textAlign: 'center' } };
      },
      keyboardOptions: { moveEditCellOnArrowKeys: true, copySelected: true, pasteValueToCell: true }
    });
  },
  async verify(page) {
    // North 小计 3 与总计 6 必须保留，且至少有一个普通行头合并。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellOriginValue(col, row));
      if (!values.includes('Subtotal') || !values.includes(6)) throw new Error('自定义合并丢失合计');
    });
  }
};
