/**
 * BugServer case IDs: 676e651d8e768100b114c2ef
 * 验证目的：点号路径读取数组元素字段后，在中间插入一条数组记录。
 * 改写：将姓名改为通用标识，保留 0.name/1.age/2.sex 路径和插入位置。
 */
export default {
  mount(container) {
    // 数组记录的路径与普通对象路径不同，插入后还须能解析。
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: '0.name', title: 'Name', width: 130, sort: true },
        { field: '1.age', title: 'Age', width: 100 }, { field: '2.sex', title: 'Sex', width: 100 }],
      records: [[{ name: 'A' }, { age: 20 }, { sex: 'male' }],
        [{ name: 'B' }, { age: 21 }, { sex: 'female' }], [{ name: 'C' }, { age: 22 }, { sex: 'male' }]]
    });
    table.addRecord([{ name: 'Inserted' }, { age: 23 }, { sex: 'female' }], 2);
    return table;
  },
  async verify(page) {
    // 插入后的三个字段必须落在同一行。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellValue(0, 3) !== 'Inserted' || table.getCellValue(1, 3) !== 23 ||
        table.getCellValue(2, 3) !== 'female') throw new Error('数组字段路径或插入位置错误');
    });
  }
};
