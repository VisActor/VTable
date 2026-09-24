/**
 * BugServer case IDs: 68948edf2b03ab00a30d5085
 * 验证目的：无任务记录的 Gantt 仍能绘制固定日期标记线和时间轴。
 * 改写：用固定日期代替日期辅助函数，保留无 records 与 markLine 对象。
 */
export default {
  mount(container) {
    // 空任务列表只保留时间轴和标记线，防止记录掩盖空状态错误。
    container.style.height = '400px';
    return new window.VTableGantt.Gantt(container, {
      taskListTable: { columns: [{ field: 'title', title: 'Task', width: 200 },
        { field: 'start', title: 'Start', width: 150 }, { field: 'end', title: 'End', width: 150 }],
      tableWidth: 400, minTableWidth: 100, maxTableWidth: 600 },
      taskBar: { startDateField: 'start', endDateField: 'end', labelText: '{title}' },
      timelineHeader: { colWidth: 60, scales: [{ unit: 'week', step: 1, startOfWeek: 'sunday' },
        { unit: 'day', step: 1 }] }, markLine: { date: new Date('2024-08-26T00:00:00') },
      minDate: '2024-08-01', maxDate: '2024-09-30', overscrollBehavior: 'none'
    });
  },
  async verify(page) {
    // 无记录时仍须有任务列表实例和有效时间轴宽度。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      if (gantt.records?.length || !gantt.taskListTableInstance || !(gantt.getXByTime(new Date('2024-08-26').getTime()) > 0))
        throw new Error('空 Gantt 标记线场景无效');
    });
  }
};
