/**
 * 验证目的：resize.realtime=false 时，列宽调整仅在鼠标松开后应用一次。
 * 拖拽过程中列宽保持不变，松开鼠标时列宽等于累计偏移量。
 */
export default {
  mount(container) {
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 150 },
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
      return {
        cell: { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 },
        edge: { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 }
      };
    });
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
    // 拖拽过程中每步都记录列宽，确认拖拽时列宽未变化
    await page.mouse.move(point.edge.x + 40, point.edge.y, { steps: 10 });
    const widthDuringDrag = await page.evaluate(() => window.__visualTable.getColWidth(0));
    await page.mouse.move(point.edge.x + 80, point.edge.y, { steps: 10 });
    const widthDuringDrag2 = await page.evaluate(() => window.__visualTable.getColWidth(0));
    await page.mouse.up();
    await page.evaluate(
      ({ w1, w2 }) => {
        window.__widthDuringDrag = w1;
        window.__widthDuringDrag2 = w2;
      },
      { w1: widthDuringDrag, w2: widthDuringDrag2 }
    );
  },
  async verify(page) {
    await page.evaluate(() => {
      const table = window.__visualTable;
      const before = window.__colWidthBefore;
      const during1 = window.__widthDuringDrag;
      const during2 = window.__widthDuringDrag2;
      const after = table.getColWidth(0);
      // 拖拽中列宽不应变化
      if (during1 !== before || during2 !== before) {
        throw new Error(
          `非实时响应模式下拖拽过程中列宽发生了变化: before=${before}, during1=${during1}, during2=${during2}, after=${after}`
        );
      }
      // 松开鼠标后列宽应增加（累计偏移量 80px 应用）
      if (after <= before + 40) {
        throw new Error(`鼠标松开后列宽未按累计偏移量应用: before=${before}, after=${after}`);
      }
    });
  }
};
