import { adjustWidthResizedColMap } from '../src/state/cell-move/adjust-header';

describe('adjustWidthResizedColMap', () => {
  let mockTable: any;

  beforeEach(() => {
    // 模拟表格对象
    mockTable = {
      internalProps: {
        _widthResizedColMap: new Set()
      }
    };
  });

  test('基本移动场景测试', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([2, 4, 5]);

    // 移动参数 - 将列2移动到位置5
    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1,
      targetSize: 2,
      moveType: 'column'
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([3, 4, 5]));
  });

  test('修复后的表现', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([2, 4, 5]);

    // 移动参数 - 将列2移动到位置5
    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1,
      targetSize: 2,
      moveType: 'column'
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 修复后的结果
    expect(new Set(Array.from(mockTable.internalProps._widthResizedColMap))).toEqual(new Set([3, 4, 5]));
    // 列2移到了5，列4变成了3，列5变成了4
  });

  test('向前移动场景', () => {
    // 设置初始状态
    mockTable.internalProps._widthResizedColMap = new Set([1, 3, 5]);

    // 移动参数 - 将列5移动到位置2
    const moveContext = {
      sourceIndex: 5,
      targetIndex: 2,
      sourceSize: 1,
      targetSize: 1,
      moveType: 'column'
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果 - 1不变，3变成4，5变成2
    expect(Array.from(mockTable.internalProps._widthResizedColMap).sort()).toEqual([1, 2, 4].sort());
  });

  test('无调整列宽的情况', () => {
    // 设置初始状态 - 没有调整过列宽
    mockTable.internalProps._widthResizedColMap = new Set();

    // 移动参数
    const moveContext = {
      sourceIndex: 2,
      targetIndex: 5,
      sourceSize: 1,
      targetSize: 2,
      moveType: 'column'
    };

    // 执行调整函数
    adjustWidthResizedColMap(moveContext, mockTable);

    // 验证结果 - 仍然是空的
    expect(mockTable.internalProps._widthResizedColMap.size).toBe(0);
  });
});
