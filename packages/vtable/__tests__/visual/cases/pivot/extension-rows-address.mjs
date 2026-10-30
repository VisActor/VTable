/**
 * BugServer case IDs: 6855015beb13a600a741dd62
 * 验证目的：空数据的扩展树路径反查返回完整地址，原主题切换条件能够通过。
 * 改写：使用匿名维度和值，保留两级扩展树、冻结列及树形布局配置。
 */
export default {
  mount(container) {
    // 三层维度只占两列行表头，避免用维度深度错误推算列号。
    container.style.width = '800px';
    container.style.height = '400px';
    const table = new window.VTable.PivotTable(container, {
      records: [],
      rows: [{ dimensionKey: 'main', title: 'Main', width: 'auto', minWidth: 100 }],
      rowTree: [{ dimensionKey: 'main', value: 'A' }, { dimensionKey: 'main', value: 'B' }],
      extensionRows: [{
        rows: ['group', 'item'].map(dimensionKey => ({ dimensionKey, title: dimensionKey, width: 'auto', minWidth: 100 })),
        rowTree: [
          { dimensionKey: 'group', value: 'G1', hierarchyState: 'expand', children: [
            { dimensionKey: 'item', value: 'I1', children: [], hierarchyState: 'expand' },
            { dimensionKey: 'item', value: 'I2', children: [], hierarchyState: 'expand' },
            { dimensionKey: 'item', value: 'I3', children: [], hierarchyState: 'expand' }
          ] },
          { dimensionKey: 'group', value: 'G2', hierarchyState: 'expand', children: [
            { dimensionKey: 'item', value: 'I4', children: [], hierarchyState: 'expand' }
          ] },
          { dimensionKey: 'group', value: 'Total', children: [] }
        ]
      }],
      indicators: [{ indicatorKey: 'amount', title: 'Amount', width: 'auto' }],
      frozenColCount: 3, rowExpandLevel: null, rowHierarchyType: 'tree',
      rowHierarchyIndent: 12, rowHierarchyTextStartAlignment: true,
      defaultRowHeight: 28, defaultHeaderRowHeight: 34, autoFillWidth: true
    });
    const paths = table.getCellHeaderPaths(1, 2);
    const address = table.getCellAddressByHeaderPaths({
      colHeaderPaths: paths.colHeaderPaths, rowHeaderPaths: paths.rowHeaderPaths
    });
    window.__extensionThemeSwitched = address?.col === 1 && address?.row === 2;
    if (window.__extensionThemeSwitched) table.updateTheme(window.VTable.themes.DARK);
    return table;
  },
  async verify(page) {
    // 地址断言先于截图，避免主题条件未触发时仍生成稳定但错误的截图。
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const table = window.__visualTable;
      for (let row = 1; row < table.rowCount; row++) {
        for (const col of [0, 1, 2]) {
          const paths = table.getCellHeaderPaths(col, row);
          const address = table.getCellAddressByHeaderPaths({
            colHeaderPaths: paths.colHeaderPaths, rowHeaderPaths: paths.rowHeaderPaths
          });
          const expectedCol = col === 2 ? 2 : 1;
          if (address?.col !== expectedCol || address?.row !== row)
            throw assertionError(`扩展树地址反查错误：${JSON.stringify({ col, row, address, expectedCol })}`);
        }
      }
      if (!window.__extensionThemeSwitched) throw assertionError('原主题切换条件未通过');
    });
  }
};
