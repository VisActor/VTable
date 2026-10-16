/**
 * BugServer case IDs: 65671306eb24adef19a3a669
 * 验证目的：CachedDataSource 异步批次加载与多行多列 customMergeCell 同时生效。
 * 改写：移除人员联系方式及职业信息，保留 Promise 缓存、合并区域和滚动位置。
 */
export default {
  mount(container) {
    // 按批次缓存同一个 Promise，固定数据避免远程请求与时间波动。
    const batches = new Map();
    const source = new window.VTable.data.CachedDataSource({
      get(index) {
        // 每 20 条记录共用一次异步生成，模拟原始来源的分页获取。
        const start = Math.floor(index / 20) * 20;
        if (!batches.has(start)) batches.set(start, new Promise(resolve => {
          setTimeout(() => resolve(Array.from({ length: 20 }, (_, offset) => ({
            id: start + offset + 1, label: `Item ${start + offset + 1}`,
            group: `Group ${(start + offset) % 3 + 1}`, date: '2024-01-01'
          }))), 30);
        }));
        return batches.get(start).then(records => records[index - start]);
      },
      length: 200
    });
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { field: 'label', title: 'Label', width: 170 },
        { field: 'group', title: 'Group', width: 170 },
        { field: 'date', title: 'Date', width: 150 }],
      customMergeCell: (col, row) => {
        // 第 8-10 行的三列使用与 BugServer 来源相同的合并边界。
        if (col < 1 || col > 3 || row < 8 || row > 10) return undefined;
        return { text: 'Merged async rows', range: { start: { col: 1, row: 8 },
          end: { col: 3, row: 10 } }, style: { bgColor: '#ccddee' } };
      }
    });
    table.dataSource = source;
    table.setScrollTop(60);
    return table;
  },
  async verify(page) {
    // 等待异步批次完成，并确认合并区域在可见行内有效。
    await page.waitForFunction(() => window.__visualTable.getCellValue(0, 8) === 8);
    await page.evaluate(() => {
      const table = window.__visualTable;
      const merge = table.getCellRange(1, 8);
      if (merge?.start?.col !== 1 || merge?.end?.col !== 3 || merge?.end?.row !== 10)
        throw new Error(`异步合并区域错误：${JSON.stringify(merge)}`);
    });
  }
};
