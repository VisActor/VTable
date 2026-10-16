/**
 * BugServer case IDs: 672b4d9ae4bb4400b299cbce
 * 验证目的：顶部单行图例与标题共存时，宿主缩窄后组件继续正常布局。
 * 改写：图例标签改为通用类别，保留 maxRow、标题和 800 到 300 像素变宽过程。
 */
export default {
  mount(container) {
    // 宿主先以宽布局挂载，然后模拟来源中的窄容器更新。
    container.style.width = '800px';
    container.style.height = '400px';
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'count', title: 'Count', width: 150 },
        { field: 'id', title: 'ID', width: 100 }],
      records: [{ count: 10, id: 1 }, { count: 20, id: 2 }],
      legends: { data: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'].map((label, i) =>
        ({ label, shape: { fill: ['#2E62F1', '#4DC36A', '#FF8406'][i % 3], symbolType: 'circle' } })),
        orient: 'top', position: 'start', maxRow: 1, padding: [50, 0, 0, 0] },
      title: { text: 'Legend Resize', align: 'center', subtext: 'Narrow container', orient: 'top', padding: 40 }
    });
    container.style.width = '300px';
    container.style.height = '300px';
    return table;
  },
  async verify(page) {
    // 缩窄后宿主宽度和末条数据均有效；组件布局由截图判断。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (document.getElementById('table').getBoundingClientRect().width !== 300 ||
        table.getCellValue(0, 2) !== 20)
        throw new Error('图例缩窄场景无效');
    });
  }
};
