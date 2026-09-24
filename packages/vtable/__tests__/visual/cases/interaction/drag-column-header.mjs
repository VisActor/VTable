/**
 * BugServer case IDs: 646492b0917f340071e15c6e
 * 验证目的：分组表头旁的普通列经鼠标拖动后，表头顺序和表体仍一致。
 * 改写：人员与邮箱数据替换为固定通用字段，保留多层表头和 column 拖动模式。
 */
export default {
  mount(container) {
    // 来源的 Name 分组位于两个普通列之间，拖动末列可检验整个列结构更新。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'progress', title: 'Progress', width: 140 },
        { title: 'Name', columns: [
          { field: 'first', title: 'First', width: 130 },
          { field: 'last', title: 'Last', width: 130 }
        ] },
        { field: 'contact', title: 'Contact', width: 160 },
        { field: 'date', title: 'Date', width: 120 }
      ],
      records: Array.from({ length: 8 }, (_, index) => ({ progress: index * 13,
        first: `First ${index + 1}`, last: `Last ${index + 1}`,
        contact: `contact-${index + 1}`, date: `2024-01-${String(index + 1).padStart(2, '0')}` })),
      dragHeaderMode: 'column', widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 从 Contact 的顶层表头拖到 Progress 左侧，重放来源中的真实列移动。
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      return [[3, 0], [0, 0]].map(([col, row]) => {
        const bounds = table.getCellRect(col, row).bounds;
        return { x: host.x + (bounds.x1 + bounds.x2) / 2,
          y: host.y + (bounds.y1 + bounds.y2) / 2 };
      });
    });
    // 来源先点击表头建立可拖动的整列选区。
    await page.mouse.click(points[0].x, points[0].y);
    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();
    await page.mouse.move(points[1].x, points[1].y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // Contact 应移动至 Progress 前面，首行值与字段定义同步。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getHeaderField(0, 0) !== 'contact' || table.getCellValue(0, 2) !== 'contact-1')
        throw new Error(`拖动后列顺序错误：${table.columns.map(column => column.field ?? column.title)}`);
    });
  }
};
