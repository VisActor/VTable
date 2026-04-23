// @ts-nocheck
/**
 * 测试键盘方向键导航时滚动和视图更新的正确性
 * 对应 issue: https://github.com/VisActor/VTable/issues/5105
 */
import { ListTable } from '../src';
import { createDiv } from './dom';
global.__VERSION__ = 'none';

describe('arrow key scroll - issue #5105', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '800px';
  containerDom.style.height = '600px';

  // 生成足够多的列来触发水平虚拟滚动（同时覆盖远端跳转选择）
  const colCount = 160;
  const columns = Array.from({ length: colCount }, (_, i) => ({
    field: `col_${i}`,
    title: `Column ${i}`,
    width: 100
  }));

  // 生成足够多的行来触发垂直虚拟滚动
  const rowCount = 200;
  // 这里不生成全量 cell 数据，避免测试在 CI 里因数据量过大变慢；
  // 这些用例只依赖“可滚动的行列数”和“选中单元格可见性”。
  const records = Array.from({ length: rowCount }, (_, rowIdx) => ({
    col_0: `R${rowIdx}C0`,
    col_15: `R${rowIdx}C15`,
    col_50: `R${rowIdx}C50`,
    col_150: `R${rowIdx}C150`
  }));

  const option = {
    columns,
    records,
    defaultColWidth: 100,
    defaultRowHeight: 40
  };

  const listTable = new ListTable(containerDom, option);

  afterAll(() => {
    // Prevent open handles (raf/timers) from keeping Jest running.
    listTable.release();
  });

  test('selectCell 向右移动单元格时 scrollLeft 应正确更新', () => {
    // 选中初始位置
    listTable.selectCell(0, 1);
    const initialScrollLeft = listTable.scrollLeft;
    expect(initialScrollLeft).toBe(0);

    // 逐步向右移动到超出可视区域的列
    // 800px 宽度 / 100px 每列 ≈ 8 列可见
    // 移动到第 10 列应该触发水平滚动
    for (let col = 1; col <= 10; col++) {
      listTable.selectCell(col, 1);
    }
    // 到第10列时应该已经触发了滚动
    expect(listTable.scrollLeft).toBeGreaterThan(0);
  });

  test('selectCell 向右移动时目标列应保持可见', () => {
    listTable.setScrollLeft(0);
    listTable.selectCell(0, 1);

    // 连续向右移动到第 15 列
    for (let col = 1; col <= 15; col++) {
      listTable.selectCell(col, 1);
    }

    const proxy = listTable.scenegraph.proxy;
    expect(listTable.cellIsInVisualView(15, 1)).toBe(true);
    expect(proxy.colStart).toBeLessThanOrEqual(15);
    expect(proxy.colEnd).toBeGreaterThanOrEqual(15);
  });

  test('大幅度向右移动后视图状态应一致', () => {
    listTable.setScrollLeft(0);
    listTable.selectCell(0, 1);

    // 直接跳到远处的列（模拟 Ctrl+ArrowRight 跳到很远的位置）
    listTable.selectCell(150, 1);
    const scrollLeft = listTable.scrollLeft;

    // 滚动位置应该大于 0（因为第150列远超可视范围）
    expect(scrollLeft).toBeGreaterThan(0);

    // proxy 的 colStart/colEnd 应该包含当前可见列
    const proxy = listTable.scenegraph.proxy;
    expect(listTable.cellIsInVisualView(150, 1)).toBe(true);
    expect(proxy.colStart).toBeLessThanOrEqual(150);
    expect(proxy.colEnd).toBeGreaterThanOrEqual(150);
  });

  test('向右再向左移动时滚动位置应正确恢复', () => {
    listTable.setScrollLeft(0);
    listTable.selectCell(0, 1);

    // 先向右移动
    for (let col = 1; col <= 20; col++) {
      listTable.selectCell(col, 1);
    }
    const scrollAfterRight = listTable.scrollLeft;
    expect(scrollAfterRight).toBeGreaterThan(0);

    // 再向左移动回来
    for (let col = 19; col >= 0; col--) {
      listTable.selectCell(col, 1);
    }
    // 回到第0列时 scrollLeft 应该回到 0
    expect(listTable.scrollLeft).toBe(0);
  });

  test('向下再向上移动时 scrollTop 应正确更新', () => {
    listTable.setScrollTop(0);
    listTable.selectCell(0, 1);

    // 600px 高度 / 40px 行高 ≈ 15 行可见（含表头）
    // 移动到第 20 行应该触发垂直滚动
    for (let row = 2; row <= 20; row++) {
      listTable.selectCell(0, row);
    }
    expect(listTable.scrollTop).toBeGreaterThan(0);
  });

  test('setX 在首个 screenLeft 解析失败时应重试并保持目标列可见', () => {
    listTable.setScrollLeft(0);
    listTable.selectCell(0, 1);

    const originalGetTargetColAt = listTable.getTargetColAt.bind(listTable);
    let firstLookup = true;
    const getTargetColAtSpy = jest.spyOn(listTable, 'getTargetColAt').mockImplementation((absoluteX: number) => {
      if (firstLookup) {
        firstLookup = false;
        return null;
      }
      return originalGetTargetColAt(absoluteX);
    });

    listTable.selectCell(150, 1);

    expect(getTargetColAtSpy.mock.calls.length).toBeGreaterThan(1);
    expect(listTable.cellIsInVisualView(150, 1)).toBe(true);
    expect(listTable.scenegraph.proxy.colStart).toBeLessThanOrEqual(150);
    expect(listTable.scenegraph.proxy.colEnd).toBeGreaterThanOrEqual(150);

    getTargetColAtSpy.mockRestore();
  });

  test('setBodyAndColHeaderX 应正确跳过 border 元素获取列组', () => {
    const scenegraph = listTable.scenegraph;

    // 验证 setBodyAndColHeaderX 不会因 border 元素导致异常
    // 滚动到最右端
    const maxScrollLeft = listTable.getAllColsWidth() - listTable.tableNoFrameWidth;
    listTable.setScrollLeft(maxScrollLeft);

    expect(scenegraph.bodyGroup.lastChild.type).not.toBe('group');
    expect(listTable.cellIsInVisualView(colCount - 1, 1)).toBe(true);
  });

  test('setY 在首个 screenTop 解析失败时应重试并保持目标行可见', () => {
    listTable.setScrollTop(0);
    listTable.selectCell(0, 1);

    const originalGetTargetRowAt = listTable.getTargetRowAt.bind(listTable);
    let firstLookup = true;
    const getTargetRowAtSpy = jest.spyOn(listTable, 'getTargetRowAt').mockImplementation((absoluteY: number) => {
      if (firstLookup) {
        firstLookup = false;
        return null;
      }
      return originalGetTargetRowAt(absoluteY);
    });

    listTable.selectCell(0, 120);

    expect(getTargetRowAtSpy.mock.calls.length).toBeGreaterThan(1);
    expect(listTable.cellIsInVisualView(0, 120)).toBe(true);
    expect(listTable.scenegraph.proxy.rowStart).toBeLessThanOrEqual(120);
    expect(listTable.scenegraph.proxy.rowEnd).toBeGreaterThanOrEqual(120);

    getTargetRowAtSpy.mockRestore();
  });

  test('连续快速向右 selectCell 模拟快速按键', () => {
    listTable.setScrollLeft(0);

    // 模拟快速按住 ArrowRight 不放，连续选中 50 个单元格
    for (let col = 0; col <= 50; col++) {
      listTable.selectCell(col, 1);
    }

    const scrollLeft = listTable.scrollLeft;
    const scenegraph = listTable.scenegraph;
    const proxy = scenegraph.proxy;

    // scrollLeft 应该合理增长
    expect(scrollLeft).toBeGreaterThan(0);

    // proxy 维护的列范围应该包含第50列
    expect(proxy.colEnd).toBeGreaterThanOrEqual(50);
    expect(proxy.colStart).toBeLessThanOrEqual(50);

    // body group 位置应该合理
    const bodyGroupX = scenegraph.bodyGroup.attribute.x;
    expect(bodyGroupX).toBeDefined();
    expect(typeof bodyGroupX).toBe('number');
  });
});
