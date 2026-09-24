/**
 * BugServer case IDs: 6a82b5b68e0a21005e44edc9
 * 验证目的：ContextMenuPlugin 的冻结菜单回调发出 context_menu_click 事件。
 * 改写：去掉状态文本面板，保留插件回调的 menuKey、行列坐标和事件。
 */
export default {
  mount(container) {
    // 监听事件在执行菜单回调前安装，防止同步触发被漏掉。
    const plugin = new window.VTable.plugins.ContextMenuPlugin();
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 80 }, { field: 'name', title: 'Name', width: 160 },
        { field: 'city', title: 'City', width: 160 }, { field: 'value', title: 'Value', width: 120 }],
      records: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Name ${i + 1}`,
        city: ['North', 'South', 'East'][i % 3], value: Math.round((i + 1) * 12.6) })),
      defaultRowHeight: 40, defaultHeaderRowHeight: 40, widthMode: 'standard',
      heightMode: 'standard', plugins: [plugin]
    });
    window.__contextPlugin = plugin;
    window.__contextEvents = [];
    table.on('context_menu_click', args => window.__contextEvents.push(args));
    return table;
  },
  async exercise(page) {
    // 调用来源相同的冻结菜单回调，验证插件而非手工伪造事件。
    await page.evaluate(() => {
      const plugin = window.__contextPlugin;
      if (typeof plugin.handleMenuClickCallback !== 'function') throw new Error('菜单插件回调缺失');
      plugin.handleMenuClickCallback({ menuKey: 'freeze_to_this_row_and_column',
        menuText: 'Freeze to cell', rowIndex: 1, colIndex: 1 }, window.__visualTable);
    });
  },
  async verify(page) {
    // 必须收到插件真实发出的目标菜单事件。
    await page.waitForFunction(() => window.__contextEvents.some(event =>
      event.contextMenu?.menuKey === 'freeze_to_this_row_and_column'));
  }
};
