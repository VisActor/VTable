/**
 * BugServer case IDs: 64b9f06824402a7e07da8e3c, 6559c7c838a83fc5d23015a4
 * 验证目的：autoWidth 的最大宽度限制在 false 与 100 配置下确实不同。
 * 改写：来源的格式化个人记录改为单个固定长文本单元格。
 */
export default {
  mount(container) {
    // 两张列表只有最大自动列宽限制不同，便于直接比较实测列宽。
    container.style.width = '800px';
    container.style.height = '310px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    const tables = [false, 100].map(limitMaxAutoWidth => {
      const host = document.createElement('div');
      host.style.cssText = 'width:390px;height:300px';
      container.append(host);
      return new window.VTable.ListTable(host, {
        columns: [{ field: 'text', title: 'Description', width: 'auto' }],
        records: [{ text: 'A long anonymous description that requires a much wider automatically sized column' }],
        widthMode: 'autoWidth', limitMaxAutoWidth
      });
    });
    return {
      tables,
      async renderAsync() {
        // 等待自动列宽计算和绘制完成。
        await Promise.all(tables.map(table => table.renderAsync?.()));
      },
      release() {
        // 比较完成后释放两张列表。
        tables.forEach(table => table.release());
      }
    };
  },
  async verify(page) {
    // 关闭限制时的实测宽度应明显超过 100，另一张应被限制。
    await page.evaluate(() => {
      const [unlimited, capped] = window.__visualTable.tables;
      const widths = [unlimited.getColWidth(0), capped.getColWidth(0)];
      if (widths[0] <= widths[1] + 80 || widths[1] > 101)
        throw new Error(`自动列宽上限未区分：${JSON.stringify(widths)}`);
    });
  }
};
