/**
 * BugServer case IDs: 66055f07a8fccc00acd3703a
 * 验证目的：列溢出时滚动条贴边且始终可见，多层表头保持布局。
 * 改写：原例人物资料改为固定通用记录，保留列宽和 scrollStyle 关键设置。
 */
export default {
  mount(container) {
    // 宽度总和超过 800px，确保可见滚动条不是无溢出的空配置。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 'calc(20% - 20px)',
          fieldFormat: record => `Completed ${record.progress}%` },
        { title: 'Name', columns: [
          { field: 'first', title: 'First name', width: 180, minWidth: 150 },
          { field: 'last', title: 'Last name', width: '20%', minWidth: 150 }
        ] },
        { field: 'note', title: 'Note', width: 650 }
      ],
      records: [{ progress: 20, first: 'A', last: 'One', note: 'first' },
        { progress: 50, first: 'B', last: 'Two', note: 'second' }],
      dragHeaderMode: 'column', defaultHeaderColWidth: [80, 150],
      theme: { scrollStyle: { barToSide: true, visible: 'always' } }
    });
  },
  async verify(page) {
    // 验证水平内容确实溢出，否则滚动条样式无法得到有效测试。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getAllColsWidth() <= 800 || table.getCellValue(1, 3) !== 'B')
        throw new Error('滚动表格未形成预期溢出');
    });
  }
};
