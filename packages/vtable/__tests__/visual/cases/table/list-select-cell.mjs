/**
 * 验证目的：鼠标点击数据单元格后选择状态发生真实变化。
 * 来源：VTable 公共 ListTable API 独立样例。
 * 覆盖边界：不测试多选、拖选或键盘导航。
 */
export default {
  mount(container) {
    // 创建两行数据，确保交互目标不依赖浏览器外部资源。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 150 }, { field: 'value', title: 'Value', width: 150 }],
      records: [{ name: 'Alpha', value: 10 }, { name: 'Beta', value: 20 }]
    });
  },
  async exercise(page) {
    // 根据公开单元格矩形定位目标，避免录制坐标在宿主尺寸变化后失效。
    const point = await page.evaluate(() => {
      const bounds = window.__visualTable.getCellRect(1, 2).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (bounds.x1 + bounds.x2) / 2, y: host.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 禁止仅凭截图或点击完成来宣称交互已生效。
    await page.waitForFunction(() => {
      const range = window.__visualTable.getSelectedCellRanges()[0];
      return range?.start.col === 1 && range?.start.row === 2 && range?.end.col === 1 && range?.end.row === 2;
    });
  }
};
