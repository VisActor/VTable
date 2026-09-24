/**
 * BugServer case IDs: 6a68596802c575005f77ab28
 * 验证目的：项目子任务内联显示时，空任务和两个子任务的相对矩形不同。
 * 改写：省略 BugServer 状态条，改由测试断言检查原有 click_cell 触发条件。
 */
export default {
  mount(container) {
    // 固定时间轴和记录，保留来源用例的空行与两个分离子任务。
    container.style.height = '400px';
    const types = window.VTableGantt.TYPES;
    const table = new window.VTableGantt.Gantt(container, {
      records: [
        { id: 1, title: 'Project', type: types.TaskType.PROJECT, children: [
          { id: 11, title: 'Task A', start: '2024-07-01', end: '2024-07-04', progress: 30 },
          { id: 12, title: 'Task B', start: '2024-07-08', end: '2024-07-12', progress: 60 }
        ] },
        { id: 2, title: 'Empty task row' }
      ],
      taskListTable: { columns: [
        { field: 'title', title: 'title', width: 220 },
        { field: 'start', title: 'start', width: 120 },
        { field: 'end', title: 'end', width: 120 },
        { field: 'progress', title: 'progress', width: 100 }
      ], tableWidth: 260 },
      taskKeyField: 'id',
      tasksShowMode: types.TasksShowMode.Project_Sub_Tasks_Inline,
      taskBar: { startDateField: 'start', endDateField: 'end', progressField: 'progress' },
      minDate: '2024-07-01', maxDate: '2024-07-20',
      timelineHeader: { colWidth: 36, scales: [{ unit: 'day', step: 1 }] },
      grid: { verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' }, horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' } }
    });
    window.__ganttClicked = false;
    table.taskListTableInstance?.on('click_cell', args => {
      if (args.col === 0 && args.row === 0) window.__ganttClicked = true;
    });
    return table;
  },
  async exercise(page) {
    // 点击来源指定的左侧任务单元格，再验证事件与矩形。
    const point = await page.evaluate(() => {
      const bounds = window.__visualTable.taskListTableInstance.getCellRect(0, 0).bounds;
      const host = document.getElementById('table').getBoundingClientRect();
      return { x: host.x + (bounds.x1 + bounds.x2) / 2, y: host.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.click(point.x, point.y);
  },
  async verify(page) {
    // 空任务必须无矩形，两个子任务必须各有有限且分离的布局。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (!window.__ganttClicked) throw new Error('任务表点击事件未触发');
      const empty = table.getTaskBarRelativeRect(1);
      const first = table.getTaskBarRelativeRect(0, [0, 0]);
      const second = table.getTaskBarRelativeRect(0, [0, 1]);
      const valid = rect => rect && ['left', 'top', 'width', 'height'].every(key => Number.isFinite(rect[key]));
      if (empty !== null || !valid(first) || !valid(second) || first.left === second.left)
        throw new Error('任务条相对矩形不符合预期');
    });
  }
};
