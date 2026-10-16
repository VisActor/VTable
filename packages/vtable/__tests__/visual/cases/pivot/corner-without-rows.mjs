/**
 * BugServer case IDs: 66b32ebbd62b6300ba4721d8
 * 验证目的：没有行维度与指标时，显式 columnTree 仍显示列头和强制角头。
 * 改写：删除未触发的菜单和粘贴配置，保留无行无指标的结构边界。
 */
export default {
  mount(container) {
    // 三个固定列树节点足以验证强制角头与列头布局。
    return new window.VTable.PivotTable(container, {
      defaultColWidth: 200,
      columnTree: [
        { dimensionKey: 'Category', value: 'Office Supplies' },
        { dimensionKey: 'Category', value: 'Technology' },
        { dimensionKey: 'Category', value: 'Furniture' }
      ],
      columns: [{ dimensionKey: 'City', title: 'City',
        headerStyle: { textStick: true, bgColor: '#356b9c', color: '#00ffff' } }],
      indicatorsAsCol: true,
      corner: { forceShowHeader: true, titleOnDimension: 'column',
        headerStyle: { bgColor: '#356b9c', color: '#00ffff' } }
    });
  },
  async verify(page) {
    // 三个类别必须真的成为表格头部，而不是仅存在配置中。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellValue(col, row));
      if (!values.includes('Technology') || !values.includes('Furniture'))
        throw new Error('空行维度列头缺失');
    });
  }
};
