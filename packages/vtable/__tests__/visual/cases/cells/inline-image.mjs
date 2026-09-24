/**
 * BugServer case IDs: 64744ff55d221c008666ee12
 * 验证目的：图片单元格自动尺寸、保持宽高比，点击图片边缘不报错。
 * 改写：将远程动物照片替换为本地内联图形，保留不同图片比例与录制点击。
 */
export default {
  mount(container) {
    // 内联图形避免公开测试依赖远程图片服务。
    const svg = (width, height, color) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`)}`;
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 },
        { field: 'image', title: 'Image', width: 300, cellType: 'image', keepAspectRatio: true,
          imageAutoSizing: true, style: { padding: 1 } }],
      records: [{ id: 1, image: svg(100, 50, '#75aadb') },
        { id: 2, image: svg(50, 100, '#e8af6f') }, { id: 3, image: svg(100, 100, '#82bd84') }]
    });
  },
  async exercise(page) {
    // 录制动作指向图片边框内侧，目标定位随当前单元格尺寸计算。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(1, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x1 + 15, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 边框点击不应损坏图片字段或选择状态。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (!table.getCellValue(1, 1).startsWith('data:image/svg+xml')) throw new Error('图片字段缺失');
      if (!table.getSelectedCellRanges().length) throw new Error('图片边缘点击未选中单元格');
    });
  }
};
