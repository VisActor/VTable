/**
 * 验证目的：非实时模式把整段累计位移一次传入 min/max 约束时，应按目标值的越界方向 clamp。
 * 列宽 180、minWidth 100、maxWidth 200，向左累计拖动 100px 目标为 80，必须贴 minWidth 收到 100，
 * 不能因“当前宽度离哪个边界更近”而反向扩到 maxWidth 200。
 */
export default {
  mount(container) {
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 180, minWidth: 100, maxWidth: 200 },
        { field: 'value', title: 'Value', width: 150 }
      ],
      records: Array.from({ length: 5 }, (_, index) => ({
        name: `Item ${index + 1}`,
        value: index + 1
      })),
      defaultRowHeight: 32,
      resize: { columnResizeMode: 'all', realtime: false }
    });
  },
  async exercise(page) {
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__colWidthBefore = table.getColWidth(0);
      return { edge: { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 } };
    });
    // 非实时模式：拖拽过程只移动指示线，向左累计 100px，松开鼠标后统一提交。
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
    await page.mouse.move(point.edge.x - 100, point.edge.y, { steps: 10 });
    await page.mouse.up();
  },
  async verify(page) {
    await page.evaluate(() => {
      const table = window.__visualTable;
      const before = window.__colWidthBefore;
      const after = table.getColWidth(0);
      // 目标宽度 80 越过下界，必须 clamp 到 minWidth 100 并相对初始缩窄。
      if (after !== 100) {
        throw new Error(`非实时越界列宽未按 minWidth clamp：before=${before}, after=${after}`);
      }
      // 反向 resize 会扩到 maxWidth 200，这里显式拦截该回归。
      if (after >= before) {
        throw new Error(`非实时向左拖动反而没有缩窄，疑似反向 resize：before=${before}, after=${after}`);
      }
    });
  }
};
