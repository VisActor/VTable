/**
 * 验证目的：缩窄 Gantt 任务列表列头后，双层日期时间轴和任务条仍正常布局。
 * 独立匿名用例；不关联含业务流程信息的 BugServer 来源 ID。
 */
export default {
  mount(container) {
    // 固定的匿名任务和日、小时双层刻度形成列头与日期表头的交界。
    container.style.height = '400px';
    return new window.VTableGantt.Gantt(container, {
      records: [
        { id: 'a', title: 'Task A', start: '2025-01-02 09:00', end: '2025-01-02 15:00', checked: false },
        { id: 'b', title: 'Task B', start: '2025-01-03 08:00', end: '2025-01-03 12:00', checked: false }
      ],
      taskListTable: {
        columns: [
          { field: 'checked', title: '', width: 50, cellType: 'checkbox', headerType: 'checkbox' },
          { field: 'title', title: 'Task', width: 220 },
          { field: 'start', title: 'Start', width: 160 }
        ],
        tableWidth: 'auto', frozenColCount: 1
      },
      frame: { verticalSplitLineMoveable: true },
      taskBar: { startDateField: 'start', endDateField: 'end', labelText: '{title}' },
      minDate: '2025-01-02 00:00', maxDate: '2025-01-04 00:00',
      markLine: [{ date: '2025-01-02 13:30:00', style: { lineColor: 'red', lineWidth: 1 } }],
      rowHeight: 40, headerRowHeight: 40,
      timelineHeader: { colWidth: 40, scales: [{ unit: 'day', step: 1 }, { unit: 'hour', step: 1 }] }
    });
  },
  async exercise(page) {
    // 按真实列头右边界向左拖动约 60px，而非直接调用调整列宽 API。
    const point = await page.evaluate(() => {
      const table = window.__visualTable.taskListTableInstance;
      const bounds = table.getCellRect(1, 0).bounds;
      const host = table.getContainer().getBoundingClientRect();
      window.__ganttColumnWidthBefore = table.getColWidth(1);
      return { x: host.x + bounds.x2 - 1, y: host.y + (bounds.y1 + bounds.y2) / 2 };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x - 60, point.y, { steps: 12 });
    await page.mouse.up();
  },
  async verify(page) {
    // 列宽应确实缩小，时间轴与任务条仍可计算有效位置。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      const table = gantt.taskListTableInstance;
      const width = table.getColWidth(1);
      const timeX = gantt.getXByTime(new Date('2025-01-02T13:30:00').getTime());
      if (width > window.__ganttColumnWidthBefore - 30 ||
        !Number.isFinite(timeX) || !gantt.getTaskBarRelativeRect(0))
        throw new Error(`Gantt 列头缩窄后布局错误：${window.__ganttColumnWidthBefore} -> ${width}`);
    });
  }
};
