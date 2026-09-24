/**
 * BugServer case IDs: 69a6810b2d80dd005eccdeac
 * 验证目的：Gantt 任务条下方显示计划基线，三级时间轴与进度同时绘制。
 * 改写：任务文字和人员字段改为通用名称，保留实际、基线日期及样式结构。
 */
export default {
  mount(container) {
    // 固定跨月日期，确保月、周、日三级刻度与基线都进入截图。
    container.style.height = '400px';
    return new window.VTableGantt.Gantt(container, {
      records: [
        { id: 1, title: 'Task A', startDate: '2024-07-05', endDate: '2024-07-14',
          baselineStartDate: '2024-07-01', baselineEndDate: '2024-07-10', progress: 80 },
        { id: 2, title: 'Task B', startDate: '2024-07-15', endDate: '2024-07-25',
          baselineStartDate: '2024-07-11', baselineEndDate: '2024-07-20', progress: 40 },
        { id: 3, title: 'Task C', startDate: '2024-08-05', endDate: '2024-08-20',
          baselineStartDate: '2024-08-01', baselineEndDate: '2024-08-15', progress: 0 }
      ],
      taskListTable: { columns: [
        { field: 'title', title: 'Task', width: 100 },
        { field: 'progress', title: 'Progress', width: 100, format: value => `${value}%` }
      ], tableWidth: 'auto', minTableWidth: 100, maxTableWidth: 500 },
      headerRowHeight: 50, rowHeight: 90,
      taskBar: {
        startDateField: 'startDate', endDateField: 'endDate', progressField: 'progress',
        baselineStartDateField: 'baselineStartDate', baselineEndDateField: 'baselineEndDate',
        labelText: '{title}', labelTextStyle: { fontFamily: 'Arial', fontSize: 14, color: '#ffffff' },
        barStyle: { width: 25, barColor: '#3498db', completedBarColor: '#27ae60', cornerRadius: 5 },
        baselineStyle: { width: 15, barColor: 'gray', cornerRadius: 5 }
      },
      timelineHeader: { backgroundColor: '#EEF1F5', colWidth: 50, scales: [
        { unit: 'month', step: 1 }, { unit: 'week', step: 1, startOfWeek: 'monday' }, { unit: 'day', step: 1 }
      ] },
      minDate: '2024-06-30', maxDate: '2024-09-01',
      grid: { horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' } }, overscrollBehavior: 'none'
    });
  },
  async verify(page) {
    // 任务表与任务条的矩形应同时有效，基线外观由截图比较。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      const rect = gantt.getTaskBarRelativeRect(0);
      if (!rect || !(rect.width > 0) || !gantt.taskListTableInstance)
        throw new Error('Gantt 任务条或任务表缺失');
    });
  }
};
