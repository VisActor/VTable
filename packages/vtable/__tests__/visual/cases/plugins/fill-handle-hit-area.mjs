/**
 * BugServer case IDs: 6aaf3468168db9005cc382c1
 * 验证目的：填充柄显示尺寸为 6×6，命中区域覆盖 11 像素且不覆盖 13 像素。
 * 改写：移除宿主状态标签，保留选中、两个偏移命中检查与尺寸断言。
 */
export default {
  mount(container) {
    // 开启 fillHandle 并选中第一个数据格，命中检查在渲染后运行。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 180 }, { field: 'value', title: 'Value', width: 180 }],
      records: [{ name: 'Alpha', value: 1 }, { name: 'Beta', value: 2 }, { name: 'Gamma', value: 3 }],
      excelOptions: { fillHandle: true }
    });
    table.selectCell(0, 1);
    return table;
  },
  async verify(page) {
    // 同时检查真实命中函数与显示大小，避免只有配置存在的假通过。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const bounds = table.scenegraph.highPerformanceGetCell(0, 1).globalAABBBounds;
      const hit = offset => table.eventManager.checkCellFillhandle({
        abstractPos: { x: bounds.x2 + offset, y: bounds.y2 + offset }, eventArgs: {}
      });
      const component = [...table.scenegraph.selectedRangeComponents.values()][0];
      if (!component?.fillhandle || !hit(11) || hit(13) ||
        component.fillhandle.attribute.width !== 6 || component.fillhandle.attribute.height !== 6)
        throw new Error('填充柄命中区域或视觉尺寸错误');
    });
  }
};
