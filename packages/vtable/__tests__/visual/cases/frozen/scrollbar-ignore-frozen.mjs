/**
 * BugServer case IDs: 68a2e109fcb96500a7134dd7
 * 验证目的：运行时设置冻结列和横向滚动后，ignoreFrozenCols 使主滚动条跨完整表宽。
 * 改写：重复人员列替换成编号列，保留来源的尺寸、主题和 API 调用。
 */
export default {
  mount(container) {
    // 固定七列使主体溢出，后续再按来源动态设置冻结列数。
    container.style.width = '800px';
    container.style.height = '400px';
    const columns = Array.from({ length: 7 }, (_, col) => ({ field: 'c' + col, title: 'Column ' + col, width: col === 0 ? 150 : 200 }));
    const table = new window.VTable.ListTable(container, {
      columns, widthMode: 'standard', frozenColCount: 0,
      theme: {
        frozenColumnLine: { shadow: { width: 24, startColor: 'rgba(0, 24, 47, 0.06)', endColor: 'rgba(0, 24, 47, 0)' } },
        scrollStyle: { visible: 'always', ignoreFrozenCols: true }
      }
    });
    table.setRecords(Array.from({ length: 5 }, (_, row) =>
      Object.fromEntries(columns.map((column, col) => [column.field, row * 10 + col]))));
    return table;
  },
  async exercise(page) {
    // 与来源相同地动态设置冻结列数，再滚动到横向中间位置。
    await page.evaluate(() => {
      const table = window.__visualTable;
      table.frozenColCount = 2;
      table.setScrollLeft(200);
    });
    await page.waitForFunction(() => window.__visualTable.scrollLeft === 200);
  },
  async verify(page) {
    // 滚动条总宽必须包含冻结区，主体内容也必须已滚动。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const bar = table.scenegraph.component.hScrollBar.attribute;
      if (table.frozenColCount !== 2 || table.scrollLeft !== 200 ||
          !table.theme.scrollStyle.ignoreFrozenCols || bar.width < table.tableNoFrameWidth - 5)
        throw new Error('冻结列仍被主滚动条排除');
    });
  }
};
