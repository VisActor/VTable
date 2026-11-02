/**
 * BugServer case IDs: 6a1416f2709fdc006857f1dc
 * 验证目的：冻结行与虚拟滚动后，绘制、坐标、命中记录一致，表头选择不改变滚动位置。
 * 改写：使用匿名序号记录，保留冻结行、inline 表头选择和滚动动作。
 */
export default {
  mount(container) {
    // 超过虚拟布局维护行数，覆盖初始滚动与滚动条跳转的节点重排。
    container.style.height = '400px';
    const table = new window.VTable.ListTable(container, {
      columns: [{ field: 'name', title: 'Name', width: 180 },
        { field: 'value', title: 'Value', width: 120 }, { field: 'group', title: 'Group', width: 140 },
        { field: 'note', title: 'Note', width: 140 }],
      records: Array.from({ length: 2000 }, (_, i) => ({ name: `Item ${i + 1}`, value: i, group: `G${i % 4}`, note: `N${i % 3}` })),
      frozenRowCount: 5, heightMode: 'standard', widthMode: 'standard',
      select: { headerSelectMode: 'inline', highlightMode: 'column' },
      theme: window.VTable.themes.DEFAULT.extends({ scrollStyle: { visible: 'always', hoverOn: false } })
    });
    table.selectCell(2, 0);
    table.setScrollTop(10000);
    return table;
  },
  async exercise(page) {
    // 等布局完成再跳转，确保覆盖原例中像素稳定但仍错位的分支。
    await waitForLayout(page);
    await checkGeometry(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      if (window.__visualTable.scrollTop !== 10000) throw assertionError('初始滚动位置错误');
    });
    await page.mouse.click(365, 15);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      if (window.__visualTable.scrollTop !== 10000) throw assertionError('表头点击改变初始滚动位置');
    });
    await page.mouse.click(584, 275);
    await waitForLayout(page);
    await checkGeometry(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      window.__scrollBeforeHeaderClick = window.__visualTable.scrollTop;
      if (window.__scrollBeforeHeaderClick <= 10000) throw assertionError('滚动条点击未推进滚动位置');
    });
    await page.mouse.click(393, 19);
  },
  async verify(page) {
    // 表头仍被选中，滚动值与实际可见记录均不因选择而改变。
    await waitForLayout(page);
    await checkGeometry(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const table = window.__visualTable;
      const range = table.getSelectedCellRanges()[0];
      if (table.scrollTop !== window.__scrollBeforeHeaderClick ||
        !range || range.start.row !== 0 || range.start.col !== 2)
        throw assertionError(`滚动后的表头选择异常：${JSON.stringify(range)}`);
    });
  }
};

/** 等待虚拟节点生成和内容更新完成，不以固定延时或截图稳定代替布局状态。 */
async function waitForLayout(page) {
  await page.waitForFunction(() => {
    const scene = window.__visualTable.scenegraph, p = scene.proxy;
    return !p.isProgressing && !scene._needUpdateContainer && p.colUpdatePos > p.colEnd &&
      p.rowUpdatePos > p.rowEnd && p.currentCol >= p.totalCol && p.currentRow >= p.totalRow;
  });
}

/** 用公开命中行寻找可见图元，核对记录文本及同一画布坐标系下的位置。 */
async function checkGeometry(page) {
  await page.evaluate(async () => {
    const { assertionError } = await import('/suite/assertions.mjs');
    const table = window.__visualTable;
    let checked = 0;
    for (let y = table.getFrozenRowsHeight() + 20; y < table.tableNoFrameHeight - 5; y += 40) {
      const hit = table.getCellAtRelativePosition(40, y);
      const graphic = table.scenegraph.getCell(0, hit.row);
      if (graphic?.role !== 'cell' || graphic.row !== hit.row)
        throw assertionError(`可见图元缺失：row=${hit.row}`);
      const rect = table.getCellRelativeRect(0, hit.row).bounds;
      const bounds = graphic.globalAABBBounds;
      const text = graphic.children.find(child => child.type === 'text')?.attribute.text;
      if (Math.abs(bounds.y1 - rect.y1) > 1 || y < bounds.y1 || y >= bounds.y2 ||
          text !== table.getCellValue(0, hit.row))
        throw assertionError(`绘制与命中不一致：${JSON.stringify({ row: hit.row, y, expected: rect.y1, actual: bounds.y1, text })}`);
      checked++;
    }
    if (!checked) throw assertionError('没有验证任何可见记录');
  });
}
