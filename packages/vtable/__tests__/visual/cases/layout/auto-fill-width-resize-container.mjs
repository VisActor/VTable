/**
 * BugServer case IDs: 6532320388cd1012fefa741c, 6540b514f95bdcf7c340d701
 * 验证目的：autoFillWidth 下拖动列边界，再改变容器宽度，列宽与表格仍同步更新。
 * 改写：合并同配置的两条来源，保留内部初始调整、真实鼠标拖动和容器变化。
 */
export default {
  mount(container) {
    // 固定两列和容器宽度，先按来源通过状态管理器调整首列。
    container.style.width = '800px';
    container.style.height = '400px';
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'progress', title: 'Progress', showSort: true },
        { field: 'id', title: 'ID', width: 100 }],
      records: [{ progress: 100, id: 1 }, { progress: 80, id: 2 },
        { progress: 60, id: 3 }, { progress: 40, id: 4 }],
      autoFillWidth: true, widthMode: 'standard', allowFrozenColCount: 2,
      resize: { colResizeMode: 'all' }
    });
    table.stateManager.startResizeCol(0, 700, 120);
    table.stateManager.updateResizeCol(670, 120);
    table.stateManager.endResizeCol();
    return table;
  },
  async exercise(page) {
    // 从首列表头右边界向左拖动，再将宿主增宽 1px 触发重新布局。
    const edge = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__widthBeforeDrag = b.x2 - b.x1;
      return { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(edge.x, edge.y);
    await page.mouse.down();
    await page.mouse.move(edge.x - 100, edge.y, { steps: 10 });
    await page.mouse.up();
    await page.evaluate(() => { document.getElementById('table').style.width = '801px'; });
    await page.waitForTimeout(100);
  },
  async verify(page) {
    // 最终首列必须比拖动前窄，容器变化后其余列仍有有效宽度。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const first = table.getCellRect(0, 0).bounds;
      const last = table.getCellRect(1, 0).bounds;
      if (first.x2 - first.x1 >= window.__widthBeforeDrag - 30 || last.x2 - last.x1 < 80 ||
        document.getElementById('table').clientWidth !== 801)
        throw new Error(`容器变化后列宽异常：${JSON.stringify({ before: window.__widthBeforeDrag, first, last })}`);
    });
  }
};
