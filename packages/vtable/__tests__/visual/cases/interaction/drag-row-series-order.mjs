/**
 * BugServer case IDs: 673728e9013a5500b2fe99ca
 * 验证目的：行序号拖动两次后，记录顺序与表体显示同步变化。
 * 改写：将来源的人员和邮箱记录换成固定编号，保留行号拖动与列头拖动配置。
 */
export default {
  mount(container) {
    // 足够的匿名记录使两段录制拖动都落在可见表体内。
    container.style.height = '440px';
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'id', title: 'ID', width: 120 }, { field: 'value', title: 'Value', width: 140 }],
      records: Array.from({ length: 8 }, (_, index) => ({ id: index + 1, value: (index + 1) * 10 })),
      dragHeaderMode: 'column',
      rowSeriesNumber: { enable: true, title: 'No.', field: 'id', dragOrder: true, width: 60, style: { color: 'red' } }
    });
  },
  async exercise(page) {
    // 从行序号左侧拖动两段不同的行，并分别记录完成后的真实数据顺序。
    const drag = async (fromRow, toRow) => {
      const points = await page.evaluate(({ fromRow, toRow }) => {
        const table = window.__visualTable;
        const host = document.getElementById('table').getBoundingClientRect();
        return [fromRow, toRow].map(row => {
          const b = table.getCellRect(0, row).bounds;
          return { x: host.x + b.x1 + 18, y: host.y + (b.y1 + b.y2) / 2 };
        });
      }, { fromRow, toRow });
      await page.mouse.move(points[0].x, points[0].y);
      await page.mouse.down();
      await page.mouse.move(points[1].x, points[1].y, { steps: 15 });
      await page.mouse.up();
    };
    await drag(2, 5);
    await page.evaluate(() => {
      const order = window.__visualTable.records.map(record => record.id);
      if (order.join(',') === '1,2,3,4,5,6,7,8') throw new Error('首次行序号拖动未重排');
      window.__afterFirstOrder = order.join(',');
    });
    await drag(1, 4);
  },
  async verify(page) {
    // 两次拖动应分别改变顺序，同时保留全部记录且显示顺序跟随数据。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const order = table.records.map(record => record.id);
      if (order.join(',') === window.__afterFirstOrder ||
          order.slice().sort((a, b) => a - b).join(',') !== '1,2,3,4,5,6,7,8')
        throw new Error('第二次拖动结果或记录集合错误');
      for (let row = 1; row <= order.length; row++) {
        if (table.getCellOriginValue(1, row) !== order[row - 1]) throw new Error('显示顺序没有同步');
      }
    });
  }
};
