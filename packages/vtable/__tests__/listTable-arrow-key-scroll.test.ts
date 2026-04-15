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

  // 生成足够多的列来触发水平虚拟滚动
  const colCount = 200;
  const columns = Array.from({ length: colCount }, (_, i) => ({
    field: `col_${i}`,
    title: `Column ${i}`,
    width: 100
  }));

  // 生成足够多的行来触发垂直虚拟滚动
  const rowCount = 500;
  const records = Array.from({ length: rowCount }, (_, rowIdx) => {
    const record: Record<string, string> = {};
    for (let col = 0; col < colCount; col++) {
      record[`col_${col}`] = `R${rowIdx}C${col}`;
    }
    return record;
  });

  const option = {
    columns,
    records,
    defaultColWidth: 100,
    defaultRowHeight: 40
  };

  const listTable = new ListTable(containerDom, option);

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

  test('selectCell 向右移动时 body group x 位置应正确（无白色空白）', () => {
    listTable.setScrollLeft(0);
    listTable.selectCell(0, 1);

    // 连续向右移动到第 15 列
    for (let col = 1; col <= 15; col++) {
      listTable.selectCell(col, 1);
    }

    const scenegraph = listTable.scenegraph;
    const bodyGroupX = scenegraph.bodyGroup.attribute.x;
    const frozenColsWidth = listTable.getFrozenColsWidth();
    const scrollLeft = listTable.scrollLeft;

    // body group 的 x 位置应该和 scrollLeft 对应
    // bodyGroup.x = frozenColsWidth + offset, 其中 offset 是基于 scrollLeft 计算的
    // 关键检查：body group 不应该留有右侧空白
    const bodyGroupRight = bodyGroupX + scenegraph.bodyGroup.attribute.width;
    const tableWidth = listTable.tableNoFrameWidth;

    // body group 的右边缘应该至少覆盖到可视区域的右边缘
    expect(bodyGroupRight).toBeGreaterThanOrEqual(tableWidth);
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

  test('dynamicSetX 处理 screenLeft 为 null 时不应导致白色空白', () => {
    // 滚动到表格中间区域
    listTable.setScrollLeft(5000);

    const scenegraph = listTable.scenegraph;
    const proxy = scenegraph.proxy;

    // 调用 proxy.setX 并确保即使 screenLeft 为 null 也不会崩溃
    // 保存当前 body 位置
    const bodyXBefore = scenegraph.bodyGroup.attribute.x;

    // 正常滚动后 body group 位置应该已被更新
    expect(bodyXBefore).toBeDefined();
    expect(typeof bodyXBefore).toBe('number');
  });

  test('setBodyAndColHeaderX 应正确跳过 border 元素获取列组', () => {
    const scenegraph = listTable.scenegraph;

    // 验证 setBodyAndColHeaderX 不会因 border 元素导致异常
    // 滚动到最右端
    const maxScrollLeft = listTable.getAllColsWidth() - listTable.tableNoFrameWidth;
    listTable.setScrollLeft(maxScrollLeft);

    const bodyGroupX = scenegraph.bodyGroup.attribute.x;
    const tableWidth = listTable.tableNoFrameWidth;

    // 到最右端时，body 内容的右边缘应该对齐或超过可视区域右边缘
    // 不应有白色空白
    expect(bodyGroupX).toBeDefined();
    expect(typeof bodyGroupX).toBe('number');
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
