/**
 * BugServer case IDs: 678620838e768100b114c398, 6786222198804d00b1d62177, 67862349af3eab00b234917d, 678624597020de00b01c0b49
 * 验证目的：固定、自动、最大限制及 updateOption 后的 canvas 尺寸分别生效。
 * 改写：来源的多组重复人员列缩为三列八行匿名数值。
 */
export default {
  mount(container) {
    // 四张列表共用输入，分别展示固定尺寸、内容自动撑开、上限和配置更新。
    container.style.width = '800px';
    container.style.height = '900px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    const options = {
      columns: [0, 1, 2].map(index => ({ field: `c${index}`, title: `Column ${index}`, width: 180 })),
      records: Array.from({ length: 8 }, (_, row) => ({ c0: row, c1: row + 10, c2: row + 20 })),
      defaultRowHeight: 42, widthMode: 'standard'
    };
    const variants = [
      { canvasWidth: 300, canvasHeight: 200 },
      { canvasWidth: 'auto', canvasHeight: 'auto' },
      { canvasWidth: 'auto', canvasHeight: 'auto', maxCanvasWidth: 500, maxCanvasHeight: 300 },
      { canvasWidth: 200, canvasHeight: 160 }
    ];
    const tables = variants.map(variant => {
      const host = document.createElement('div');
      host.style.cssText = 'width:390px;height:440px;overflow:hidden';
      container.append(host);
      return new window.VTable.ListTable(host, { ...options, ...variant });
    });
    return {
      tables,
      updateTarget() {
        // 模拟来源中先用固定尺寸构造，再切到内容自适应的配置更新。
        return tables[3].updateOption({ ...options, canvasWidth: 'auto', canvasHeight: 'auto' });
      },
      async renderAsync() {
        // 等待所有画布的首次绘制。
        await Promise.all(tables.map(table => table.renderAsync?.()));
      },
      release() {
        // 每张表在快照结束后独立释放。
        tables.forEach(table => table.release());
      }
    };
  },
  async exercise(page) {
    // 自动尺寸在内部异步计算，待其完成后切换第四张表。
    await page.waitForFunction(() => window.__visualTable.tables[1].canvasWidth > 500);
    await page.evaluate(() => window.__visualTable.updateTarget());
    await page.waitForFunction(() => window.__visualTable.tables[3].canvasWidth > 500);
  },
  async verify(page) {
    // 四种配置的实际宽高须符合固定值、自动增长及最大值边界。
    await page.evaluate(() => {
      const sizes = window.__visualTable.tables.map(table => [table.canvasWidth, table.canvasHeight]);
      if (Math.abs(sizes[0][0] - 300) > 2 || Math.abs(sizes[0][1] - 200) > 2 ||
        sizes[1][0] <= 500 || sizes[1][1] <= 300 ||
        sizes[2][0] > 501 || sizes[2][1] > 301 ||
        sizes[3][0] <= 500 || sizes[3][1] <= 300)
        throw new Error(`画布尺寸选项未生效：${JSON.stringify(sizes)}`);
    });
  }
};
