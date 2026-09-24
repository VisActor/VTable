/**
 * BugServer case IDs: 69c38c89a81058005d23c094
 * 验证目的：点击时间轴左右两侧的任务定位图标，可将视口滚动到对应任务条。
 * 改写：匿名化任务名称，保留跨年时间轴、左右离屏任务及两次真实点击。
 */
export default {
  mount(container) {
    // 视口先停在年中，使前后任务分别位于左右离屏区。
    container.style.height = '400px';
    const gantt = new window.VTableGantt.Gantt(container, {
      records: [
        { id: 1, title: 'Task A', start: '2024-02-05', end: '2024-02-20', progress: 20 },
        { id: 2, title: 'Task B', start: '2024-03-10', end: '2024-03-18', progress: 60 },
        { id: 3, title: 'Task C', start: '2024-05-28', end: '2024-06-05', progress: 50 },
        { id: 4, title: 'Task D', start: '2024-10-05', end: '2024-10-20', progress: 40 },
        { id: 5, title: 'Task E', start: '2024-11-10', end: '2024-11-25', progress: 80 }
      ],
      taskListTable: { columns: [{ field: 'title', title: 'Task', width: 160 },
        { field: 'start', title: 'Start', width: 120 }],
      tableWidth: 280, minTableWidth: 240, maxTableWidth: 600 },
      taskKeyField: 'id', taskBar: { startDateField: 'start', endDateField: 'end',
        progressField: 'progress', locateIcon: true },
      minDate: '2024-01-01', maxDate: '2024-12-31',
      timelineHeader: { colWidth: 30, scales: [{ unit: 'day', step: 1 }] },
      scrollStyle: { visible: 'scrolling' }
    });
    gantt.scrollLeft = gantt.getXByTime(new Date('2024-06-01T00:00:00').getTime());
    window.__locateInitialScroll = gantt.scrollLeft;
    return gantt;
  },
  async exercise(page) {
    // 按任务定位图标的真实场景边界点击，先向左再向右定位。
    const clickIcon = async side => {
      // 每次滚动后重新寻找图标，避免使用失效的场景坐标。
      const point = await page.evaluate(side => {
        const gantt = window.__visualTable;
        const group = gantt.scenegraph.taskBar.locateIconsGroup;
        const icon = [...(group?.children ?? [])].find(mark =>
          mark.name === `task-bar-locate-icon-${side}` && mark.attribute.visibleAll !== false);
        if (!icon) throw new Error(`${side} 定位图标缺失`);
        const bounds = icon.globalAABBBounds;
        const canvas = gantt.canvas.getBoundingClientRect();
        return { x: canvas.x + (bounds.x1 + bounds.x2) / 2,
          y: canvas.y + (bounds.y1 + bounds.y2) / 2 };
      }, side);
      await page.mouse.click(point.x, point.y);
    };
    await clickIcon('left');
    await page.waitForFunction(() => window.__visualTable.scrollLeft < window.__locateInitialScroll - 100);
    await page.evaluate(() => { window.__locateLeftScroll = window.__visualTable.scrollLeft; });
    await clickIcon('right');
    await page.waitForFunction(() => window.__visualTable.scrollLeft > window.__locateLeftScroll + 100);
  },
  async verify(page) {
    // 两侧点击后视口必须发生双向移动，任务条数据仍保留。
    await page.evaluate(() => {
      const gantt = window.__visualTable;
      if (gantt.records.length !== 5 || gantt.scrollLeft <= window.__locateLeftScroll)
        throw new Error('离屏任务定位图标未完成双向滚动');
    });
  }
};
