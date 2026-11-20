import { assertionError } from '../../assertions.mjs';

/** 验证目的：主菜单与子菜单合计宽于容器时，子菜单仍在容器内且可以真实点击。 */
export default {
  mount(container) {
    // 长文本确定性触发左右均放不下的情况，避免依赖操作系统字体差异。
    const text = 'Wide menu ' + 'W'.repeat(80);
    window.__submenuBoundsEvents = [];
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'value', title: 'Value', width: 200 }],
      records: [{ value: 'A' }],
      menu: { renderMode: 'html', defaultHeaderMenuItems: [{ text, children: [
        { text, menuKey: 'enabled' }, { text: 'Disabled', menuKey: 'disabled', disabled: true }
      ] }] }
    });
    table.on('dropdown_menu_click', event => window.__submenuBoundsEvents.push(event.menuKey));
    return table;
  },
  async exercise(page) {
    // 通过表头真实打开菜单并悬停父项，断言翻转后的完整边界。
    const point = await page.evaluate(() => {
      const rect = window.__visualTable.getCellRect(0, 0).bounds;
      return { x: rect.x2 - 12, y: (rect.y1 + rect.y2) / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.mouse.click(point.x, point.y);
    const root = page.locator('.vtable__menu-element--shown').first();
    await root.locator('.vtable__menu-element__item').hover();
    const child = page.locator('.vtable__menu-element--shown').nth(1);
    await child.waitFor({ state: 'visible' });
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const menus = [...document.querySelectorAll('.vtable__menu-element--shown')];
      const host = menus[0].parentElement.getBoundingClientRect();
      const parent = menus[0].getBoundingClientRect();
      const child = menus[1].getBoundingClientRect();
      if (parent.width + child.width <= host.width) throw assertionError('未覆盖两侧均放不下的宽菜单');
      if (child.left < host.left || child.right > host.right)
        throw assertionError(`子菜单越界：${child.left}, ${child.right}；容器：${host.left}, ${host.right}`);
    });
    await child.locator('.vtable__menu-element__item-disabled').click();
    await child.locator('.vtable__menu-element__item').first().click();
    // 再次打开以保留宽菜单避让与重叠位置的截图证据。
    await page.mouse.move(point.x, point.y);
    await page.mouse.click(point.x, point.y);
    await root.locator('.vtable__menu-element__item').hover();
  },
  async verify(page) {
    // 禁用项无回调，正常项必须由真实点击触发且保留 menuKey。
    const events = await page.evaluate(() => window.__submenuBoundsEvents);
    if (events.length !== 1 || events[0] !== 'enabled') throw assertionError('宽子菜单点击或禁用保护失效');
  }
};
