/**
 * BugServer case IDs: 69a682bc1d0efd005e397e30
 * 验证目的：固定 paddingTop 分别移动任务条与计划基线，月周日刻度同时绘制。
 * 改写：任务和人员信息替换为通用文字，保留行高、日期与基线样式。
 */
export default {
  mount(container) {
    // 两条任务覆盖不同进度，验证静态间距在同一行高下稳定绘制。
    container.style.height = '400px';
    return new window.VTableGantt.Gantt(container, {
      records: [
        { id: 1, title: 'Task A', startDate: '2024-07-05', endDate: '2024-07-14',
          baselineStartDate: '2024-07-01', baselineEndDate: '2024-07-10', progress: 80 },
        { id: 2, title: 'Task B', startDate: '2024-07-08', endDate: '2024-07-12',
          baselineStartDate: '2024-07-03', baselineEndDate: '2024-07-08', progress: 100 }
      ],
      taskListTable: { columns: [{ field: 'title', title: 'Task', width: 100 },
        { field: 'progress', title: 'Progress', width: 100 }],
      tableWidth: 'auto', minTableWidth: 100, maxTableWidth: 500 },
      headerRowHeight: 50, rowHeight: 90,
      taskBar: { startDateField: 'startDate', endDateField: 'endDate', progressField: 'progress',
        baselineStartDateField: 'baselineStartDate', baselineEndDateField: 'baselineEndDate',
        labelText: '{title}',
        barStyle: { paddingTop: 40, width: 25, barColor: '#3498db', completedBarColor: '#27ae60' },
        baselineStyle: { paddingTop: 10, width: 15, barColor: 'gray' } },
      timelineHeader: { colWidth: 50, scales: [{ unit: 'month', step: 1 },
        { unit: 'week', step: 1, startOfWeek: 'monday' }, { unit: 'day', step: 1 }] },
      minDate: '2024-06-30', maxDate: '2024-08-01'
    });
  },
  async verify(page) {
    // 两条任务必须各自形成有效的任务条矩形，间距外观由基线截图检查。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      if (gantt.records.length !== 2 || !(gantt.getTaskBarRelativeRect(0)?.width > 0) ||
        !(gantt.getTaskBarRelativeRect(1)?.width > 0)) throw new Error('静态 paddingTop 任务未绘制');
    });
  }
};
