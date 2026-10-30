import { assertionError } from '../../assertions.mjs';

/**
 * 验证目的：HTML 菜单文本与 SVG 不执行脚本，右键、表头、公开 API 和子菜单保留交互。
 */
export default {
  mount(container) {
    // 所有载荷只修改本地标记；网络探针仅使用测试服务上的固定路径。
    window.__menuXss = 0;
    window.__menuSecurityEvents = [];
    const payload = '<img src="/__menu_xss_missing__" onerror="window.__menuXss++">';
    const text = '"><b>Literal</b> &amp; " 中文';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" onload="window.__menuXss++">' +
      '<script>window.__menuXss++</script><foreignObject><img src="/__menu_xss_missing__" onerror="window.__menuXss++"/></foreignObject>' +
      '<path d="M1 1L11 1L6 11Z" fill="#666" onclick="window.__menuXss++"/></svg>';
    const items = [payload, { text, menuKey: 'object', icon: { svg, width: 12, height: 12 } },
      { type: 'title', text: payload }, { type: 'split' },
      { text: 'Selected', menuKey: 'selected', icon: { svg, width: 12, height: 12 },
        selectedIcon: { svg: svg.replace('#666', '#378fff') } },
      { text: 'Children', children: [payload, { text, menuKey: 'child' },
        { text: 'Disabled', menuKey: 'disabled', disabled: true }] },
      { icon: { svg: '<script>window.__menuXss++</script>', width: 12, height: 12 } }];
    window.__menuSecurityItems = items;
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'value', title: 'Value', width: 200 }], records: [{ value: 'A' }],
      menu: { renderMode: 'html', contextMenuItems: items, defaultHeaderMenuItems: items }
    });
    table.setDropDownMenuHighlight([{ col: 0, row: 0, menuKey: 'selected' },
      { col: 0, row: 1, menuKey: 'selected' }]);
    table.on('dropdown_menu_click', event => window.__menuSecurityEvents.push({ text: event.text, menuKey: event.menuKey }));
    return table;
  },
  async exercise(page) {
    // 捕获载荷请求并返回非图片内容，让旧实现的 onerror 可以确定性触发。
    let requests = 0;
    await page.route('**/__menu_xss_missing__', async route => {
      requests++;
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'not an image' });
    });
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      const header = table.getCellRect(0, 0).bounds;
      const body = table.getCellRect(0, 1).bounds;
      return { header: { x: host.x + header.x2 - 12, y: host.y + (header.y1 + header.y2) / 2 },
        body: { x: host.x + body.x1 + 20, y: host.y + (body.y1 + body.y2) / 2 } };
    });
    for (const entry of ['context', 'header', 'api']) {
      if (entry === 'context') {
        await page.mouse.click(points.body.x, points.body.y, { button: 'right' });
      } else if (entry === 'header') {
        await page.mouse.move(points.header.x, points.header.y);
        // 等待画布绘制悬停图标，避免快速点击命中尚未更新的表头。
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.mouse.click(points.header.x, points.header.y);
      } else {
        await page.evaluate(() => window.__visualTable.showDropDownMenu(0, 1,
          { content: window.__menuSecurityItems, position: { x: 10, y: 100 } }));
      }
      const root = page.locator('.vtable__menu-element--shown').first();
      await root.waitFor({ state: 'visible' });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.evaluate(async () => {
        const { assertionError } = await import(new URL('/suite/assertions.mjs', location.href).href);
        // 检查 DOM 与执行标记，不能只依赖无弹窗或截图。
        if (window.__menuXss !== 0) throw assertionError(`菜单脚本执行了 ${window.__menuXss} 次`);
        const root = document.querySelector('.vtable__menu-element--shown');
        const labels = root.querySelectorAll('.vtable__menu-element__item-text');
        const items = window.__menuSecurityItems;
        if (labels[0].textContent !== items[0] || labels[1].textContent !== items[1].text ||
            labels[2].textContent !== items[2].text || labels[5].textContent !== '')
          throw assertionError('菜单文本未按原文显示');
        if ([...labels].some(label => label.childElementCount) ||
            root.querySelector('img,script,foreignObject,[onload],[onclick],[onerror]'))
          throw assertionError('菜单中残留可执行内容');
        const selected = root.querySelector('.vtable__menu-element--select svg');
        if (selected?.querySelector('path')?.getAttribute('fill') !== '#378fff' ||
            selected.getAttribute('width') !== '12') throw assertionError('选中图标丢失');
      });
      await root.locator('.vtable__menu-element__item').filter({ hasText: /^Children$/ }).hover();
      const child = page.locator('.vtable__menu-element--shown').nth(1);
      await child.waitFor({ state: 'visible' });
      await page.evaluate(async () => {
        const { assertionError } = await import(new URL('/suite/assertions.mjs', location.href).href);
        // 子菜单两种文本形式必须同样保持字面内容。
        const labels = document.querySelectorAll('.vtable__menu-element--shown')[1]
          .querySelectorAll('.vtable__menu-element__item-text');
        const children = window.__menuSecurityItems[5].children;
        if (labels[0].textContent !== children[0] || labels[1].textContent !== children[1].text ||
            [...labels].some(label => label.childElementCount)) throw assertionError('子菜单文本被解析');
      });
      await child.locator('.vtable__menu-element__item-disabled').click();
      await child.locator('.vtable__menu-element__item').nth(1).click();
    }
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    if (requests) throw assertionError(`菜单载荷发起了 ${requests} 次请求`);
    // 最终保留正常菜单和子菜单，截图检查图标、布局、分隔线与禁用样式。
    await page.evaluate(() => window.__visualTable.showDropDownMenu(0, 1,
      { content: window.__menuSecurityItems, position: { x: 10, y: 100 } }));
    await page.locator('.vtable__menu-element--shown').first()
      .locator('.vtable__menu-element__item').filter({ hasText: /^Children$/ }).hover();
  },
  async verify(page) {
    // 三个入口各产生一次有效点击，禁用项不能触发事件，载荷不能执行。
    await page.evaluate(async () => {
      const { assertionError } = await import(new URL('/suite/assertions.mjs', location.href).href);
      const events = window.__menuSecurityEvents;
      const expected = window.__menuSecurityItems[5].children[1];
      if (window.__menuXss !== 0) throw assertionError(`菜单脚本执行了 ${window.__menuXss} 次`);
      if (events.length !== 3 || events.some(event => event.menuKey !== 'child' || event.text !== expected.text))
        throw assertionError('菜单点击数据或禁用行为发生变化');
    });
  }
};
