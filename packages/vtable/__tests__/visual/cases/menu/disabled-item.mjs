/**
 * BugServer case IDs: 67fcb22b3376ca00a6024ff8
 * 验证目的：表头下拉菜单的子项可显示禁用状态。
 * 改写：缩短无关 SVG 和展示字段，保留 HTML 菜单、嵌套项及悬停点击顺序。
 */
export default {
  mount(container) {
    // 长标题用于覆盖菜单避让，子菜单第二项禁用。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'value', title: 'Value', width: 150 }, { field: 'name', title: 'Name', width: 150 }],
      records: [{ value: 10, name: 'A' }],
      menu: { renderMode: 'html', defaultHeaderMenuItems: [{ text: 'Sort options with long title', children: [
        { text: 'Ascending', menuKey: 'asc' }, { text: 'Descending', menuKey: 'desc', disabled: true }
      ] }] }
    });
  },
  async exercise(page) {
    // 鼠标到首列表头右边缘，点击菜单图标，再悬停父菜单项。
    const point = await page.evaluate(() => {
      const b = window.__visualTable.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + b.x2 - 12, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.click(point.x, point.y);
    await page.locator('.vtable__menu-element__item').filter({ hasText: 'Sort options with long title' }).first().hover();
  },
  async verify(page) {
    // 子菜单必须出现，Descending 带禁用样式。
    await page.waitForFunction(() => [...document.querySelectorAll('.vtable__menu-element__item-disabled')]
      .some(item => item.textContent?.includes('Descending')));
  }
};
