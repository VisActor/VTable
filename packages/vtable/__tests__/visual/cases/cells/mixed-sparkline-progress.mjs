/**
 * BugServer case IDs: 65d2ffbb97cc3d008de5b570, 65fc11f6603de700d1d8bacf, 65fbd5707c3a0c00c99f2eb9
 * 验证目的：同一列按行切换 sparkline、progressbar 与文本，负值进度条仍显示。
 * 改写：缩小颜色定义与数据量，合并两例 row-height；保留行类型分支、负值范围与自动行高。
 */
export default {
  mount(container) {
    // 记录顺序对应来源的 1/2/3 行类型分支。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'percent', title: 'Percent', width: 150,
          cellType: args => args.row % 3 === 0 ? 'text' : args.row % 2 === 0 ? 'progressbar' : 'sparkline',
          sparklineSpec: { type: 'line', smooth: true, pointShowRule: 'all', line: { style: { stroke: '#2E62F1', strokeWidth: 2 } } } },
        { field: 'value', title: 'Axis', width: 120, cellType: 'progressbar', min: -10, max: 20,
          barType: 'negative', style: { barHeight: 20, barBottom: 7, textAlign: 'right' } }
      ],
      records: [
        { percent: [30, 40, 50, 30, 50], value: 20 },
        { percent: '80%', value: 18 },
        { percent: 'Text', value: -10 }
      ],
      widthMode: 'standard', heightMode: 'autoHeight'
    });
  },
  async verify(page) {
    // 检查动态类型真正按行分配，并确认负值数据未丢失。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const types = [1, 2, 3].map(row => table.getCellType(0, row));
      if (types.join(',') !== 'sparkline,progressbar,text') throw new Error(`行类型错误：${types}`);
      if (table.getCellOriginValue(1, 3) !== -10) throw new Error('负值记录缺失');
    });
  }
};
