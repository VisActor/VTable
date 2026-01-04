/**
 * 测试工具函数
 * 用于创建 Mock VTable 实例
 */

/**
 * 创建 Mock ListTable 实例
 */
export function createMockListTable() {
  const mockTable = {
    isListTable: jest.fn(() => true),
    addRecord: jest.fn(),
    addRecords: jest.fn(),
    deleteRecords: jest.fn(),
    updateRecords: jest.fn(),
    rowCount: 10,
    colCount: 5
  };
  return mockTable;
}

/**
 * 创建 Mock BaseTable 实例（非 ListTable）
 */
export function createMockBaseTable() {
  const mockTable = {
    isListTable: jest.fn(() => false),
    changeCellValue: jest.fn(),
    getCellValue: jest.fn((col: number, row: number) => `value-${row}-${col}`),
    rowCount: 10,
    colCount: 5
  };
  return mockTable;
}

/**
 * 设置全局 VTable 实例
 */
export function setGlobalVTableInstance(instance: any) {
  (globalThis as any).__vtable_instance = instance;
}

/**
 * 清除全局 VTable 实例
 */
export function clearGlobalVTableInstance() {
  delete (globalThis as any).__vtable_instance;
}

/**
 * 在每个测试前设置 Mock 实例
 */
export function setupMockTable(mockTable: any) {
  setGlobalVTableInstance(mockTable);
}

/**
 * 在每个测试后清理
 */
export function cleanupMockTable() {
  clearGlobalVTableInstance();
}
