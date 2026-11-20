/**
 * BugServer case IDs: 68ff3ba0e9f70b00b11e9403
 * 验证目的：MasterDetailPlugin 自动高度子表在主表滚动后仍正确布局。
 * 改写：来源的人员、部门与薪资示例替换为固定任务数据，保留展开子表、自动高度及滚动条件。
 */
export default {
  mount(container) {
    // 每四条记录带一张子表，保证容器高度不足时仍有已展开的明细。
    container.style.width = '800px';
    container.style.height = '400px';
    const plugin = new window.VTable.plugins.MasterDetailPlugin({
      id: 'visual-master-detail',
      detailTableOptions: {
        columns: [{ field: 'step', title: 'Step', width: 180 },
          { field: 'state', title: 'State', width: 140 }],
        defaultRowHeight: 35, defaultHeaderRowHeight: 35,
        style: { margin: 15, height: 'auto' }, theme: window.VTable.themes.ARCO
      }
    });
    const records = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1, item: `Task ${index + 1}`, stage: index % 2 ? 'Pending' : 'Ready',
      hierarchyState: 'expand',
      children: index % 4 === 0 ? [
        { step: 'Prepare', state: 'Done' }, { step: 'Review', state: 'Open' }
      ] : undefined
    }));
    return new window.VTable.ListTable(container, {
      records,
      columns: [{ field: 'id', title: 'ID', width: 80 },
        { field: 'item', title: 'Task', width: 180 },
        { field: 'stage', title: 'Stage', width: 130 }],
      rowSeriesNumber: { title: '#', dragOrder: true, width: 'auto' },
      widthMode: 'standard', heightMode: 'standard', defaultRowHeight: 40,
      defaultHeaderRowHeight: 45, plugins: [plugin]
    });
  },
  async exercise(page) {
    // 将来源滚动条到底动作转换为定位最后一行，避免固定像素坐标。
    await page.evaluate(() => {
      const table = window.__visualTable;
      table.scrollToCell({ row: table.rowCount - 1 });
    });
  },
  async verify(page) {
    // 滚动后主从展开行仍要保持自动高度和有效布局。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getHierarchyState(1, 1) !== 'expand' || table.getRowHeight(1) <= 40 ||
        table.scrollTop <= 0 || !Number.isFinite(table.getCellRect(1, table.rowCount - 1)?.bounds?.y1))
        throw new Error(`MasterDetail 明细或滚动未生效：height=${table.getRowHeight(1)}, top=${table.scrollTop}`);
    });
  }
};
