/**
 * BugServer case IDs: 647452cf5d221c008666ee17
 * 验证目的：无指标透视表按显式行列树绘制链接型维度表头。
 * 改写：来源的大型主题与超长分类列表缩为固定公开样本，保留无指标、树和链接表头条件。
 */
export default {
  mount(container) {
    // 显式树节点与零指标一起覆盖只有维度的透视边界。
    container.style.width = '800px';
    container.style.height = '400px';
    return new window.VTable.PivotTable(container, {
      rows: [{ dimensionKey: 'group', title: 'Group', width: 'auto', headerType: 'link', linkDetect: true, linkJump: false }],
      columns: [{ dimensionKey: 'method', title: 'Method', headerType: 'link', linkDetect: true, linkJump: false }],
      rowTree: ['Alpha', 'Beta', 'Gamma', 'Delta'].map(value => ({ dimensionKey: 'group', value })),
      columnTree: ['Standard', 'Express', 'Same day'].map(value => ({ dimensionKey: 'method', value })),
      hideIndicatorName: true, allowFrozenColCount: 2, columnResizeType: 'indicator',
      corner: { titleOnDimension: 'row', headerStyle: { textStick: true } }
    });
  },
  async verify(page) {
    // 行列树必须生成有效区域；视觉比较负责验证表头的绘制。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount < 4 || table.colCount < 3 || !Number.isFinite(table.getCellRect(1, 1)?.bounds?.x1))
        throw new Error('无指标透视表未生成预期的行列结构');
    });
  }
};
