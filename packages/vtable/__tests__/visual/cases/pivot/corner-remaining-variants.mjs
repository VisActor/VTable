/**
 * BugServer case IDs: 67eba18063ae2300a3122147, 67eba1e52ef4e200a7775a9c, 67ecf4e1d4307700b694535e
 * 验证目的：角头在只有行维度、只有列维度和无指标的其余排列中仍能绘制。
 * 改写：来源的地区与商品明细统一替换为 A/B、X/Y 匿名组合。
 */
export default {
  mount(container) {
    // 三张表分别覆盖指标在行、指标在列及无指标且只有一级行维度。
    container.style.width = '800px';
    container.style.height = '660px';
    container.style.display = 'grid';
    container.style.gridTemplateRows = 'repeat(3, 220px)';
    const records = [
      { group: 'A', item: 'A1', type: 'X', subtype: 'X1', amount: 10 },
      { group: 'A', item: 'A2', type: 'X', subtype: 'X2', amount: 20 },
      { group: 'B', item: 'B1', type: 'Y', subtype: 'Y1', amount: 30 }
    ];
    const variants = [
      { rows: ['group', 'item'], indicators: ['amount'], indicatorsAsCol: false,
        corner: { titleOnDimension: 'row', forceShowHeader: true } },
      { columns: ['type', 'subtype'], indicators: ['amount'], indicatorsAsCol: true,
        corner: { titleOnDimension: 'column', forceShowHeader: true } },
      { rows: ['group'], indicators: [], indicatorsAsCol: true,
        corner: { titleOnDimension: 'row', forceShowHeader: true } }
    ];
    const tables = variants.map(variant => {
      const host = document.createElement('div');
      host.style.cssText = 'width:780px;height:210px';
      container.append(host);
      return new window.VTable.PivotTable(host, { records, ...variant, widthMode: 'standard' });
    });
    return {
      tables,
      async renderAsync() {
        // 等待三个布局各自完成绘制。
        await Promise.all(tables.map(table => table.renderAsync?.()));
      },
      release() {
        // 测试结束后释放全部透视表。
        tables.forEach(table => table.release());
      }
    };
  },
  async verify(page) {
    // 三种空维度排列均须生成有效行列和画布。
    await page.evaluate(() => {
      const tables = window.__visualTable.tables;
      if (tables.length !== 3 || tables.some(table =>
        table.rowCount < 1 || table.colCount < 1 || !table.canvas?.width))
        throw new Error('角头补充排列存在未绘制表格');
    });
  }
};
