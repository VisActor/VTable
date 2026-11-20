/**
 * BugServer case IDs: 689af66784406200a7ab3d6c
 * 验证目的：透视表宽滚动条、贴边轨道、主题条纹和可调整行高共同布局。
 * 改写：用固定组合生成多行多列，保留 30 像素轨道及 always 配置。
 */
export default {
  mount(container) {
    // 足够的维度组合同时触发水平和垂直滚动条。
    const records = [];
    for (let group = 0; group < 8; group++)
      for (let item = 0; item < 3; item++)
        for (let kind = 0; kind < 8; kind++)
          records.push({ group: `G${group}`, item: `I${item}`, kind: `K${kind}`, variant: `V${kind}`,
            amount: group * 100 + item * 10 + kind, count: 1 });
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'], columns: ['kind', 'variant'], indicators: ['amount', 'count'],
      records, enableDataAnalysis: true, indicatorsAsCol: false,
      rowResizeType: 'indicator', rowResizeMode: 'all', widthMode: 'autoWidth',
      theme: window.VTable.themes.ARCO.extends({
        scrollStyle: { width: 30, visible: 'always', hoverOn: false, barToSide: true,
          scrollSliderCornerRadius: 0, scrollRailColor: 'rgba(216,216,216,.5)', scrollSliderColor: 'rgba(170,170,170,1)' },
        bodyStyle: { bgColor: args => (args.row - args.table.frozenRowCount) % 2 ? '#f8f8f8' : '#ffffff' }
      })
    });
  },
  async verify(page) {
    // 透视尺寸应超过视口，确保滚动条确实有内容可滚动。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount < 8 || table.rowCount < 20) throw new Error('透视滚动范围不足');
    });
  }
};
