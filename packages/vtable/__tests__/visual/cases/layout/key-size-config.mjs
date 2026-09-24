/**
 * BugServer case IDs: 6909e268711d9200a827cd92, 6909e3c4711d9200a827cd93
 * 验证目的：稳定 key 的列宽、行高配置同时覆盖百分比宽度和自动填高。
 * 改写：两条来源共用后者的配置超集，个人字段换成通用名称。
 */
export default {
  mount(container) {
    // key 0/1/2 与列宽、行高配置逐一对应。
    return new window.VTable.ListTable(container, {
      columns: [{ key: 0, field: 'progress', title: 'Progress', width: 'calc(20% - 20px)' },
        { title: 'Name', columns: [{ key: 1, field: 'first', title: 'First', width: '20%' },
          { key: 2, field: 'last', title: 'Last', width: '20%' }] }],
      records: [{ progress: 20, first: 'A', last: 'One' }, { progress: 80, first: 'B', last: 'Two' }],
      dragHeaderMode: 'column', autoFillHeight: true,
      columnWidthConfig: [{ key: 0, width: 150 }, { key: 1, width: 150 }, { key: 2, width: 150 }],
      rowHeightConfig: [{ key: 0, height: 150 }, { key: 1, height: 150 }, { key: 2, height: 150 }]
    });
  },
  async verify(page) {
    // 第一列宽度和首条记录高度应使用 key 配置。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(0, 1).bounds;
      if (Math.abs((b.x2 - b.x1) - 150) > 2 || b.y2 - b.y1 < 100)
        throw new Error(`key 尺寸配置未生效：${b.x2 - b.x1} × ${b.y2 - b.y1}`);
    });
  }
};
