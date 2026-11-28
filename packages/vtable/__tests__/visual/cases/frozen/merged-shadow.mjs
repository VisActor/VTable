/**
 * 验证目的：左右冻结阴影跳过多个跨边界合并区间，并跟随真实滚动和主题切换。
 * 来源：独立固定数据样例；覆盖单行、多行、底部合并和默认主题样式。
 */
export default {
  mount(container) {
    container.style.width = '720px';
    container.style.height = '480px';
    const columns = Array.from({ length: 8 }, (_, col) => ({ field: `c${col}`, title: `C${col + 1}`, width: 140 }));
    const records = Array.from({ length: 14 }, (_, row) =>
      Object.fromEntries(columns.map((column, col) => [column.field, `R${row + 1} / C${col + 1}`]))
    );
    const theme = skipMergedCells => window.VTable.themes.DEFAULT.extends({
      frozenColumnLine: { shadow: { skipMergedCells } }
    });
    const table = new window.VTable.ListTable(container, {
      columns, records, frozenColCount: 2, rightFrozenColCount: 1, bottomFrozenRowCount: 1,
      defaultRowHeight: 36, defaultHeaderRowHeight: 44,
      theme: theme(true),
      customMergeCell: (col, row, instance) => {
        const firstRow = row === 3 ? 3 : row >= 6 && row <= 7 ? 6 : instance.rowCount - 1;
        const lastRow = firstRow === 6 ? 7 : firstRow;
        if (row < firstRow || row > lastRow) return;
        return {
          text: firstRow === 3 ? 'Merged A' : firstRow === 6 ? 'Merged B (two rows)' : 'Summary',
          range: { start: { col: 0, row: firstRow }, end: { col: instance.colCount - 1, row: lastRow } }
        };
      }
    });
    // 通过实际 checkbox 事件更新主题，验证运行时开关，而非直接写内部状态。
    const control = document.createElement('input');
    control.type = 'checkbox';
    control.checked = true;
    control.setAttribute('aria-label', 'Skip merged shadows');
    control.addEventListener('change', () => table.updateTheme(theme(control.checked)));
    container.after(control);
    return table;
  },
  async exercise(page) {
    await page.getByRole('checkbox', { name: 'Skip merged shadows' }).uncheck();
    await page.waitForFunction(() => {
      const component = window.__visualTable.scenegraph.component;
      return !component.frozenShadowLine.pathProxy && !component.rightFrozenShadowLine.pathProxy;
    });
    await page.getByRole('checkbox', { name: 'Skip merged shadows' }).check();
    const host = await page.locator('#table').boundingBox();
    await page.mouse.move(host.x + host.width / 2, host.y + 240);
    await page.mouse.wheel(180, 0);
    await page.waitForFunction(() => window.__visualTable.scrollLeft > 0);
    await page.mouse.wheel(0, 36);
    await page.waitForFunction(() => window.__visualTable.scrollTop > 0);
  },
  async verify(page) {
    // 检查路径对应的真实矩形区间，确保合并区域没有被阴影穿过且普通行恢复。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const defaults = window.VTable.themes.DEFAULT.frozenColumnLine.shadow;
      const theme = table.theme.frozenColumnLine.shadow;
      if (!theme.skipMergedCells || theme.width !== defaults.width ||
          theme.startColor !== defaults.startColor || theme.endColor !== defaults.endColor)
        throw new Error('阴影开关或默认样式错误');
      const mergedRows = [3, 6, 7, table.rowCount - 1];
      for (const shadow of [table.scenegraph.component.frozenShadowLine, table.scenegraph.component.rightFrozenShadowLine]) {
        if (typeof shadow.pathProxy !== 'function') throw new Error('冻结阴影缺少截断路径');
        const segments = shadow.pathProxy(shadow.attribute).commandList.map(command => ({
          start: command[2], end: command[2] + command[4]
        }));
        for (const row of [2, 3, 4, 5, 6, 7, 8, table.rowCount - 1]) {
          const rect = table.getCellRangeRelativeRect({ col: 1, row });
          const y = (rect.top + rect.bottom) / 2;
          if (y < table.getFrozenRowsHeight() || y >= shadow.attribute.height) continue;
          const covered = segments.some(segment => y >= segment.start && y < segment.end);
          if (covered === mergedRows.includes(row)) throw new Error(`行 ${row} 的阴影片段错误`);
        }
      }
    });
  }
};
