/**
 * BugServer case IDs: 69c23daa709fdc006857f1c8
 * 验证目的：左右冻结区在内容宽于视口时各自接收横向滚轮。
 * 改写：来源的重复人员列改为八个匿名数值列，保留两侧冻结宽度限制。
 */
export default {
  mount(container) {
    // 左右冻结内容均超过各自 180px 视口，产生独立内部滚动范围。
    container.style.width = '700px';
    container.style.height = '310px';
    return new window.VTable.ListTable(container, {
      columns: Array.from({ length: 8 }, (_, index) => ({
        field: `c${index}`, title: `C${index}`, width: 120
      })),
      records: Array.from({ length: 6 }, (_, row) =>
        Object.fromEntries(Array.from({ length: 8 }, (_, col) => [`c${col}`, `${row}-${col}`]))),
      frozenColCount: 3, rightFrozenColCount: 2,
      maxFrozenWidth: 180, maxRightFrozenWidth: 180,
      scrollFrozenCols: true, scrollRightFrozenCols: true,
      widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 在左冻结区向右滚，在右冻结区反向滚以展开两边被裁剪的内容。
    const host = await page.locator('#table').boundingBox();
    await page.mouse.move(host.x + 80, host.y + 90);
    await page.mouse.wheel(90, 0);
    await page.mouse.move(host.x + host.width - 80, host.y + 90);
    await page.mouse.wheel(-90, 0);
  },
  async verify(page) {
    // 两侧各自的滚动位置均改变，冻结列数没有被宽度上限自动削减。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const scroll = table.stateManager.scroll;
      if (table.frozenColCount !== 3 || table.rightFrozenColCount !== 2 ||
        table.getFrozenColsOffset() <= 0 || table.getRightFrozenColsOffset() <= 0 ||
        scroll.frozenHorizontalBarPos <= 0 || scroll.rightFrozenHorizontalBarPos <= 0)
        throw new Error(`冻结区内部滚动未生效：${JSON.stringify(scroll)}`);
    });
  }
};
