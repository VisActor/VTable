/**
 * BugServer case IDs: 69a68300ec91eb005f9ad659
 * 验证目的：barStyle 与 baselineStyle 函数根据任务索引给出不同 paddingTop。
 * 改写：匿名化任务，只保留来源的索引计算与日期关系。
 */
export default {
  mount(container) {
    // 两条任务触发不同的函数样式分支，使错位变化进入截图。
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
        // 函数配置是此来源与固定样式用例的核心差异。
        barStyle: ({ index }) => ({ paddingTop: 40 + 20 * ((index + 1) % 2),
          width: 25, barColor: '#3498db', completedBarColor: '#27ae60' }),
        baselineStyle: ({ index }) => ({ paddingTop: 10 + 20 * (index % 2),
          width: 15, barColor: 'gray' }) },
      timelineHeader: { colWidth: 50, scales: [{ unit: 'month', step: 1 },
        { unit: 'week', step: 1, startOfWeek: 'monday' }, { unit: 'day', step: 1 }] },
      minDate: '2024-06-30', maxDate: '2024-08-01'
    });
  },
  async verify(page) {
    // 两条不同索引任务必须可见，具体纵向布局通过视觉截图比较。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      if (gantt.records.length !== 2 || !(gantt.getTaskBarRelativeRect(0)?.width > 0) ||
        !(gantt.getTaskBarRelativeRect(1)?.width > 0)) throw new Error('函数 paddingTop 任务未绘制');
    });
  }
};
