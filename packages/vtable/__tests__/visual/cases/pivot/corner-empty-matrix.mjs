/**
 * BugServer case IDs: 67eb9a84fddcfa00a827d1e5, 67eb9aad731cd600a72b8541, 67eb9b1d2b0c7600a7633c83, 67eb9b4ab8637b00a7a32276, 67eb9baddc8abb00a7c081f1, 67eb9bcdd3963500b3ec8261
 * 验证目的：无行、无列与无指标的角头组合均可实际绘制。
 * 改写：六个相邻 BugServer 配置共享匿名二维数据，在一张快照中并排检查。
 */
export default {
  mount(container) {
    // 各子表仍由真正的 PivotTable 绘制，共享的仅是无业务含义的输入记录。
    container.style.width = '800px';
    container.style.height = '640px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    container.style.gridTemplateRows = 'repeat(3, 210px)';
    const records = [
      { region: 'A', item: 'X', type: 'T1', subtype: 'S1', amount: 5 },
      { region: 'A', item: 'Y', type: 'T1', subtype: 'S2', amount: 7 },
      { region: 'B', item: 'Z', type: 'T2', subtype: 'S1', amount: 12 }
    ];
    const variants = [
      { label: 'no rows / no columns / indicator column', indicatorsAsCol: true,
        corner: { titleOnDimension: 'none', forceShowHeader: true } },
      { label: 'no rows / no columns / indicator row', indicatorsAsCol: false,
        corner: { titleOnDimension: 'none', forceShowHeader: true } },
      { label: 'columns only', columns: ['type', 'subtype'], indicatorsAsCol: false,
        corner: { titleOnDimension: 'column', forceShowHeader: true } },
      { label: 'rows only', rows: ['region', 'item'], indicatorsAsCol: true,
        corner: { titleOnDimension: 'row', forceShowHeader: true } },
      { label: 'rows / no indicator', rows: ['region', 'item'], indicators: [],
        corner: { titleOnDimension: 'row', forceShowHeader: true } },
      { label: 'columns / no indicator', columns: ['type', 'subtype'], indicators: [],
        corner: { titleOnDimension: 'column', forceShowHeader: true } }
    ];
    const tables = variants.map(variant => {
      const panel = document.createElement('div');
      panel.style.cssText = 'height:205px;overflow:hidden;border:1px solid #bbb';
      const label = document.createElement('div');
      label.textContent = variant.label;
      label.style.cssText = 'height:22px;font:12px sans-serif';
      const host = document.createElement('div');
      host.style.cssText = 'width:100%;height:180px';
      panel.append(label, host);
      container.append(panel);
      const { label: ignored, ...options } = variant;
      return new window.VTable.PivotTable(host, {
        records, indicators: ['amount'], widthMode: 'standard', ...options
      });
    });
    return {
      tables,
      async renderAsync() {
        // 等待六张子表都完成绘制后再进入截图阶段。
        await Promise.all(tables.map(table => table.renderAsync?.()));
      },
      release() {
        // 用例结束时逐个释放子表，避免多实例残留。
        tables.forEach(table => table.release());
      }
    };
  },
  async verify(page) {
    // 六种配置均须有可见行列与实际画布，避免仅有外层标签通过截图。
    await page.evaluate(() => {
      const tables = window.__visualTable.tables;
      if (tables.length !== 6 || tables.some(table => table.rowCount < 1 || table.colCount < 1 ||
        !table.canvas?.width || !table.canvas?.height))
        throw new Error('空维度矩阵有未绘制的透视表');
    });
  }
};
