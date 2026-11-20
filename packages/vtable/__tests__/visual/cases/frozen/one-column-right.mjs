/**
 * BugServer case IDs: 65adebf8366fb000953fee50
 * 验证目的：唯一一列同时是右冻结列时，表格仍能绘制记录。
 * 改写：保留单列、showPin 与 rightFrozenColCount=1；名称改为通用值。
 */
export default {
  mount(container) {
    // 右冻结覆盖全表宽度，直接触及左右边界重合场景。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100 }],
      records: [{ id: 1 }], showPin: true, widthMode: 'standard', rightFrozenColCount: 1
    });
  },
  async verify(page) {
    // 验证右冻结数和唯一单元格都存在。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.colCount !== 1 || table.getCellValue(0, 1) !== 1 || table.rightFrozenColCount !== 1)
        throw new Error('单列右冻结失效');
    });
  }
};
