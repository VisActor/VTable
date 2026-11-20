/**
 * BugServer case IDs: 672b5b0b71189400b2ec8d56
 * 验证目的：跨行列拖选时 highlightInRange 在范围内着色，表头仍可参与选择。
 * 改写：用匿名三列记录和单元格位置代替固定录制坐标。
 */
export default {
  mount(container) {
    // 保留 cross 高亮与表头 inline 选择，使用固定短记录。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'a', title: 'A', width: 130 },
        { field: 'b', title: 'B', width: 130 }, { field: 'c', title: 'C', width: 130 }],
      records: [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 },
        { a: 7, b: 8, c: 9 }, { a: 10, b: 11, c: 12 }],
      select: { headerSelectMode: 'inline', highlightMode: 'cross', highlightInRange: true }
    });
  },
  async exercise(page) {
    // 先在表体拖选，再点表头，最终从表头拖到表体留下跨边界范围。
    const point = (col, row) => page.evaluate(({ col, row }) => {
      const b = window.__visualTable.getCellRect(col, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    }, { col, row });
    const drag = async (a, b) => {
      await page.mouse.move(a.x, a.y);
      await page.mouse.down();
      await page.mouse.move(b.x, b.y, { steps: 8 });
      await page.mouse.up();
    };
    await drag(await point(0, 1), await point(1, 2));
    await page.mouse.click(...Object.values(await point(0, 0)));
    await drag(await point(0, 0), await point(2, 3));
  },
  async verify(page) {
    // 最终范围必须跨越表头和表体，且高亮范围配置保持启用。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const range = table.getSelectedCellRanges()[0];
      if (!table.stateManager.select.highlightInRange || !range ||
        range.start.row !== 0 || range.end.row < 3 || range.end.col < 2)
        throw new Error(`跨表头选择范围错误：${JSON.stringify(range)}`);
    });
  }
};
