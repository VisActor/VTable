/**
 * 验证目的：匿名二维批量单元格更新保持行列映射，并让相邻单元格不变。
 * 来源：独立 API 覆盖用例；含个人信息的 BugServer 来源已排除，不建立来源 ID 关联。
 */
export default {
  mount(container) {
    // 用固定的通用字段和数值建立可观察的二维更新范围。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'id', title: 'ID', width: 100 },
        { field: 'amount', title: 'Amount', width: 120 },
        { field: 'state', title: 'State', width: 120 }
      ],
      records: [
        { id: 1, amount: 10, state: 'new' },
        { id: 2, amount: 20, state: 'new' },
        { id: 3, amount: 30, state: 'new' }
      ]
    });
  },
  async exercise(page) {
    // 从第二列首条记录开始更新两行两列，并检查 API 的逐格成功结果。
    await page.evaluate(async () => {
      const changed = await window.__visualTable.changeCellValues(1, 1, [[11, 'ready'], [21, 'hold']]);
      if (changed.length !== 2 || changed.some(row => row.length !== 2 || row.some(value => value !== true)))
        throw new Error('批量更新结果不完整');
    });
  },
  async verify(page) {
    // 断言二维目标、原始记录和未触及的邻格均保持预期值。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const expected = [[11, 'ready'], [21, 'hold']];
      for (let row = 0; row < expected.length; row++) {
        for (let col = 0; col < expected[row].length; col++) {
          if (table.getCellOriginValue(col + 1, row + 1) !== expected[row][col])
            throw new Error('批量更新的行列映射错误');
        }
      }
      if (table.getCellOriginValue(0, 1) !== 1 || table.getCellOriginValue(1, 3) !== 30)
        throw new Error('批量更新越过目标范围');
    });
  }
};
