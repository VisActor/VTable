/**
 * BugServer case IDs: 6474534d5d221c008666ee18
 * 验证目的：columnHeaderTitle 在列维度上方增加独立标题行。
 * 改写：将来源的大型主题和数据矩阵缩为固定匿名记录，对照无标题配置。
 */
export default {
  mount(container) {
    // 两张透视表共享记录，仅切换 columnHeaderTitle 以隔离标题行效果。
    container.style.width = '800px';
    container.style.height = '330px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    const records = [
      { group: 'A', period: 'First', amount: 10 },
      { group: 'A', period: 'Second', amount: 20 },
      { group: 'B', period: 'First', amount: 30 }
    ];
    const tables = [false, true].map(withTitle => {
      const host = document.createElement('div');
      host.style.cssText = 'width:390px;height:320px';
      container.append(host);
      return new window.VTable.PivotTable(host, {
        rows: [{ dimensionKey: 'group', title: 'Group' }],
        columns: [{ dimensionKey: 'period', title: 'Period' }],
        indicators: [{ indicatorKey: 'amount', title: 'Amount' }],
        records,
        ...(withTitle ? { columnHeaderTitle: { title: 'Periods', headerStyle: { textAlign: 'center' } } } : {}),
        widthMode: 'standard'
      });
    });
    return {
      tables,
      async renderAsync() {
        // 等待两张画布都完成绘制后再截图。
        await Promise.all(tables.map(table => table.renderAsync?.()));
      },
      release() {
        // 用例结束时释放两张透视表。
        tables.forEach(table => table.release());
      }
    };
  },
  async verify(page) {
    // 标题配置应比对照表多一层列头，且两张表都具有真实画布。
    await page.evaluate(() => {
      const [plain, titled] = window.__visualTable.tables;
      if (titled.columnHeaderLevelCount !== plain.columnHeaderLevelCount + 1 ||
        !plain.canvas?.width || !titled.canvas?.width)
        throw new Error('列头标题未增加独立表头层');
    });
  }
};
