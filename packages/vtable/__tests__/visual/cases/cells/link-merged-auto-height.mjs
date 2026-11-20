/**
 * BugServer case IDs: 6a8597d0a44900005e2b8e47
 * 验证目的：合并的链接单元格在自动行高下绘制，点击时不跳转。
 * 改写：把来源的长列表缩为三个匿名记录和公开示例地址。
 */
export default {
  mount(container) {
    // 保留来源的 link、mergeCell、linkDetect、linkJump 组合。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'site', title: 'Link', width: 240, cellType: 'link', mergeCell: true,
          linkDetect: true, linkJump: false },
        { field: 'value', title: 'Value', width: 120 }
      ],
      records: [
        { site: 'https://example.com/guide', value: 'A' },
        { site: 'https://example.com/guide', value: 'B' },
        { site: 'https://example.com/help', value: 'C' }
      ],
      heightMode: 'autoHeight', defaultRowHeight: 'auto'
    });
  },
  async exercise(page) {
    // 点击首个链接，确认 linkJump:false 不会离开本地测试页。
    const before = page.url();
    const point = await page.evaluate(() => {
      const bounds = window.__visualTable.getCellRect(0, 1).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + bounds.x1 + 35, y: host.y + bounds.y1 + 12 };
    });
    await page.mouse.click(point.x, point.y);
    if (page.url() !== before) throw new Error('禁用跳转的链接离开了测试页');
    await page.mouse.move(760, 560);
  },
  async verify(page) {
    // 单元格类型与合并范围都必须由运行时布局实际识别。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellType(0, 1) !== 'link') throw new Error('链接类型未生效');
      if (table.getCellOriginValue(0, 1) !== 'https://example.com/guide')
        throw new Error('链接值不正确');
      const range = table.getCellRange(0, 1);
      if (range.start.row !== 1 || range.end.row !== 2)
        throw new Error('连续链接单元格未合并');
    });
  }
};
