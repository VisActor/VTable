/**
 * BugServer case IDs: 64b78beef1af57b472231cac, 65dc4029db5fe000ad96fd7f
 * 验证目的：转置表的 only-body 自动列宽不被很长的行头标题撑大。
 * 改写：来源的人员字段和图标替换为两个匿名字段与短记录。
 */
export default {
  mount(container) {
    // 标准模式与 only-body 模式共享长标题，用实测行头列宽比较。
    container.style.width = '800px';
    container.style.height = '320px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    const options = {
      columns: [
        { field: 'a', title: 'A very long header label for the first field', width: 'auto' },
        { field: 'b', title: 'Another long header label', width: 'auto' }
      ],
      records: [{ a: 'X', b: 'Y' }, { a: 'M', b: 'N' }],
      transpose: true, widthMode: 'autoWidth', defaultHeaderColWidth: 80
    };
    const tables = ['normal', 'only-body'].map(columnWidthComputeMode => {
      const host = document.createElement('div');
      host.style.cssText = 'width:390px;height:310px';
      container.append(host);
      return new window.VTable.ListTable(host, { ...options, columnWidthComputeMode });
    });
    return {
      tables,
      async renderAsync() {
        // 等待转置表自动宽度计算完成。
        await Promise.all(tables.map(table => table.renderAsync?.()));
      },
      release() {
        // 两张对照表分别释放。
        tables.forEach(table => table.release());
      }
    };
  },
  async verify(page) {
    // only-body 的首列应保持默认行头宽度，normal 则受长标题撑宽。
    await page.evaluate(() => {
      const [normal, body] = window.__visualTable.tables;
      const widths = [normal.getColWidth(0), body.getColWidth(0)];
      if (widths[0] <= widths[1] + 80 || widths[1] > 100)
        throw new Error(`转置 only-body 列宽异常：${JSON.stringify(widths)}`);
    });
  }
};
