/**
 * 验证目的：adaptive 行高下，下方相邻行承接相反方向的位移后不应被重复扣减。
 * 行高路径与列相同：bottomRowHeight 已是 bottomRowHeightCache - detaY，若再用 bottomRowHeight - detaY
 * 判断 limitMinHeight 会把位移错误截短，使最终行高与指示线终点、实时拖动不一致。本例一次拖动大位移触发该重复扣减。
 */
export default {
  mount(container) {
    // 固定容器高度让 adaptive 把数据行撑高，便于数值断言。
    container.style.width = '300px';
    container.style.height = '400px';
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 150 },
        { field: 'value', title: 'Value', width: 150 }
      ],
      records: Array.from({ length: 3 }, (_, index) => ({
        name: `Item ${index + 1}`,
        value: index + 1
      })),
      defaultRowHeight: 80,
      heightMode: 'adaptive',
      resize: { rowResizeMode: 'all' }
    });
  },
  async exercise(page) {
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      const b = table.getCellRect(0, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__topBefore = table.getRowHeight(1);
      window.__bottomBefore = table.getRowHeight(2);
      // 选取使 bottomBefore - drag >= limitMinHeight(10) 但 bottomBefore - 2*drag < 10 的位移。
      window.__drag = window.__bottomBefore - 20;
      return { edge: { x: host.x + (b.x1 + b.x2) / 2, y: host.y + b.y2 - 1 }, drag: window.__bottomBefore - 20 };
    });
    // 单步向下拖动一个大位移，使一次 updateResizeRow 收到完整 detaY。
    await page.mouse.move(point.edge.x, point.edge.y);
    await page.mouse.down();
    await page.mouse.move(point.edge.x, point.edge.y + point.drag);
    await page.mouse.up();
  },
  async verify(page) {
    await page.evaluate(() => {
      const table = window.__visualTable;
      const topBefore = window.__topBefore;
      const bottomBefore = window.__bottomBefore;
      const drag = window.__drag;
      const topAfter = table.getRowHeight(1);
      const bottomAfter = table.getRowHeight(2);
      // 下方行应收缩到约 bottomBefore - drag（≈20）；重复扣减会把它停在 bottomBefore - 10 附近。
      if (bottomAfter > bottomBefore - drag + 5) {
        throw new Error(
          `adaptive 下方行位移被重复扣减截短：bottomBefore=${bottomBefore}, drag=${drag}, bottomAfter=${bottomAfter}`
        );
      }
      // 拖动行应吃满整段位移，验证尺寸与指示线终点一致。
      if (topAfter < topBefore + drag - 5) {
        throw new Error(
          `adaptive 拖动行未吃满位移：topBefore=${topBefore}, drag=${drag}, topAfter=${topAfter}`
        );
      }
    });
  }
};
