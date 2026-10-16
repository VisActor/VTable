/**
 * BugServer case IDs: 66cd83fe5e11d900c8f0e96b
 * 验证目的：先设置双字段降序，再 setRecords 后仍按两个字段排序。
 * 改写：将来源的人员字段改为编号与代号，保留两个排序键的并列数据。
 */
export default {
  mount(container) {
    // 同一 score 内的 code 次序使第二排序键是否执行可观察。
    const table = new window.VTable.ListTable(container, {
      columns: [
        { field: 'score', title: 'Score', sort: true, width: 140 },
        { field: 'code', title: 'Code', sort: true, width: 140 }
      ],
      multipleSort: true,
      sortState: [{ field: 'score', order: 'desc' }, { field: 'code', order: 'desc' }],
      widthMode: 'standard'
    });
    table.setRecords([
      { score: 1, code: 'A' }, { score: 3, code: 'B' },
      { score: 3, code: 'C' }, { score: 2, code: 'D' }
    ]);
    return table;
  },
  async verify(page) {
    // 首字段降序后，同分组中的 C 必须排在 B 前。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const codes = [1, 2, 3, 4].map(row => table.getCellValue(1, row));
      if (codes.join(',') !== 'C,B,D,A' || table.sortState?.length !== 2)
        throw new Error(`初始复合排序错误：${JSON.stringify({ codes, sortState: table.sortState })}`);
    });
  }
};
