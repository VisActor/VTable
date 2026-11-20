/**
 * BugServer case IDs: 6aaba81349fc4f005c341b4d
 * 验证目的：横向滚动到 end 时，冻结列阴影仅在存在溢出的一侧显示。
 * 改写：保留来源的 10 列宽度与 overflow 阴影配置，单元格只用通用编号。
 */
export default {
  mount(container) {
    // 580px 容器、左右各一冻结列产生可见的中间横向滚动区。
    container.style.width = '580px';
    container.style.height = '420px';
    const columns = Array.from({ length: 10 }, (_, col) => ({ field: 'c' + col, title: 'Column ' + (col + 1), width: 140 }));
    const records = Array.from({ length: 8 }, (_, row) =>
      Object.fromEntries(columns.map((column, col) => [column.field, 'R' + (row + 1) + ' / C' + (col + 1)])));
    return new window.VTable.ListTable(container, {
      columns, records, frozenColCount: 1, rightFrozenColCount: 1,
      defaultRowHeight: 42, defaultHeaderRowHeight: 44, widthMode: 'standard',
      theme: window.VTable.themes.DEFAULT.extends({
        frozenColumnLine: { shadow: { width: 18, startColor: 'rgba(34, 78, 138, 0.58)',
          endColor: 'rgba(34, 78, 138, 0)', visible: 'overflow' } }
      })
    });
  },
  async exercise(page) {
    // 与来源相同地用 setScrollLeft 定位；起点用例额外重放横向滚动后回到起点。
    await page.evaluate(() => window.__visualTable.setScrollLeft(Number.MAX_SAFE_INTEGER));

    await page.waitForFunction(expected => {
      const table = window.__visualTable;
      const left = table.scenegraph.component.frozenShadowLine.attribute.visible;
      const right = table.scenegraph.component.rightFrozenShadowLine.attribute.visible;
      return left === expected.left && right === expected.right;
    }, { left: true, right: false });
  },
  async verify(page) {
    // 检查滚动位置、冻结列数和阴影实际可见状态，截图负责颜色及边界。
    await page.evaluate(expected => {
      const table = window.__visualTable;
      const left = table.scenegraph.component.frozenShadowLine.attribute.visible;
      const right = table.scenegraph.component.rightFrozenShadowLine.attribute.visible;
      if (table.frozenColCount !== 1 || table.rightFrozenColCount !== 1 ||
          left !== expected.left || right !== expected.right ||
          (expected.position === 'start' ? table.scrollLeft !== 0 : table.scrollLeft <= 0))
        throw new Error('冻结阴影溢出状态错误');
    }, { left: true, right: false, position: 'end' });
  }
};
