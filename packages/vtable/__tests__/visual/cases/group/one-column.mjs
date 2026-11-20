/**
 * BugServer case IDs: 69ae7bce709fdc006857f1c7
 * 验证目的：只显示一列时按隐藏字段分组，底部冻结行与主题仍正确布局。
 * 改写：移除外部 Olympic 数据请求，用同结构的固定通用记录触发分组。
 */
export default {
  mount(container) {
    // country 不作为可见列，仅用于形成两个分组。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'athlete', title: 'Athlete', width: 120 }],
      records: [{ country: 'A', athlete: 'Member 1' }, { country: 'A', athlete: 'Member 2' },
        { country: 'B', athlete: 'Member 3' }],
      groupBy: 'country', bottomFrozenRowCount: 1,
      autoWrapText: true, heightMode: 'autoHeight', widthMode: 'autoWidth',
      theme: window.VTable.themes.ARCO.extends({ bottomFrozenStyle: { fontFamily: 'Arial', fontWeight: 500 } })
    });
  },
  async verify(page) {
    // 分组增加标题行；表格仍只能有一列。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 1 || table.rowCount <= 4) throw new Error('单列分组未展开');
    });
  }
};
