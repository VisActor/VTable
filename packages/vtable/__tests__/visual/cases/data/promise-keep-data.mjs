/**
 * BugServer case IDs: 6806172028b4c200a9da9987
 * 验证目的：CachedDataSource 挂载后 updateOption({keepData:true}) 保留异步数据。
 * 改写：去除邮箱、电话和人员字段，改用同步可重复的批次 Promise。
 */
export default {
  mount(container) {
    // 同一缓存批次为相邻行返回稳定记录。
    const source = new window.VTable.data.CachedDataSource({
      length: 20,
      get(index) {
        // 每次请求按索引返回同一条固定记录。
        return Promise.resolve({ id: index + 1, label: `Item ${index + 1}` });
      }
    });
    const columns = [{ field: 'id', title: 'ID', width: 100 },
      { field: 'label', title: 'Label', width: 180 }];
    const table = new window.VTable.ListTable(container, { columns });
    table.dataSource = source;
    window.__keepDataColumns = columns;
    return table;
  },
  async exercise(page) {
    // 首行数据加载后更新列配置，复用既有数据源。
    await page.waitForFunction(() => window.__visualTable.getCellValue(0, 1) === 1);
    await page.evaluate(() => {
      window.__visualTable.updateOption({ columns: window.__keepDataColumns }, { keepData: true });
    });
  },
  async verify(page) {
    // 更新后仍能读取首行与后续异步行。
    await page.waitForFunction(() => window.__visualTable.getCellValue(0, 2) === 2);
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(1, 1) !== 'Item 1' || table.getCellValue(1, 2) !== 'Item 2')
        throw new Error('updateOption 丢失 CachedDataSource 数据');
    });
  }
};
