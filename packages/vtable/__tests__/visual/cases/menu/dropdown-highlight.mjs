/**
 * BugServer case IDs: 65d4959b97cc3d008de5b594
 * 验证目的：列下拉菜单设置高亮项后，同时绘制菜单状态图标。
 * 改写：个人信息和长 SVG 改为通用数据与本地小图标，保留三个图标属性及 ROW_DESC 菜单键。
 */
export default {
  mount(container) {
    // 菜单项的普通、选中、状态图标分别配置，再标记降序项高亮。
    const triangle = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M1 2 L11 2 L6 10 Z" fill="#666"/></svg>';
    const selected = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M1 2 L11 2 L6 10 Z" fill="#378fff"/></svg>';
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 80 },
        { field: 'code', title: 'Code', width: 180, dropDownMenu: [
          { text: 'Descending', menuKey: 'ROW_DESC', icon: { svg: triangle },
            selectedIcon: { svg: selected }, stateIcon: { svg: selected } },
          { text: 'Ascending', menuKey: 'ROW_ASC', icon: { svg: triangle } }
        ] }],
      records: [{ id: 1, code: 'A' }, { id: 2, code: 'B' }, { id: 3, code: 'C' }]
    });
    table.setDropDownMenuHighlight([{ row: 0, col: 1, menuKey: 'ROW_DESC' }]);
    return table;
  },
  async exercise(page) {
    // 打开列菜单，确保截图同时覆盖实际插入 DOM 的普通和选中 SVG。
    const point = await page.evaluate(() => {
      const bounds = window.__visualTable.getCellRect(1, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + bounds.x2 - 12, y: host.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.move(point.x, point.y);
    // 等待悬停图标完成绘制后再点击，避免依赖自动化操作速度。
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 菜单高亮状态、选中图标和表体记录必须同时保留。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const state = table.stateManager.menu.dropDownMenuHighlight;
      if (state?.[0]?.menuKey !== 'ROW_DESC' || state[0].col !== 1 || table.getCellValue(1, 1) !== 'A')
        throw new Error('下拉菜单高亮状态未建立');
      const menu = document.querySelector('.vtable__menu-element--shown');
      if (menu?.querySelector('.vtable__menu-element--select path')?.getAttribute('fill') !== '#378fff' ||
          menu?.querySelector('.vtable__menu-element--normal path')?.getAttribute('fill') !== '#666')
        throw new Error('普通或选中菜单图标丢失');
    });
  }
};
