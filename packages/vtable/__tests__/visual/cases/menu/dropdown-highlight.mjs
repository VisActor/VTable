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
  async verify(page) {
    // 菜单高亮状态和表体记录必须同时保留，状态图标交由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const state = table.stateManager.menu.dropDownMenuHighlight;
      if (state?.[0]?.menuKey !== 'ROW_DESC' || state[0].col !== 1 || table.getCellValue(1, 1) !== 'A')
        throw new Error('下拉菜单高亮状态未建立');
    });
  }
};
