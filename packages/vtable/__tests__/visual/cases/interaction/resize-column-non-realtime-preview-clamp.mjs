/**
 * 验证目的：非实时模式拖拽越过 minWidth 时，指示线预览与标签应显示“最终可应用的尺寸”，
 * 而不是未约束的 pendingDeltaX。列宽 180、minWidth 100，向左拖 100px 目标为 80，
 * 预览标签必须显示 100px（与松手后的最终列宽一致），不能显示未约束的 80px。
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
      return { edge: { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 } };
    });
    // 非实时模式：按下并向左累计拖动 100px，但先不松手，停在拖拽预览状态。
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
    await page.mouse.move(point.edge.x - 100, point.edge.y, { steps: 10 });
    // 捕获松手前的预览标签文案与指示线位置。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const component = table.scenegraph.component;
      window.__previewLabel = component.columnResizeLabel.lastChild.attribute.text;
      window.__previewLineX = component.columnResizeLine.attribute.x;
      // 基准线：当前列右边界 x（无偏移）。
      const b = table.getCellRect(0, 0).bounds;
      window.__colBaseX = b.x2;
      window.__colWidthBefore = table.getColWidth(0);
    });
    await page.mouse.up();
  },
  async verify(page) {
    await page.evaluate(() => {
      const table = window.__visualTable;
      const previewLabel = window.__previewLabel;
      const previewLineX = window.__previewLineX;
      const colBaseX = window.__colBaseX;
      const after = table.getColWidth(0);

      // 松手后最终列宽应 clamp 到 minWidth 100。
      if (after !== 100) {
        throw new Error(`最终列宽未按 minWidth clamp：after=${after}`);
      }
      // 预览标签必须显示最终可应用尺寸 100px，而不是未约束的 80px。
      if (previewLabel !== '100px') {
        throw new Error(`预览标签未按最终尺寸约束：previewLabel=${previewLabel}, 期望 100px`);
      }
      // 指示线位置应对应有效位移（最终宽度 100 相对初始 180 向左收 80px），
      // 即基准线左移 (180-100)=80px；若用未约束的 100px 位移会多移 20px。
      const expectedLineX = colBaseX - 80;
      if (Math.abs(previewLineX - expectedLineX) > 1) {
        throw new Error(
          `预览指示线位置未按最终尺寸约束：previewLineX=${previewLineX}, 期望≈${expectedLineX}（基准 ${colBaseX}）`
        );
      }
    });
  }
};
