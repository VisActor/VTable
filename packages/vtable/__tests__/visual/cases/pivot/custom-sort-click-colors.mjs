/**
 * BugServer case IDs: 6581698ceab07e0091708bab
 * 验证目的：透视行维度自定义比较器点击排序，同时两个指标采用独立背景映射。
 * 改写：地域与销售示例替换为固定 A/B/C 分类和整数，保留 sortFunc、双指标映射及点击动作。
 */
export default {
  mount(container) {
    // 三个城市值故意不按名称排列，使初始排序和点击后的变化可观察。
    return new window.VTable.PivotTable(container, {
      rows: [{ dimensionKey: 'region', title: 'Region' }, { dimensionKey: 'city', title: 'City', sort: true }],
      columns: ['category', 'sub'], indicators: ['amount', 'count'], indicatorsAsCol: false,
      enableDataAnalysis: true, corner: { titleOnDimension: 'row' },
      dataConfig: {
        sortRules: [{ sortField: 'city', sortType: window.VTable.TYPES.SortType.ASC,
          sortFunc: (a, b, type) => String(a).localeCompare(String(b)) * (type === 'DESC' ? -1 : 1) }],
        mappingRules: [
          { bgColor: { indicatorKey: 'amount', mapping: ({ value }) => value >= 20 ? '#ffd6d6' : '#ffffff' } },
          { bgColor: { indicatorKey: 'count', mapping: ({ value }) => value >= 2 ? '#d6f5df' : '#ffffff' } }
        ]
      },
      records: [
        { region: 'R', city: 'B', category: 'X', sub: 'Y', amount: 20, count: 2 },
        { region: 'R', city: 'C', category: 'X', sub: 'Y', amount: 30, count: 3 },
        { region: 'R', city: 'A', category: 'X', sub: 'Y', amount: 10, count: 1 }
      ]
    });
  },
  async exercise(page) {
    // 查找真实排序图标并点击一次，避免直接改状态掩盖交互问题。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const labels = Array.from({ length: table.rowCount }, (_, row) => table.getCellValue(1, row));
      window.__initialCityOrder = ['A', 'B', 'C'].map(value => labels.indexOf(value)).join(',');
      const host = document.getElementById('table').getBoundingClientRect();
      for (let row = 0; row < table.rowCount; row++) {
        for (let col = 0; col < table.colCount; col++) {
          const stack = [table.scenegraph.getCell(col, row)];
          while (stack.length) {
            const mark = stack.pop();
            if (mark?.attribute?.funcType === 'sort') {
              const b = mark.globalAABBBounds;
              return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
            }
            stack.push(...(mark?.children ?? []));
          }
        }
      }
      throw new Error('透视城市排序图标不存在');
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 点击后城市行顺序必须变化，且两个指标值仍可读取，截图验证独立着色。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const labels = Array.from({ length: table.rowCount }, (_, row) => table.getCellValue(1, row));
      const positions = ['A', 'B', 'C'].map(value => labels.indexOf(value));
      if (positions.some(index => index < 0) || positions.join(',') === window.__initialCityOrder)
        throw new Error(`透视自定义排序未改变城市顺序：${labels}`);
      if (!Array.from({ length: table.rowCount }, (_, row) =>
        Array.from({ length: table.colCount }, (_, col) => table.getCellValue(col, row)))
        .flat().some(value => value === 30))
        throw new Error('排序后指标值丢失');
    });
  }
};
