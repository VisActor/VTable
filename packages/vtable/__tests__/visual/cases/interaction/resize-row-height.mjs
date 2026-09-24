/**
 * BugServer case IDs: 662e1f56d4511700f6885622
 * 验证目的：鼠标拖动列表行边界后行高实际增加，选择状态不阻碍调整。
 * 改写：来源的多列表数据缩为匿名短记录，保留两次动作中的选中后拖动。
 */
export default {
  mount(container) {
    // 固定初始行高使拉伸后的变化可以数值断言。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 150 },
        { field: 'value', title: 'Value', width: 150 }],
      records: Array.from({ length: 5 }, (_, index) => ({
        name: `Item ${index + 1}`, value: index + 1
      })), defaultRowHeight: 32, resize: { rowResizeMode: 'all' }
    });
  },
  async exercise(page) {
    // 先选中第一数据行，再在行边界向下拖动 32px。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(1, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__rowHeightBefore = b.y2 - b.y1;
      return { cell: { x: host.x + (b.x1 + b.x2) / 2,
        y: host.y + (b.y1 + b.y2) / 2 },
      edge: { x: host.x + (b.x1 + b.x2) / 2, y: host.y + b.y2 + 1 } };
    });
    await page.mouse.click(point.cell.x, point.cell.y);
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
    await page.mouse.move(point.edge.x, point.edge.y + 32, { steps: 10 });
    await page.mouse.up();
  },
  async verify(page) {
    // 源行的画布矩形必须增高，后续行随之下移。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const first = table.getCellRect(1, 1).bounds;
      const second = table.getCellRect(1, 2).bounds;
      if (first.y2 - first.y1 < window.__rowHeightBefore + 15 || second.y1 < first.y2 - 1)
        throw new Error(`列表行高未调整：${JSON.stringify({ before: window.__rowHeightBefore, first, second })}`);
    });
  }
};
