/**
 * BugServer case IDs: 6613d5fb2acd9c00d1c98a3f
 * 验证目的：树形列表中相邻值合并后，点击层级图标仍能展开子行。
 * 改写：层级标识和日期列替换为通用分组；保留树、合并列与录制点击。
 */
export default {
  mount(container) {
    // 两个父节点各有子行，合并列的数据保持相邻重复。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'item', title: 'Item', width: 260, tree: true },
        { field: 'value', title: 'Value', width: 180, mergeCell: true }],
      records: [{ item: 'Group A', value: 1, children: [{ item: 'A1', value: 1 }] },
        { item: 'Group B', value: 2, children: [{ item: 'B1', value: 2 }] }],
      frozenColCount: 1, defaultRowHeight: 30, heightMode: 'autoHeight', autoWrapText: true
    });
  },
  async exercise(page) {
    // 点击首行左侧的层级图标，复现来源录制的展开动作。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(0, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x1 + 22, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 首个节点应变成展开状态，子行应加入可见行。
    await page.waitForFunction(() => window.__visualTable.getHierarchyState(0, 1) === 'expand');
    await page.evaluate(() => {
      if (window.__visualTable.rowCount < 4) throw new Error('树形子行未展开');
    });
  }
};
