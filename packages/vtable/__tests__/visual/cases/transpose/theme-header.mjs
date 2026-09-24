/**
 * BugServer case IDs: 65d599b29c176100a02dd0a4
 * 验证目的：转置列表中分组表头和扩展主题边框共同绘制。
 * 改写：人物联系方式替换为固定通用文本，保留转置、嵌套列及主题扩展结构。
 */
export default {
  mount(container) {
    // 使用三个公开示例字段和多行记录，避免私人联系方式进入仓库。
    return new window.VTable.ListTable(container, {
      records: [
        { id: 1, first: 'A', last: 'One', city: 'North' },
        { id: 2, first: 'B', last: 'Two', city: 'South' },
        { id: 3, first: 'C', last: 'Three', city: 'East' }
      ],
      columns: [
        { field: 'id', title: 'ID', sort: true, width: 'auto' },
        { title: 'Full name', columns: [
          { field: 'first', title: 'First name' }, { field: 'last', title: 'Last name' }
        ] },
        { field: 'city', title: 'City' }
      ],
      widthMode: 'standard', transpose: true, dragHeaderMode: 'all', limitMinWidth: 20,
      theme: window.VTable.themes.DEFAULT.extends({
        headerStyle: { color: 'red', frameStyle: { borderColor: 'red', borderLineWidth: 2 } }
      })
    });
  },
  async verify(page) {
    // 转置后列数随记录数增长，且表格保留原有字段值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellValue(col, row));
      if (!table.options.transpose || !values.includes('Three') || !values.includes('South'))
        throw new Error('转置数据或布局缺失');
    });
  }
};
