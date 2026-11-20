/**
 * BugServer case IDs: 6a68957b3dd664005e729649
 * 验证目的：折叠树的隐藏子记录可按原始索引取消勾选，再清空整列复选状态。
 * 改写：来源的项目人员改为匿名分组，保留两次点击触发对应 API。
 */
export default {
  mount(container) {
    // 隐藏子节点保持初始选中，两个普通操作列单元格触发状态 API。
    const table = new window.VTable.ListTable(container, {
      columns: [
        { field: 'item', title: 'Item', tree: true, cellType: 'checkbox', headerType: 'checkbox', width: 230 },
        { field: 'action', title: 'Action', width: 260 }
      ],
      records: [
        { item: { text: 'Group A', checked: true }, action: 'Uncheck hidden child',
          hierarchyState: 'collapse', children: [
            { item: { text: 'Child A1', checked: true }, action: 'Hidden' },
            { item: { text: 'Child A2', checked: true }, action: 'Hidden' }
          ] },
        { item: { text: 'Group B', checked: true }, action: 'Clear all' }
      ],
      enableCheckboxCascade: false, enableHeaderCheckboxCascade: false,
      hierarchyIndent: 20, defaultRowHeight: 38
    });
    table.on('click_cell', ({ col, row }) => {
      // 用户点击操作列后分别调用隐藏记录索引和整列清除 API。
      if (col === 1 && row === 1) table.setCellCheckboxStateByRecordIndex([0, 0], 'item', false);
      if (col === 1 && row === 2) table.clearAllCheckboxState('item');
    });
    return table;
  },
  async exercise(page) {
    // 第一次点击后记录隐藏子节点状态，再点击第二行清除全部状态。
    const points = await page.evaluate(() => {
      const table = window.__visualTable;
      const host = document.getElementById('table').getBoundingClientRect();
      return [1, 2].map(row => {
        const b = table.getCellRect(1, row).bounds;
        return { x: host.x + (b.x1 + b.x2) / 2, y: host.y + (b.y1 + b.y2) / 2 };
      });
    });
    await page.mouse.click(points[0].x, points[0].y);
    await page.evaluate(() => {
      // 使用原始树路径检查隐藏子节点，不依赖它是否出现在当前可视行。
      const checked = window.__visualTable.stateManager.checkedState;
      if (checked.get('0,0')?.item !== false || checked.get('0')?.item !== true)
        throw new Error(`隐藏子节点状态异常：${JSON.stringify([...checked])}`);
    });
    await page.mouse.click(points[1].x, points[1].y);
  },
  async verify(page) {
    // 两次点击后，所有树节点的复选状态都应已清空。
    await page.evaluate(() => {
      const checked = window.__visualTable.stateManager.checkedState;
      if ([...checked.values()].some(state => state.item === true))
        throw new Error(`整列复选状态未清空：${JSON.stringify([...checked])}`);
    });
  }
};
