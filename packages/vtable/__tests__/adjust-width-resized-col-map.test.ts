import { adjustWidthResizedColMap } from '../src/state/cell-move/adjust-header';

/**
 * 列移动后宽度调整映射更新的综合测试
 * 这些测试验证 adjustWidthResizedColMap 函数在各种场景下的正确性
 */
describe('列移动后宽度调整映射更新测试', () => {
  let mockTable: any;

  beforeEach(() => {
    // 创建模拟表格对象
    mockTable = {
      internalProps: {
        _widthResizedColMap: new Set()
      }
    };
  });

  // 测试场景1: 向后移动单列 (将列2移到位置5)
  test('向后移动单列 - 将列2移到位置5', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([2, 4, 5]);

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列2移到了位置5
    // - 列4变成了列3 (前移1位)
    // - 列5变成了列4 (前移1位)
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([3, 4, 5]));
  });

  // 测试场景2: 向前移动单列 (将列5移到位置2)
  test('向前移动单列 - 将列5移到位置2', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 5]);

    const moveContext = {
      sourceIndex: 5,
      targetIndex: 2,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列1保持不变
    // - 列3变成列4 (后移1位)
    // - 列5移到了位置2
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 2, 4]));
  });

  // 测试场景3: 向后移动多列 (将列1-2移到位置6)
  test('向后移动多列 - 将列1-2移到位置6', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([1, 2, 3, 5, 7]);

    const moveContext = {
      sourceIndex: 1,
      targetIndex: 6,
      sourceSize: 2,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列1-2移到了位置6-7
    // - 列3变成列1
    // - 列5变成列3
    // - 列7变成列5
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 3, 5, 6, 7]));
  });

  // 测试场景4: 向前移动多列 (将列6-7移到位置2)
  test('向前移动多列 - 将列6-7移到位置2', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 6, 7, 8]);

    const moveContext = {
      sourceIndex: 6,
      targetIndex: 2,
      sourceSize: 2,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列1保持不变
    // - 列3变成列5 (后移2位)
    // - 列6-7移到了位置2-3
    // - 列8保持不变
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 2, 3, 5, 8]));
  });

  // 测试场景5: 移动的列范围包含调整过宽度的列
  test('移动的列范围包含调整过宽度的列', () => {
    // 初始调整过列宽的列 (其中2,3,4都在移动范围内)
    mockTable.internalProps._widthResizedColMap = new Set([1, 2, 3, 4, 6]);

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 7,
      sourceSize: 3,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列1保持不变
    // - 列2-4移到了位置7-9
    // - 列6变成列3 (前移3位)
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 3, 7, 8, 9]));
  });

  // 测试场景6: 极端情况 - 移动到最后位置
  test('极端情况 - 移动到最后位置', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([0, 2, 5, 9]);

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 10,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列0保持不变
    // - 列2移到了位置10
    // - 列5变成列4
    // - 列9变成列8
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([0, 4, 8, 10]));
  });

  // 测试场景7: 极端情况 - 从最后位置移到最前面
  test('极端情况 - 从最后位置移到最前面', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([2, 5, 9, 10]);

    const moveContext = {
      sourceIndex: 9,
      targetIndex: 0,
      sourceSize: 2,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列9-10移到了位置0-1
    // - 列2变成列4 (后移2位)
    // - 列5变成列7 (后移2位)
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([0, 1, 4, 7]));
  });

  // 测试场景8: 边缘情况 - 空的调整集合
  test('边缘情况 - 空的调整集合', () => {
    // 初始没有调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set();

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果: 调整集合仍为空
    expect(mockTable.internalProps._widthResizedColMap.size).toBe(0);
  });

  // 测试场景9: 移动前后位置相同
  test('移动前后位置相同', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 5]);

    const moveContext = {
      sourceIndex: 3,
      targetIndex: 3,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果: 所有列位置不变
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 3, 5]));
  });

  // 测试场景10: 移动相邻位置
  test('移动相邻位置 - 前移一位', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([2, 3, 5]);

    const moveContext = {
      sourceIndex: 3,
      targetIndex: 2,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果:
    // - 列2变成列3 (后移1位)
    // - 列3移到了位置2
    // - 列5保持不变
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([2, 3, 5]));
  });

  // 测试场景11: 使用模拟函数验证内部调用
  test('使用模拟函数验证内部调用', () => {
    const mockSet = new Set([2, 4, 5]);
    mockTable.internalProps._widthResizedColMap = {
      size: mockSet.size,
      clear: jest.fn(() => mockSet.clear()),
      add: jest.fn(val => mockSet.add(val)),
      keys: jest.fn(() => mockSet.keys())
    };

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1,
      moveType: 'column'
    };

    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证内部函数调用
    expect(mockTable.internalProps._widthResizedColMap.clear).toHaveBeenCalled();
    expect(mockTable.internalProps._widthResizedColMap.keys).toHaveBeenCalled();

    // 验证正确的添加操作
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(5); // 原来的2变成5
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(3); // 原来的4变成3
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(4); // 原来的5变成4
  });
});
