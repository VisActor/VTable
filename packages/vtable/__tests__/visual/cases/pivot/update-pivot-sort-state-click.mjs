/**
 * BugServer case IDs: 6708f3b739265200a62f816c
 * 验证目的：点击透视表排序图标后，通过 pivot_sort_click 更新 pivotSortState。
 * 改写：日期与指标名称换成固定通用字段，保留虚拟列树与事件回写路径。
 */
export default {
  mount(container) {
    // 排序图标出现在两个行维度及部分指标中，事件回调统一写入降序状态。
    const table = new window.VTable.PivotTable(container, {
      records: [
        { day: '2024-08-01', week: 'Thu', quantityA: 1, amountA: 4, quantityB: 2, amountB: 2 },
        { day: '2024-08-03', week: 'Sat', quantityA: 2, amountA: 3, quantityB: 2, amountB: 2 },
        { day: '2024-08-07', week: 'Wed', quantityA: 3, amountA: 2, quantityB: 2, amountB: 2 },
        { day: '2024-08-09', week: 'Fri', quantityA: 4, amountA: 1, quantityB: 2, amountB: 2 }
      ],
      rows: [{ dimensionKey: 'day', title: 'Day', showSort: true, width: 120 },
        { dimensionKey: 'week', title: 'Week', showSort: true, width: 90 }],
      columns: [{ dimensionKey: 'group', title: 'Group' }],
      columnTree: [
        { dimensionKey: 'group', value: 'A', virtual: true,
          children: [{ indicatorKey: 'quantityA' }, { indicatorKey: 'amountA' }] },
        { dimensionKey: 'group', value: 'B', virtual: true,
          children: [{ indicatorKey: 'quantityB' }, { indicatorKey: 'amountB' }] }
      ],
      indicators: [{ indicatorKey: 'quantityA', title: 'Quantity A', showSort: true },
        { indicatorKey: 'amountA', title: 'Amount A', showSort: true },
        { indicatorKey: 'quantityB', title: 'Quantity B' },
        { indicatorKey: 'amountB', title: 'Amount B' }],
      corner: { titleOnDimension: 'all' }, widthMode: 'standard'
    });
    window.__pivotSortClicks = 0;
    table.on('pivot_sort_click', event => {
      // 与来源相同，外部业务处理后把点击维度写回专用排序状态接口。
      window.__pivotSortClicks++;
      table.updatePivotSortState([{ dimensions: event.dimensionInfo, order: 'desc' }]);
      table.renderWithRecreateCells();
    });
    return table;
  },
  async exercise(page) {
    // 查找首个透视排序图标并真正点击，避免直接设置状态绕过事件。
    const point = await page.evaluate(() => {
      const table = window.__visualTable;
      for (let row = 0; row < table.rowCount; row++) {
        for (let col = 0; col < table.colCount; col++) {
          const stack = [table.scenegraph.getCell(col, row)];
          while (stack.length) {
            const mark = stack.pop();
            if (mark?.attribute?.funcType === 'sort') {
              const bounds = mark.globalAABBBounds;
              const host = document.getElementById('table').getBoundingClientRect();
              return { x: host.x + (bounds.x1 + bounds.x2) / 2,
                y: host.y + (bounds.y1 + bounds.y2) / 2 };
            }
            stack.push(...(mark?.children ?? []));
          }
        }
      }
      throw new Error('透视排序图标缺失');
    });
    await page.mouse.click(point.x, point.y);
    await page.waitForFunction(() => window.__pivotSortClicks > 0);
  },
  async verify(page) {
    // 事件发生后专用 pivotSortState 必须保存一条降序维度路径。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (window.__pivotSortClicks < 1 || table.pivotSortState?.[0]?.order !== 'desc' ||
        !table.pivotSortState[0].dimensions?.length)
        throw new Error(`透视排序状态未回写：${JSON.stringify(table.pivotSortState)}`);
    });
  }
};
