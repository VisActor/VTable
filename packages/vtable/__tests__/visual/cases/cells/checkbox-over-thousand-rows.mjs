/**
 * BugServer case IDs: 653b2f891053b2a37d5dc9b9
 * 验证目的：超过千行时滚动到远端后，冻结复选列仍可点击并保存状态。
 * 改写：重复固定匿名状态构建 2000 行，保留滚动和实际鼠标点击。
 */
export default {
  mount(container) {
    // 五种复选状态重复 400 次，覆盖禁用、选中和未定义状态。
    const states = [
      { text: 'unchecked', checked: false, disable: false },
      { text: 'disabled', checked: false, disable: true },
      { text: 'checked', checked: true, disable: false },
      { text: 'locked', checked: true, disable: true },
      { text: 'unknown', disable: false }
    ];
    const records = Array.from({ length: 2000 }, (_, index) => ({
      check: { ...states[index % states.length] }, name: `Item ${index + 1}`
    }));
    return new window.VTable.ListTable(container, {
      columns: [{ field: '', title: 'All', headerType: 'checkbox', cellType: 'checkbox', width: 60 },
        { field: 'check', title: 'Check', headerType: 'checkbox', cellType: 'checkbox', width: 130 },
        { field: 'name', title: 'Name', width: 150 }],
      records, defaultRowHeight: 32, frozenColCount: 2, allowFrozenColCount: 2
    });
  },
  async exercise(page) {
    // 跳至第 1201 条记录并点击其未选中的冻结复选格。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      table.setScrollTop(1200 * 32);
      const b = table.getCellRelativeRect(1, 1201).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      window.__farCheckboxBefore = table.getCellCheckboxState(1, 1201);
      return { x: host.x + b.x1 + 20, y: host.y + (b.y1 + b.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 远端目标状态由 false 变 true，同时维持 2000 条记录。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (window.__farCheckboxBefore !== false || table.getCellCheckboxState(1, 1201) !== true ||
        table.rowCount !== 2001 || table.getScrollTop() < 30000)
        throw new Error(`千行复选格更新失败：${JSON.stringify({ before: window.__farCheckboxBefore,
          after: table.getCellCheckboxState(1, 1201), rows: table.rowCount, scrollTop: table.getScrollTop() })}`);
    });
  }
};
