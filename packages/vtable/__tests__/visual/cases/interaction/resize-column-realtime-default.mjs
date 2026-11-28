/**
 * 验证目的：resize.realtime=true（默认）时保持历史行为，拖拽过程中列宽实时变化。
 * 作为 resize-column-non-realtime 的对照用例，防止改动回归默认行为。
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
      resize: { columnResizeMode: 'all' }
    });
  },
  async exercise(page) {
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__colWidthBefore = table.getColWidth(0);
      return {
        edge: { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 }
      };
    });
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
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
      const before = window.__colWidthBefore;
      const during1 = window.__widthDuringDrag;
      const during2 = window.__widthDuringDrag2;
      const after = window.__visualTable.getColWidth(0);
      // 实时模式：拖拽中列宽应递增
      if (during1 <= before || during2 <= during1) {
        throw new Error(`实时模式下列宽未随拖拽变化: before=${before}, during1=${during1}, during2=${during2}`);
      }
      if (after <= before + 40) {
        throw new Error(`鼠标松开后列宽未达到预期: before=${before}, after=${after}`);
      }
    });
  }
};
