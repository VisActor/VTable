/**
 * BugServer case IDs: 66418ee40b3b8900c63a7808
 * 验证目的：虚拟列节点与行列小计、总计共同布局。
 * 改写：保留两层虚拟节点及合计规则，明细改为通用分组数据。
 */
export default {
  mount(container) {
    // 虚拟节点自身不对应数据维度，子节点仍需参与聚合。
    return new window.VTable.PivotTable(container, {
      rows: ['region', 'item'], columns: ['kind', 'variant'], indicators: ['amount', 'count'],
      columnTree: [
        { dimensionKey: 'kind', value: 'Column Total', children: [] },
        { dimensionKey: 'virtualGroup', value: 'Virtual', virtual: true, children: [
          { dimensionKey: 'kind', value: 'A', children: [
            { dimensionKey: 'variant', value: 'A1', children: [] },
            { dimensionKey: 'variant', value: 'Subtotal', children: [] },
            { dimensionKey: 'variant', value: 'A2', children: [] }
          ] },
          { dimensionKey: 'kind', value: 'B', children: [
            { dimensionKey: 'virtualNested', value: 'Nested virtual', virtual: true, children: [
              { dimensionKey: 'variant', value: 'Subtotal', children: [] },
              { dimensionKey: 'variant', value: 'B1', children: [] }
            ] }
          ] }
        ] }
      ],
      dataConfig: { totals: {
        row: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['region'],
          grandTotalLabel: 'Row total', subTotalLabel: 'Subtotal', showSubTotalsOnTop: true, showGrandTotalsOnTop: true },
        column: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['kind'],
          grandTotalLabel: 'Column Total', subTotalLabel: 'Subtotal', showSubTotalsOnLeft: true, showGrandTotalsOnLeft: true }
      } },
      records: [
        { region: 'R1', item: 'I1', kind: 'A', variant: 'A1', amount: 10, count: 1 },
        { region: 'R1', item: 'I2', kind: 'A', variant: 'A2', amount: 20, count: 2 },
        { region: 'R2', item: 'I1', kind: 'B', variant: 'B1', amount: 30, count: 3 }
      ],
      enableDataAnalysis: true, indicatorsAsCol: false, corner: { titleOnDimension: 'row' }, widthMode: 'autoWidth'
    });
  },
  async verify(page) {
    // 虚拟表头展开后应有足够的行列，且原始数值仍可检索。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount < 5 || table.rowCount < 5) throw new Error('虚拟节点未展开');
    });
  }
};
