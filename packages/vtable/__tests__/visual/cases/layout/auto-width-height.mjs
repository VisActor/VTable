/**
 * BugServer case IDs: 64bdfed95134109a76ccddd6, 64be004b5134109a76ccddda
 * 验证目的：autoWidth 列宽与 autoHeight 行高在同一列表上生效。
 * 改写：合并共享记录与列结构的两个来源，保留两种自适应模式。
 */
export default {
  mount(container) {
    // 长字段可触发自动测量，固定输入保证双侧结果可比较。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 'auto' },
        { field: 'description', title: 'Description', width: 'auto', style: { autoWrapText: true } },
        { field: 'value', title: 'Value', width: 'auto' }
      ],
      records: [
        { name: 'A', description: 'A long description that wraps inside a measured column.', value: 10 },
        { name: 'B', description: 'Another fixed description.', value: 20 }
      ],
      widthMode: 'autoWidth', heightMode: 'autoHeight', autoWrapText: true,
      allowFrozenColCount: 2
    });
  },
  async verify(page) {
    // 检查测量后的尺寸是有限的正值，而非仅检查配置。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (!(table.getColWidth(1) > 0) || !(table.getRowHeight(1) > 0))
        throw new Error('自适应尺寸无效');
      if (table.getCellValue(0, 2) !== 'B') throw new Error('自适应表格数据缺失');
    });
  }
};
