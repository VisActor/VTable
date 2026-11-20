/**
 * BugServer case IDs: 67ac6b4ddb3b0800b20431e5
 * 验证目的：动态图标、分段进度条、负值进度条与自定义布局共同渲染。
 * 改写：将长 SVG 缩成内联箭头，保留回调结构与不同进度值。
 */
export default {
  mount(container) {
    // 用固定记录触发所有颜色分支和自定义布局回调。
    window.__customLayoutCalls = 0;
    const VTable = window.VTable;
    return new VTable.ListTable(container, {
      columns: [
        { field: 'value', title: 'Icon', width: 90,
          style: { color: data => Number(data.value) > 0 ? '#50aa53' : '#d85859' },
          icon: () => ({ type: 'svg', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M6 1 L11 10 L1 10 Z" fill="green"/></svg>', width: 12, height: 12, name: 'arrow', positionType: VTable.TYPES.IconPosition.right }) },
        { field: 'percent', title: 'Progress', width: 140, cellType: 'progressbar',
          style: { barHeight: 20, barColor: data => Number.parseInt(data.dataValue, 10) > 50 ? '#4dbd74' : '#ffc107' } },
        { field: 'percent', title: 'Custom', width: 180, cellType: 'progressbar',
          customLayout: ({ table, col, row, rect }) => {
            window.__customLayoutCalls++;
            const record = table.getRecordByCell(col, row);
            const bounds = rect ?? table.getCellRect(col, row);
            const rootContainer = new VTable.CustomLayout.Container({ width: bounds.width, height: bounds.height });
            rootContainer.add(new VTable.CustomLayout.Text({ text: `${record.percent} : ${record.value}`, fontSize: 13, fill: 'black', marginLeft: 10 }));
            return { rootContainer };
          } },
        { field: 'value', title: 'Negative axis', width: 140, cellType: 'progressbar', min: -10, max: 20,
          barType: 'negative', style: { barHeight: 20, barBottom: 7, textAlign: 'right' } }
      ],
      records: [{ percent: '100%', value: 20 }, { percent: '60%', value: 12 },
        { percent: '20%', value: 4 }, { percent: '0%', value: -10 }],
      showFrozenIcon: true, allowFrozenColCount: 2, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 自定义布局必须执行，负值记录必须保留。
    await page.evaluate(() => {
      if (window.__customLayoutCalls < 4) throw new Error('自定义布局未执行');
      if (window.__visualTable.getCellOriginValue(3, 4) !== -10) throw new Error('负值进度条记录缺失');
    });
  }
};
