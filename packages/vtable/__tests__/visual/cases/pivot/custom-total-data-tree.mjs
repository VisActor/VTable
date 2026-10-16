/**
 * BugServer case IDs: 652e02311dd15a4ab522f753
 * 验证目的：带显式行列汇总记录的树形透视表仍能展开并显示汇总值。
 * 改写：原地区商品明细换成固定 A/B 分类，保留缺维度汇总行和树展开动作。
 */
export default {
  mount(container) {
    // 缺失部分维度的记录代表外部传入的小计和总计。
    container.style.height = '400px';
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'], columns: ['type', 'subtype'],
      indicators: ['amount', 'count'], indicatorsAsCol: true,
      enableDataAnalysis: true, rowHierarchyType: 'tree', rowExpandLevel: 1,
      dataConfig: { totals: {
        row: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['group', 'item'] },
        column: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['type'] }
      } },
      records: [
        { amount: 111, count: 10 },
        { group: 'A', amount: 55, count: 5 },
        { group: 'A', type: 'X', amount: 30, count: 3 },
        { type: 'X', subtype: 'X1', amount: 45, count: 4 },
        { group: 'A', item: 'A1', type: 'X', subtype: 'X1', amount: 12, count: 1 },
        { group: 'A', item: 'A2', type: 'X', subtype: 'X1', amount: 18, count: 2 },
        { group: 'B', item: 'B1', type: 'Y', subtype: 'Y1', amount: 25, count: 3 }
      ], widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 定位 A 行的树图标并展开子项。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const row = Array.from({ length: table.rowCount }, (_, i) => i)
        .find(i => table.getCellValue(0, i) === 'A');
      if (row === undefined || table.getHierarchyState(0, row) !== 'collapse')
        throw new Error('A 组不是可展开树节点');
      const b = table.getCellRect(0, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x1 + 23, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // A 组展开且显式总计 111 进入可见透视值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const row = Array.from({ length: table.rowCount }, (_, i) => i)
        .find(i => table.getCellValue(0, i) === 'A');
      const values = [];
      for (let y = 0; y < table.rowCount; y++)
        for (let x = 0; x < table.colCount; x++) values.push(table.getCellOriginValue(x, y));
      if (row === undefined || table.getHierarchyState(0, row) !== 'expand' || !values.includes(111))
        throw new Error('树形小计展开或显式总计缺失');
    });
  }
};
