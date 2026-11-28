/**
 * 验证目的：聚合透视表连续懒加载后，过滤与清除过滤保留新增叶节点的值。
 */
export default {
  mount(container) {
    const VTable = window.VTable;
    const table = new VTable.PivotTable(container, {
      records: [{ category: 'A', sales: 30 }, { category: 'B', sales: 40 }],
      rows: ['category', 'subcategory'], columns: [], indicators: ['sales'],
      rowTree: [
        { dimensionKey: 'category', value: 'A', children: true },
        { dimensionKey: 'category', value: 'B', children: true }
      ],
      rowHierarchyType: 'tree',
      dataConfig: {
        aggregationRules: [{ indicatorKey: 'sales', field: 'sales', aggregationType: VTable.TYPES.AggregationType.SUM }]
      }
    });
    table.on(VTable.PivotTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
      if (args.hierarchyState !== VTable.TYPES.HierarchyState.expand || Array.isArray(args.originData.children)) return;
      const category = args.originData.value;
      const values = category === 'A' ? [10, 20] : [15, 25];
      table.setTreeNodeChildren(
        values.map((_, index) => ({ dimensionKey: 'subcategory', value: `${category}${index + 1}` })),
        values.map((sales, index) => ({ category, subcategory: `${category}${index + 1}`, sales })),
        args.col, args.row
      );
    });
    return table;
  },
  async exercise(page) {
    // 真实点击两个展开图标，让事件处理器分别追加两批记录。
    for (const label of ['A', 'B']) {
      const point = await page.evaluate(label => {
        const table = window.__visualTable;
        const row = Array.from({ length: table.rowCount }, (_, index) => index)
          .find(index => table.getCellValue(0, index) === label);
        if (row === undefined) throw new Error(`缺少父节点 ${label}`);
        const bounds = table.getCellRect(0, row).bounds;
        const host = document.getElementById('table').getBoundingClientRect();
        return { x: host.x + bounds.x1 + 23, y: host.y + (bounds.y1 + bounds.y2) / 2 };
      }, label);
      await page.mouse.click(point.x, point.y);
    }
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = () => Object.fromEntries(Array.from({ length: table.rowCount - 1 }, (_, index) => {
        const row = index + 1;
        return [table.getCellValue(0, row), table.getCellOriginValue(1, row)];
      }));
      const loaded = values();
      if (loaded.A1 !== 10 || loaded.A2 !== 20 || loaded.B1 !== 15 || loaded.B2 !== 25)
        throw new Error(`懒加载事件未生成预期数据: ${JSON.stringify(loaded)}`);
      table.updateFilterRules([{ filterFunc: record => record.sales >= 20 }]);
      const filtered = values();
      if (filtered.A1 !== undefined || filtered.B1 !== undefined || filtered.A2 !== 20 || filtered.B2 !== 25)
        throw new Error(`过滤后新增叶节点的值错误: ${JSON.stringify(filtered)}`);
      table.updateFilterRules([]);
    });
  },
  async verify(page) {
    // 清除过滤后两批叶节点与既有父节点都应保持原值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const actual = Object.fromEntries(Array.from({ length: table.rowCount - 1 }, (_, index) => {
        const row = index + 1;
        return [table.getCellValue(0, row), table.getCellOriginValue(1, row)];
      }));
      const expected = { A: 30, A1: 10, A2: 20, B: 40, B1: 15, B2: 25 };
      if (!Object.entries(expected).every(([key, value]) => actual[key] === value))
        throw new Error(`清除过滤后数据丢失: ${JSON.stringify(actual)}`);
    });
  }
};
