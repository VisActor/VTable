/**
 * BugServer case IDs: 69a681c22d80dd005eccdead
 * 验证目的：基线与任务条使用 overlap 布局时两层都进入绘制。
 * 改写：任务名称匿名化，保留交叠日期、进度与 overlap 配置。
 */
export default {
  mount(container) {
    // 第一条基线先于任务开始，第二条基线与任务结束重叠。
    container.style.height = '400px';
    return new window.VTableGantt.Gantt(container, {
      records: [{ id: 1, title: 'Task A', startDate: '2024-07-05', endDate: '2024-07-14',
        baselineStartDate: '2024-07-01', baselineEndDate: '2024-07-10', progress: 80 },
      { id: 2, title: 'Task B', startDate: '2024-07-08', endDate: '2024-07-12',
        baselineStartDate: '2024-07-03', baselineEndDate: '2024-07-08', progress: 100 }],
      taskListTable: { columns: [{ field: 'title', title: 'Task', width: 100 },
        { field: 'progress', title: 'Progress', width: 100 }], tableWidth: 'auto', minTableWidth: 100, maxTableWidth: 500 },
      headerRowHeight: 50, rowHeight: 90,
      taskBar: { startDateField: 'startDate', endDateField: 'endDate', progressField: 'progress',
        baselineStartDateField: 'baselineStartDate', baselineEndDateField: 'baselineEndDate',
        baselinePosition: 'overlap', labelText: '{title}',
        barStyle: { width: 25, barColor: '#3498db', completedBarColor: '#27ae60' },
        baselineStyle: { width: 15, barColor: 'gray' } },
      timelineHeader: { colWidth: 50, scales: [{ unit: 'week', step: 1, startOfWeek: 'monday' },
        { unit: 'day', step: 1 }] }, minDate: '2024-06-30', maxDate: '2024-08-01'
    });
  },
  async verify(page) {
    // 两条任务条的相对矩形均须可用，基线相对位置由截图比较。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      if (gantt.records.length !== 2 || !(gantt.getTaskBarRelativeRect(0)?.width > 0) ||
        !(gantt.getTaskBarRelativeRect(1)?.width > 0)) throw new Error('overlap 任务条未绘制');
    });
  }
};
