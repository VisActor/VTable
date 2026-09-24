/**
 * BugServer case IDs: 6a326895a44900005e2b8e22
 * 验证目的：拖动任务条后起止日期与 MOVE_END_TASK_BAR 事件同步更新。
 * 改写：任务名称匿名化，保留按天时间轴、moveable 配置及真实拖动动作。
 */
export default {
  mount(container) {
    // 两个普通任务为拖动前后提供稳定的时间和位置参照。
    container.style.height = '400px';
    const gantt = new window.VTableGantt.Gantt(container, {
      records: [{ id: 1, title: 'Task A', start: '2024-12-05', end: '2024-12-12', progress: 20 },
        { id: 2, title: 'Task B', start: '2024-12-10', end: '2024-12-18', progress: 35 }],
      taskListTable: { columns: [{ field: 'title', title: 'Task', width: 160 },
        { field: 'start', title: 'Start', width: 120 }], tableWidth: 280 },
      taskKeyField: 'id', taskBar: { startDateField: 'start', endDateField: 'end',
        progressField: 'progress', moveable: true, labelText: '{title}' },
      minDate: '2024-12-01', maxDate: '2024-12-31',
      timelineHeader: { colWidth: 30, scales: [{ unit: 'day', step: 1 }] }
    });
    window.__moveTaskBarEvent = null;
    gantt.on('move_end_task_bar', args => { window.__moveTaskBarEvent = args; });
    return gantt;
  },
  async exercise(page) {
    // 从首个任务条中心向右拖动两个日期刻度。
    const point = await page.evaluate(() => {
      const rect = window.__visualTable.getTaskBarRelativeRect(0);
      if (!rect) throw new Error('任务条未渲染');
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + rect.left + rect.width / 2,
        y: host.y + rect.top + rect.height / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x + 60, point.y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // 日期必须实质变化，且拖动完成事件引用同一条任务记录。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      if (gantt.records[0].start === '2024-12-05' ||
        window.__moveTaskBarEvent?.record?.id !== 1)
        throw new Error(`任务拖动未更新：${gantt.records[0].start}`);
    });
  }
};
