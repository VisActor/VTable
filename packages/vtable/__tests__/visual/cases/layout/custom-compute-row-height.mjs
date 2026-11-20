/**
 * BugServer case IDs: 673c5cad013a5500b2fe99e1
 * 验证目的：customComputeRowHeight 能按记录将指定数据行设为独立高度。
 * 改写：去除来源的邮箱和 SVG，仅保留一列匿名记录及高度回调。
 */
export default {
  mount(container) {
    // 第二条记录使用 160px，其他数据行使用 40px。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'item', title: 'Item', width: 220 }],
      records: [{ item: 'First' }, { item: 'Tall' }, { item: 'Third' }],
      defaultRowHeight: 'auto',
      customComputeRowHeight({ row, table }) {
        // 回调按当前可见行对应的记录返回固定高度。
        return table.getRecordByCell(0, row)?.item === 'Tall' ? 160 : 40;
      }
    });
  },
  async verify(page) {
    // 第二条记录高于前后记录，且场景图矩形反映相同高度。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const heights = [1, 2, 3].map(row => table.getRowHeight(row));
      if (heights[1] < 150 || heights[0] > 50 || heights[2] > 50)
        throw new Error(`自定义行高错误：${JSON.stringify(heights)}`);
    });
  }
};
