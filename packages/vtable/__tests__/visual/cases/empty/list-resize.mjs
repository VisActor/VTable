/**
 * BugServer case IDs: 66554c5a5a5b1400ab9139e9
 * 验证目的：空记录表在容器尺寸变化后保持表头与 emptyTip 绘制。
 * 改写：减少重复列数量，保留水平溢出、冻结列与创建后缩小宿主条件。
 */
export default {
  mount(container) {
    // 先以 800x600 创建，再缩至来源的 500x300 条件。
    const columns = Array.from({ length: 8 }, (_, index) => ({ field: `field${index}`, title: `Column ${index}`, width: 150 }));
    const table = new window.VTable.ListTable(container, {
      columns, records: [], frozenColCount: 2, widthMode: 'standard', emptyTip: {}
    });
    container.style.width = '500px';
    container.style.height = '300px';
    table.resize();
    return table;
  },
  async verify(page) {
    // 确认空数据和缩小后的视口均真实存在，通用绘制检查负责非空画布。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table');
      if (table.records.length !== 0 || host.clientWidth !== 500 || host.clientHeight !== 300)
        throw new Error('空表尺寸条件未生效');
    });
  }
};
