/**
 * BugServer case IDs: 6aaf8946952abe004538cf80
 * 验证目的：setRecords 引入项目子任务后，项目起止时间按子任务边界重算。
 * 改写：去掉截图状态标签，保留原始子任务的逆序时间边界。
 */
export default {
  mount(container) {
    // 先创建普通任务，再用 setRecords 切换为无显式时间的项目。
    container.style.height = '360px';
    const gantt = new window.VTableGantt.Gantt(container, {
      records: [{ id: 1, name: 'Initial task', start: '2024-11-01', end: '2024-11-02' }],
      taskListTable: { columns: [{ field: 'name', title: 'Task', width: 160, tree: true },
        { field: 'start', title: 'Start', width: 110 }, { field: 'end', title: 'End', width: 110 }], tableWidth: 380 },
      tasksShowMode: window.VTableGantt.TYPES.TasksShowMode.Tasks_Separate,
      taskBar: { startDateField: 'start', endDateField: 'end', labelText: '{name}' },
      timelineHeader: { colWidth: 50, scales: [{ unit: 'week', step: 1, startOfWeek: 'monday' },
        { unit: 'day', step: 1 }] }, minDate: '2024-11-01', maxDate: '2024-11-30'
    });
    gantt.setRecords([{ id: 2, name: 'Project', type: 'project', children: [
      { id: 3, name: 'Design', start: '2024-11-15', end: '2024-11-18' },
      { id: 4, name: 'Review', start: '2024-11-12', end: '2024-11-20' }
    ] }]);
    return gantt;
  },
  async verify(page) {
    // 项目开始日期必须取较早子任务，结束日期必须取较晚子任务。
    await page.evaluate(() => {
      const project = window.__visualTable.records[0];
      if (project.start !== '2024-11-12' || project.end !== '2024-11-20')
        throw new Error(`项目时间未重算：${project.start} - ${project.end}`);
    });
  }
};
