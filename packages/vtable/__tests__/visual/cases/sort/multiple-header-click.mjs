/**
 * BugServer case IDs: 66cd81605e11d900c8f0e968
 * 验证目的：multipleSort 模式依次点击两个排序表头后保留两个排序状态。
 * 改写：保留重复 sortID 和两个点击动作，缩减无关格式化字段。
 */
export default {
  mount(container) {
    // 重复 sortID 让第二排序字段有机会决定相邻记录的顺序。
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'sortID', title: 'Sort ID', width: 150, sort: true },
        { field: 'name', title: 'Name', width: 150, sort: true }],
      records: [{ id: 1, sortID: 6, name: 'a' }, { id: 2, sortID: 4, name: 'd' },
        { id: 3, sortID: 4, name: 'c' }, { id: 4, sortID: 2, name: 'a' },
        { id: 5, sortID: 3, name: 'b' }, { id: 6, sortID: 5, name: 'c' }],
      multipleSort: true, widthMode: 'standard'
    });
  },
  async exercise(page) {
    // 点击两个真实表头排序图标，而不是直接写入 sortState。
    for (const col of [1, 2]) {
      const point = await page.evaluate(col => {
        // 图标位于标题内容右侧；按场景图实际边界定位，避免把列右边界当作图标。
        const cell = window.__visualTable.scenegraph.getCell(col, 0);
        const stack = [cell];
        let icon;
        while (stack.length && !icon) {
          const mark = stack.pop();
          if (mark.attribute?.funcType === 'sort') icon = mark;
          else stack.push(...(mark.children ?? []));
        }
        if (!icon) throw new Error(`第 ${col} 列排序图标未渲染`);
        const bounds = icon.globalAABBBounds;
        const host = document.getElementById('table').getBoundingClientRect();
        return { x: host.x + (bounds.x1 + bounds.x2) / 2, y: host.y + (bounds.y1 + bounds.y2) / 2 };
      }, col);
      await page.mouse.move(point.x, point.y);
      await page.mouse.click(point.x, point.y);
    }
  },
  async verify(page) {
    // 两个真实点击后排序状态必须同时保留两个字段。
    await page.evaluate(() => {
      const states = window.__visualTable.sortState;
      if (!Array.isArray(states) || states.length !== 2 ||
        !states.some(state => state.field === 'sortID') || !states.some(state => state.field === 'name'))
        throw new Error(`复合排序状态异常: ${JSON.stringify(states)}`);
    });
  }
};
