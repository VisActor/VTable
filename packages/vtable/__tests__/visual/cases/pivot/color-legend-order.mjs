/**
 * BugServer case IDs: 6979f44b20f246006732267e
 * 验证目的：PivotTable 的标题先于顶部连续色彩图例布局。
 * 改写：用四条匿名记录替代来源的大型数值表和远程图表资源。
 */
export default {
  mount(container) {
    // 保留 title、color legends 和 componentLayoutOrder 的组合。
    return new window.VTable.PivotTable(container, {
      rows: ['group'], columns: ['category'], indicators: ['amount'],
      records: [
        { group: 'A', category: 'X', amount: 20 },
        { group: 'A', category: 'Y', amount: 40 },
        { group: 'B', category: 'X', amount: 60 },
        { group: 'B', category: 'Y', amount: 80 }
      ],
      title: { text: 'Color range', orient: 'top', align: 'center' },
      legends: { type: 'color', orient: 'top', position: 'start',
        colors: ['rgb(235,235,255)', 'rgb(35,35,255)'], value: [0, 100], min: 0, max: 100 },
      componentLayoutOrder: ['title', 'legend'],
      defaultColWidth: 160, defaultHeaderColWidth: 100
    });
  },
  async verify(page) {
    // 检查图例生成可见边界，绘制顺序由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const legend = table.internalProps.legends?.[0]?.legendComponent;
      if (!legend || legend.AABBBounds.width() < 20 || legend.AABBBounds.height() < 10)
        throw new Error('连续色彩图例未绘制');
      if (!table.internalProps.title || table.getDrawRange().top < 30)
        throw new Error('标题与图例未占据顶部布局');
    });
  }
};
