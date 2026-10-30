/**
 * 验证目的：adaptive 列宽下，相邻右列承接相反方向的位移后不应被重复扣减。
 * 右列已是 rightColWidthCache - detaX，若再用 rightColWidth - detaX 判断 limitMinWidth 会把位移错误截短，
 * 导致最终列宽与指示线终点、实时拖动不一致。本例一次性拖动一个较大位移以触发该重复扣减。
 */
export default {
  mount(container) {
    // 固定容器宽度让 adaptive 把两列各分到约 150px，便于数值断言。
    container.style.width = '300px';
    container.style.height = '300px';
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
      widthMode: 'adaptive',
      resize: { columnResizeMode: 'all' }
    });
  },
  async exercise(page) {
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__leftBefore = table.getColWidth(0);
      window.__rightBefore = table.getColWidth(1);
      // 选取使 rightBefore - drag >= limitMinWidth(10) 但 rightBefore - 2*drag < 10 的位移，
      // 正确实现应保留全部位移，旧实现会二次扣减并截短。
      window.__drag = window.__rightBefore - 20;
      return { edge: { x: host.x + b.x2 - 1, y: host.y + (b.y1 + b.y2) / 2 }, drag: window.__rightBefore - 20 };
    });
    // 单步拖动一个大位移，使一次 updateResizeColumn 收到完整 detaX。
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
    await page.mouse.move(point.edge.x + point.drag, point.edge.y);
    await page.mouse.up();
  },
  async verify(page) {
    await page.evaluate(() => {
      const table = window.__visualTable;
      const leftBefore = window.__leftBefore;
      const rightBefore = window.__rightBefore;
      const drag = window.__drag;
      const leftAfter = table.getColWidth(0);
      const rightAfter = table.getColWidth(1);
      // 右列应收缩到约 rightBefore - drag（≈20）；重复扣减会把它停在 rightBefore - 10 附近。
      if (rightAfter > rightBefore - drag + 5) {
        throw new Error(
          `adaptive 右列位移被重复扣减截短：rightBefore=${rightBefore}, drag=${drag}, rightAfter=${rightAfter}`
        );
      }
      // 左列应吃满整段位移，验证尺寸与指示线终点一致。
      if (leftAfter < leftBefore + drag - 5) {
        throw new Error(
          `adaptive 左列未吃满位移：leftBefore=${leftBefore}, drag=${drag}, leftAfter=${leftAfter}`
        );
      }
    });
  }
};
