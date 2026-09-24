/**
 * BugServer case IDs: 658d56ae20ffa2008c33ebf4
 * 验证目的：表头禁选时，表体点击仍可选择，列头仍可拖动重排。
 * 改写：使用固定四列和单元格矩形复现点击与拖动顺序。
 */
export default {
  mount(container) {
    // 同时启用全列拖动与表头禁选，观察两个交互是否互相影响。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 150, showSort: true },
        { field: 'id', title: 'ID', width: 100 },
        { field: 'code', title: 'Code', width: 150 },
        { field: 'name', title: 'Name', width: 150 }
      ],
      records: [{ progress: 100, id: 1, code: 'A1', name: 'A' }, { progress: 80, id: 2, code: 'B2', name: 'B' }],
      widthMode: 'standard',
      dragHeaderMode: 'all',
      select: { disableHeaderSelect: true },
      hover: { highlightMode: 'cross', disableHeaderHover: true }
    });
  },
  async exercise(page) {
    // 先点击表体与禁选表头，再按来源把 ID 列拖向 Name 列。
    const point = (col, row) => page.evaluate(({ col, row }) => {
      const b = window.__visualTable.getCellRect(col, row).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
    }, { col, row });
    const body = await point(2, 1);
    await page.mouse.click(body.x, body.y);
    await page.waitForFunction(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 1);
    const codeHeader = await point(2, 0);
    await page.mouse.click(codeHeader.x, codeHeader.y);
    if (await page.evaluate(() => window.__visualTable.getSelectedCellRanges()[0]?.start.row === 0))
      throw new Error('禁选表头被选中');
    const start = await point(1, 0);
    const end = await point(3, 0);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // ID 列必须离开原位置；表体选择已在拖动前单独检查。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const fields = Array.from({ length: table.colCount }, (_, col) => table.getHeaderField(col, 0));
      if (fields.indexOf('id') <= 1) throw new Error('禁选表头阻断了列拖动');
    });
  }
};
