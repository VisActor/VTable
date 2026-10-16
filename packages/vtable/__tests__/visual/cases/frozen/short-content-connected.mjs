/**
 * BugServer case IDs: 6a83c88f652957005d019ab2
 * 验证目的：短内容大容器中，左冻结列、顶部五行和底部两行冻结区相接。
 * 改写：使用通用本地记录，不保留示例邮箱，保留冻结数量与底部颜色。
 */
export default {
  mount(container) {
    // 大于内容高度的容器暴露上下冻结区连接边界。
    container.style.width = '1000px';
    container.style.height = '800px';
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 120 },
        { field: 'name', title: 'Name', width: 180 }, { field: 'city', title: 'City', width: 180 },
        { field: 'sales', title: 'Sales', width: 180 }, { field: 'note', title: 'Note', width: 200 }],
      records: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Name ${i + 1}`,
        city: ['A', 'B', 'C'][i % 3], sales: 1000 + i * 100, note: `Row ${i + 1}` })),
      frozenColCount: 2, rightFrozenColCount: 0, frozenRowCount: 5, bottomFrozenRowCount: 2,
      defaultColWidth: 150, theme: { bottomFrozenStyle: { bgColor: '#fff7cc' } }
    });
  },
  async verify(page) {
    // 冻结分区计数和最后一条记录必须符合源配置。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.frozenColCount !== 2 || table.frozenRowCount !== 5 ||
        table.bottomFrozenRowCount !== 2 || table.getCellValue(0, 10) !== 10)
        throw new Error('短内容冻结区未正确建立');
    });
  }
};
