/**
 * BugServer case IDs: 65be113cce3320008eecf686
 * 验证目的：透视排序图标点击后，updateSortRules 同时替换行维度和列维度规则。
 * 改写：地域和品类均换成匿名维度，保留双指标、层级、总计及规则更新。
 */
export default {
  mount(container) {
    // 初始按 Amount 降序排列区域；三条记录使更新为升序后顺序可见。
    const table = new window.VTable.PivotTable(container, {
      rows: [{ dimensionKey: 'region', title: 'Region', sort: true },
        { dimensionKey: 'city', title: 'City', sort: true }],
      columns: ['category', { dimensionKey: 'variant', title: 'Variant', sort: true }],
      indicators: ['amount', 'count'], indicatorsAsCol: true,
      enableDataAnalysis: true, corner: { titleOnDimension: 'all' },
      dataConfig: {
        sortRules: [{ sortField: 'region', sortByIndicator: 'amount',
          sortType: window.VTable.TYPES.SortType.DESC, query: ['X', 'X1'] }],
        totals: { row: { subTotalsDimensions: ['region'] } }
      },
      records: [
        { region: 'R1', city: 'A', category: 'X', variant: 'X1', amount: 30, count: 3 },
        { region: 'R1', city: 'B', category: 'X', variant: 'X1', amount: 20, count: 2 },
        { region: 'R2', city: 'C', category: 'X', variant: 'X1', amount: 5, count: 1 },
        { region: 'R1', city: 'A', category: 'X', variant: 'X2', amount: 40, count: 4 },
        { region: 'R2', city: 'C', category: 'X', variant: 'X2', amount: 10, count: 2 }
      ], widthMode: 'autoWidth'
    });
    window.__pivotSortClicks = 0;
    table.on('pivot_sort_click', () => { window.__pivotSortClicks++; });
    return table;
  },
  async exercise(page) {
    // 点击真实透视排序图标后再通过公开 API 替换两条规则。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      for (let row = 0; row < table.rowCount; row++) {
        for (let col = 0; col < table.colCount; col++) {
          const stack = [table.scenegraph.getCell(col, row)];
          while (stack.length) {
            const mark = stack.pop();
            if (mark?.attribute?.funcType === 'sort') {
              const b = mark.globalAABBBounds;
              return { x: host.x + (b.x1 + b.x2) / 2,
                y: host.y + (b.y1 + b.y2) / 2 };
            }
            stack.push(...(mark?.children ?? []));
          }
        }
      }
      throw new Error('透视排序图标缺失');
    });
    await page.mouse.click(point.x, point.y);
    await page.evaluate(() => {
      window.__visualTable.updateSortRules([
        { sortField: 'region', sortByIndicator: 'amount',
          sortType: window.VTable.TYPES.SortType.ASC, query: ['X', 'X1'] },
        { sortField: 'variant', sortByIndicator: 'amount',
          sortType: window.VTable.TYPES.SortType.DESC, query: ['R1', 'A'] }
      ]);
    });
  },
  async verify(page) {
    // 升序后较小值区域 R2 必须早于 R1，并且点击事件已触发。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const labels = Array.from({ length: table.rowCount }, (_, row) => table.getCellValue(0, row));
      const r2 = labels.indexOf('R2');
      const r1 = labels.indexOf('R1');
      if (window.__pivotSortClicks < 1 || r2 < 0 || r1 < 0 || r2 >= r1)
        throw new Error(`透视排序规则未更新：${JSON.stringify({ clicks: window.__pivotSortClicks, labels })}`);
    });
  }
};
