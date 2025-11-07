import { adjustWidthResizedColMap } from '../src/state/cell-move/adjust-header';

describe('adjustWidthResizedColMap - Extended Tests', () => {
  let mockTable: any;

  beforeEach(() => {
    // 模拟表格对象
    mockTable = {
      internalProps: {
        _widthResizedColMap: new Set()
      }
    };
  });

  // 测试用例1：报告的bug场景
  test('修复后 - 列2移动到位置5', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([2, 4, 5]);

    // 移动参数 - 将列2移动到位置5
    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证修复后的结果
    const result = Array.from(mockTable.internalProps._widthResizedColMap);
    expect(new Set(result)).toEqual(new Set([3, 4, 5]));
  });

  // 测试用例2：多列移动
  test('多列移动 - 连续2列向后移动', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([1, 2, 3, 5, 7]);

    // 移动参数 - 将列1和2（2列）移动到位置6
    const moveContext = {
      sourceIndex: 1,
      targetIndex: 6,
      sourceSize: 2
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果：
    // 原列1,2 -> 移到位置6,7
    // 原列3 -> 位置1
    // 原列5 -> 位置3
    // 原列7 -> 位置5
    const result = Array.from(mockTable.internalProps._widthResizedColMap);
    expect(new Set(result)).toEqual(new Set([1, 3, 5, 6, 7]));
  });

  // 测试用例3：向前移动多列
  test('多列向前移动', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 6, 7, 8]);

    // 移动参数 - 将列6和7（2列）移动到位置2
    const moveContext = {
      sourceIndex: 6,
      targetIndex: 2,
      sourceSize: 2
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果：
    // 原列1 -> 位置1
    // 原列3 -> 位置5
    // 原列6,7 -> 位置2,3
    // 原列8 -> 位置8
    const result = Array.from(mockTable.internalProps._widthResizedColMap);
    expect(new Set(result)).toEqual(new Set([1, 2, 3, 5, 8]));
  });

  // 测试用例4：极端情况 - 单列移动到最后
  test('单列移动到最后位置', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([0, 2, 5, 9]);

    // 移动参数 - 将列2移动到位置10（超出原有最大列号）
    const moveContext = {
      sourceIndex: 2,
      targetIndex: 10,
      sourceSize: 1
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果：
    // 原列0 -> 位置0
    // 原列2 -> 位置10
    // 原列5 -> 位置4
    // 原列9 -> 位置8
    const result = Array.from(mockTable.internalProps._widthResizedColMap);
    expect(new Set(result)).toEqual(new Set([0, 4, 8, 10]));
  });

  // 测试用例5：复杂场景 - 有重复的列号
  test('处理重复的调整列号', () => {
    // 模拟可能出现重复的情况（虽然Set会去重）
    const mockSet = new Set([2, 4, 5]);
    mockTable.internalProps._widthResizedColMap = {
      size: mockSet.size,
      clear: jest.fn(() => mockSet.clear()),
      add: jest.fn(val => mockSet.add(val)),
      keys: jest.fn(() => mockSet.keys())
    };

    // 移动参数
    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证clear和add的调用
    expect(mockTable.internalProps._widthResizedColMap.clear).toHaveBeenCalled();
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(5); // 原来的2变成5
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(3); // 原来的4变成3
    expect(mockTable.internalProps._widthResizedColMap.add).toHaveBeenCalledWith(4); // 原来的5变成4
  });
});
