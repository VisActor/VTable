/**
 * BugServer case IDs: 6584086d807cf6008d99baad
 * 验证目的：列级禁用表体和表头悬停，高亮仍可在普通列显示。
 * 改写：固定匿名记录，按实际单元格矩形重放两个录制的悬停动作。
 */
export default {
  mount(container) {
    // 第一列禁用表体悬停，第二列禁用表头悬停，第三列作为正常对照。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, disableHover: true },
        { field: 'id', title: 'ID', width: 110, disableHeaderHover: true },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 20, id: 1, name: 'A' }, { progress: 40, id: 2, name: 'B' }],
      hover: { highlightMode: 'cross', disableHover: false },
      theme: { bodyStyle: { hover: { cellBgColor: '#B9D5FF' } },
        headerStyle: { hover: { cellBgColor: '#B9D5FF' } } }
    });
  },
  async exercise(page) {
    // 依次悬停普通列、禁用表头和禁用表体，最后保留禁用表体供截图比较。
    const point = (col, row) => page.evaluate(({ col, row }) => {
      const b = window.__visualTable.getCellRect(col, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    }, { col, row });
    for (const [col, row] of [[2, 1], [1, 0], [0, 2]]) {
      const p = await point(col, row);
      await page.mouse.move(p.x, p.y);
    }
  },
  async verify(page) {
    // 真实指针位置与两类列级禁用项同时成立，外观由截图比对。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const hover = table.stateManager.hover;
      if (hover.highlightScope !== 'cross' || hover.cellPos.col !== 0 || hover.cellPos.row !== 2 ||
        !table.getBodyColumnDefine(0, 2).disableHover || !table.getHeaderDefine(1, 0).disableHeaderHover)
        throw new Error('列级悬停禁用场景无效');
    });
  }
};
