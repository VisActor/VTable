/**
 * BugServer case IDs: 67c161acd824e100b091a557
 * 验证目的：树形任务的子任务条可移动并调整结束日期。
 * 改写：任务名及日期换成固定示例，保留展开层级、moveable 和 resizable。
 */
export default {
  mount(container) {
    // 展开的父任务使子任务条对应可见行 1。
    container.style.height = '400px';
    return new window.VTableGantt.Gantt(container, {
      records: [{ id: 'group', title: 'Group', start: '2025-01-02', end: '2025-01-13',
        progress: 20, hierarchyState: 'expand', children: [
          { id: 'child', title: 'Child', start: '2025-01-04', end: '2025-01-06', progress: 10 }
        ] }],
      taskListTable: { columns: [{ field: 'title', title: 'Task', width: 170, tree: true },
        { field: 'start', title: 'Start', width: 110 }], tableWidth: 280 },
      taskKeyField: 'id', taskBar: { startDateField: 'start', endDateField: 'end',
        progressField: 'progress', moveable: true, resizable: true, labelText: '{title}' },
      minDate: '2025-01-01', maxDate: '2025-01-25',
      rowHeight: 40, timelineHeader: { colWidth: 35, scales: [{ unit: 'day', step: 1 }] }
    });
  },
  async exercise(page) {
    // 子任务先向右移动两天，再拖动右边缘延长一天。
    const first = await page.evaluate(() => {
      const rect = window.__visualTable.getTaskBarRelativeRect(1);
      if (!rect) throw new Error('子任务条未渲染');
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + rect.left + rect.width / 2,
        y: host.y + rect.top + rect.height / 2 };
    });
    await page.mouse.move(first.x, first.y);
    await page.mouse.down();
    await page.mouse.move(first.x + 70, first.y, { steps: 12 });
    await page.mouse.up();
    await page.evaluate(() => {
      const child = window.__visualTable.records[0].children[0];
      window.__childAfterMove = { start: child.start, end: child.end };
    });
    const edge = await page.evaluate(() => {
      const rect = window.__visualTable.getTaskBarRelativeRect(1);
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + rect.left + rect.width - 3,
        y: host.y + rect.top + rect.height / 2 };
    });
    await page.mouse.move(edge.x, edge.y);
    await page.mouse.down();
    await page.mouse.move(edge.x + 35, edge.y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // 起始日期和末日期应分别响应移动与右缘拉伸。
    await page.evaluate(() => {
      const child = window.__visualTable.records[0].children[0];
      if (window.__childAfterMove.start === '2025-01-04' ||
        child.end === window.__childAfterMove.end)
        throw new Error(`树形任务移动或拉伸未生效：${JSON.stringify(child)}`);
    });
  }
};
