/**
 * BugServer case IDs: 6565ca7e4c6c1a77d0efcc76
 * 验证目的：CachedDataSource 的异步 get 按批次加载可见行。
 * 改写：用固定编号代替人员信息，缩短模拟请求等待；保留 Promise 与批次缓存。
 */
export default {
  mount(container) {
    // 每 20 行只创建一个 Promise，模拟来源的分批异步数据。
    const loaded = new Map();
    const source = new window.VTable.data.CachedDataSource({
      get(index) {
        const start = Math.floor(index / 20) * 20;
        if (!loaded.has(start)) loaded.set(start, new Promise(resolve => {
          setTimeout(() => resolve(Array.from({ length: 20 }, (_, offset) => ({ id: start + offset + 1, name: `Item ${start + offset + 1}` }))), 30);
        }));
        return loaded.get(start).then(records => records[index - start]);
      },
      length: 100
    });
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 120 }, { field: 'name', title: 'Name', width: 180 }]
    });
    table.dataSource = source;
    return table;
  },
  async verify(page) {
    // 等待异步首批数据进入画布，不能以固定 sleep 代替。
    await page.waitForFunction(() => window.__visualTable.getCellValue(0, 1) === 1);
    await page.evaluate(() => {
      if (window.__visualTable.getCellValue(1, 1) !== 'Item 1') throw new Error('异步数据未加载');
    });
  }
};
