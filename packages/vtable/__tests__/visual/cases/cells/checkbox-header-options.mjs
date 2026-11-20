/**
 * BugServer case IDs: 66f689cd33c1e900bc71e36a
 * 验证目的：空字段、回调选中、固定选中和禁用配置的复选框表头共同绘制。
 * 改写：保留七种初始状态，其他人员字段改为通用编号。
 */
export default {
  mount(container) {
    // 与来源相同地混合列级 headerType、cellType、checked 和 disable。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: '', title: '', headerType: 'checkbox', cellType: 'checkbox', width: 60 },
        { field: 'check', title: 'Check', headerType: 'checkbox', cellType: 'checkbox', width: 130,
          checked: () => true },
        { field: 'progress', title: 'Progress', headerType: 'checkbox', cellType: 'checkbox',
          checked: true, width: 150 },
        { field: 'id', title: 'ID', headerType: 'checkbox', cellType: 'checkbox',
          checked: true, disable: true, width: 100 },
        { field: 'label', title: 'Label', width: 150 }
      ],
      records: [
        { check: { text: 'unchecked', checked: false, disable: false }, progress: 100, id: 1, label: 'A' },
        { check: { text: 'unchecked', checked: false, disable: true }, progress: 80, id: 2, label: 'B' },
        { check: { text: 'checked', checked: true, disable: false }, progress: 1, id: 3, label: 'C' },
        { check: { text: 'checked', checked: true, disable: true }, progress: 55, id: 4, label: 'D' },
        { check: true, progress: 28, id: 5, label: 'E' },
        { check: false, progress: 28, id: 6, label: 'F' },
        { progress: 28, id: 7, label: 'G' }
      ],
      frozenColCount: 2, allowFrozenColCount: 2, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 七行、四类复选框列与冻结列必须共同存在，截图验证表头和禁用外观。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.frozenColCount !== 2 || table.colCount !== 5 || table.rowCount !== 8)
        throw new Error('复选框列或数据行缺失');
      for (const col of [0, 1, 2, 3])
        if (table.getCellType(col, 1) !== 'checkbox') throw new Error('复选框列类型错误');
      if (table.getCellOriginValue(2, 1) !== 100 || table.getCellOriginValue(1, 7) !== undefined)
        throw new Error('初始状态边界缺失');
    });
  }
};
