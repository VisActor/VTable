/**
 * 验证目的：列表表头和固定数据能正确创建、绘制与读取。
 * 来源：VTable 公共 ListTable API 独立样例。
 * 覆盖边界：不测试排序、编辑或虚拟滚动。
 */
export default {
  mount(container) {
    // 固定记录与列配置，供双侧构建使用完全相同的输入。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 150 }, { field: 'value', title: 'Value', width: 150 }],
      records: [{ name: 'Alpha', value: 10 }, { name: 'Beta', value: 20 }]
    });
  },
  async verify(page) {
    // 同时检查数据语义和可见单元格位置，图片比较负责像素布局。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 1) !== 'Alpha' || table.getCellValue(1, 2) !== 20)
        throw new Error('列表数据不正确');
      const rect = table.getCellRect(0, 1)?.bounds;
      if (!rect || rect.x2 <= rect.x1 || rect.y2 <= rect.y1) throw new Error('没有有效单元格布局');
    });
  }
};
