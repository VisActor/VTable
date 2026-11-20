/**
 * BugServer case IDs: 6787a95e54366a00b133b77a, 6787ae11863ad000b1fc4081
 * 验证目的：两级 groupBy 中按树路径插入和删除记录时分组行保持一致。
 * 改写：去除订单、客户及地址字段，使用固定 A/B 分类和短编号。
 */
export default {
  mount(container) {
    // 相同二级分组有两条记录，供路径插入和删除验证。
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'label', title: 'Item', width: 180 },
        { field: 'value', title: 'Value', width: 120 }],
      records: [
        { category: 'A', sub: 'X', label: 'Item 1', value: 10 },
        { category: 'A', sub: 'X', label: 'Item 2', value: 20 },
        { category: 'B', sub: 'Y', label: 'Item 3', value: 30 }
      ],
      groupBy: ['category', 'sub'], hierarchyExpandLevel: 2,
      rowSeriesNumber: { title: 'No.', dragOrder: true }
    });
  },
  async exercise(page) {
    // 与来源一致，先在首个子分组位置插入，再删除该分组的第二条记录。
    await page.evaluate(() => {
      const table = window.__visualTable;
      window.__groupOriginal = JSON.stringify(table.records);
      table.addRecords([{ category: 'A', sub: 'X', label: 'Added', value: 99 }], [0, 0, 0]);
      window.__groupAfterAdd = JSON.stringify(table.records);
      table.deleteRecords([[0, 0, 1]]);
      window.__groupAfterDelete = JSON.stringify(table.records);
    });
  },
  async verify(page) {
    // 新增与删除均须改变二级分组内的记录顺序和数量。
    await page.evaluate(() => {
      const before = JSON.parse(window.__groupOriginal)[0].children[0].children;
      const afterAdd = JSON.parse(window.__groupAfterAdd)[0].children[0].children;
      const afterDelete = JSON.parse(window.__groupAfterDelete)[0].children[0].children;
      if (before.length !== 2 || afterAdd.length !== 3 || afterDelete.length !== 2 ||
        afterAdd[0].label !== 'Added' || afterDelete[0].label !== 'Added' ||
        afterDelete.some(record => record.label === 'Item 1'))
        throw new Error(`分组增删顺序异常：${JSON.stringify({ before, afterAdd, afterDelete })}`);
    });
  }
};
