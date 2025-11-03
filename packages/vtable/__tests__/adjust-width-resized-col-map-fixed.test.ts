import { adjustWidthResizedColMapFixed } from '../src/state/cell-move/adjust-header-fixed';

/**
 * 测试列移动后宽度调整映射更新的修复版本
 * 验证 adjustWidthResizedColMapFixed 函数在各种场景下的正确性
 */
describe('列移动后宽度调整映射更新修复版测试', () => {
  let mockTable: any;

  beforeEach(() => {
    // 创建模拟表格对象
    mockTable = {
      internalProps: {
        _widthResizedColMap: new Set()
      }
    };
  });

  // 测试场景1: 主要修复场景 - bug复现并确认修复
  test('修复bug - 源列位置在目标位置之前的情况', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([2, 4, 5]);

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1
    };

    adjustWidthResizedColMapFixed(moveContext, mockTable);

    // 验证结果:
    // - 列2移到了位置5
    // - 列4变成了列3 (前移1位)
    // - 列5变成了列4 (前移1位)
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([3, 4, 5]));
  });

  // 测试场景2: 向前移动单列
  test('向前移动单列', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 5]);

    const moveContext = {
      sourceIndex: 5,
      targetIndex: 2,
      sourceSize: 1
    };

    adjustWidthResizedColMapFixed(moveContext, mockTable);

    // 验证结果:
    // - 列1保持不变
    // - 列3变成列4 (后移1位)
    // - 列5移到了位置2
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 2, 4]));
  });

  // 测试场景3: 多列复杂移动场景
  test('多列复杂移动场景', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([0, 2, 3, 5, 6, 8, 10]);

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 7,
      sourceSize: 2
    };

    adjustWidthResizedColMapFixed(moveContext, mockTable);

    // 验证结果:
    // - 列0保持不变
    // - 列2-3移到了位置7-8
    // - 列5变成列3
    // - 列6变成列4
    // - 列8变成列6
    // - 列10变成列8
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([0, 3, 4, 6, 7, 8]));
  });

  // 测试场景4: 边缘情况 - 被移动的列范围包含或不包含调整过的列
  test('边缘情况 - 被移动的列范围包含或不包含调整过的列', () => {
    // 初始调整过列宽的列 (包含在移动范围内的列3，不包含的列1和6)
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 6]);

    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 2
    };

    adjustWidthResizedColMapFixed(moveContext, mockTable);

    // 验证结果:
    // - 列1保持不变
    // - 列3移到了位置6 (在移动范围内)
    // - 列6变成列4 (前移2位)
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([1, 4, 6]));
  });

  // 测试场景5: 特殊情况 - 移动范围非常大
  test('特殊情况 - 移动范围非常大', () => {
    // 初始调整过列宽的列
    mockTable.internalProps._widthResizedColMap = new Set([5, 10, 15, 20]);

    const moveContext = {
      sourceIndex: 0,
      targetIndex: 25,
      sourceSize: 5
    };

    adjustWidthResizedColMapFixed(moveContext, mockTable);

    // 验证结果:
    // - 列5移到了位置30 (已在移动范围后，后移25位)
    // - 列10移到了位置5 (在移动范围内部，前移5位)
    // - 列15移到了位置10 (在移动范围内部，前移5位)
    // - 列20移到了位置15 (在移动范围内部，前移5位)
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([0, 5, 10, 15]));
  });

  // 测试场景6: 比较修复前后结果 - 使用模拟函数详细验证
  test('比较修复前后结果 - 详细验证添加的值', () => {
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
      sourceSize: 1
    };

    adjustWidthResizedColMapFixed(moveContext, mockTable);

    // 验证内部函数调用
    expect(mockTable.internalProps._widthResizedColMap.clear).toHaveBeenCalled();
    expect(mockTable.internalProps._widthResizedColMap.keys).toHaveBeenCalled();

    // 验证正确的添加操作
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(5); // 原来的2变成5
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(3); // 原来的4变成3
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(4); // 原来的5变成4
  });
});
