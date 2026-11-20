/**
 * BugServer case IDs: 6889e5b0b485f100aabeadee
 * 验证目的：树形列表的行序号复选状态在头部插入记录后仍可见。
 * 改写：商品层级与金额换成通用节点，保留三级树、懒加载节点与 addRecord。
 */
export default {
  mount(container) {
    // 先设置原有复选状态，再在根记录索引 0 插入空记录。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', cellType: 'checkbox', tree: true, title: 'Group', width: 190 },
        { field: 'value', title: 'Value', width: 120 }],
      records: [{ name: 'Group A', value: 100, children: [
        { name: 'A1', value: 60, children: [{ name: 'A1a', value: 30 }, { name: 'A1b', value: 30 }] },
        { name: 'A2', value: 40 }
      ] }, { name: 'Group B', value: 80, children: [{ name: 'B1', value: 80 }] },
      { name: 'Lazy group', value: 20, children: true }],
      hierarchyIndent: 20, hierarchyExpandLevel: 2, enableCheckboxCascade: false,
      // 行序号列采用无文字复选框，以保持原来源的状态迁移条件。
      rowSeriesNumber: { width: 50, cellType: 'checkbox', format: () => '' },
      select: { disableDragSelect: true }, theme: window.VTable.themes.BRIGHT
    });
    table.setCellCheckboxState(0, 1, true);
    table.setCellCheckboxState(0, 2, true);
    table.setCellCheckboxState(0, 5, true);
    window.__treeRowsBefore = table.rowCount;
    table.addRecord({}, 0);
    return table;
  },
  async verify(page) {
    // 新增根记录后行数应增加，原已选复选框仍有可见状态。
    await page.evaluate(() => {
      const table = window.__visualTable;
      let checked = 0;
      for (let row = 1; row < table.rowCount; row++)
        if (table.getCellCheckboxState(0, row) === true) checked++;
      if (table.rowCount <= window.__treeRowsBefore || checked < 1)
        throw new Error(`树记录插入后复选状态错误：rows=${table.rowCount}, checked=${checked}`);
    });
  }
};
