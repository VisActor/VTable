/// <reference types="jest" />

/**
 * operate-data.ts 工具单测
 *
 * 测试覆盖：
 * - add_record: 添加单条记录
 * - add_records: 添加多条记录
 * - delete_records: 删除记录
 * - update_records: 更新记录
 * - 参数验证（Zod schema）
 * - 错误处理（非 ListTable、缺少方法等）
 */

import { operateDataTools } from '../../src/plugins/tools/operate-data';
import { createMockListTable, setupMockTable, cleanupMockTable } from '../test-utils';

describe('operate-data tools', () => {
  beforeEach(() => {
    cleanupMockTable();
  });

  afterEach(() => {
    cleanupMockTable();
  });

  describe('add_record', () => {
    const tool = operateDataTools.find(t => t.name === 'add_record')!;

    test('应该成功添加单条记录（无 recordIndex）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({ record: { id: 1, name: 'Test' } });

      expect(result).toBe('Success');
      expect(mockTable.addRecord).toHaveBeenCalledWith({ id: 1, name: 'Test' }, undefined);
    });

    test('应该成功添加单条记录（带 number recordIndex）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({ record: { id: 1, name: 'Test' }, recordIndex: 0 });

      expect(result).toBe('Success');
      expect(mockTable.addRecord).toHaveBeenCalledWith({ id: 1, name: 'Test' }, 0);
    });

    test('应该成功添加单条记录（带 number[] recordIndex）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({ record: { id: 1, name: 'Test' }, recordIndex: [0, 2] });

      expect(result).toBe('Success');
      expect(mockTable.addRecord).toHaveBeenCalledWith({ id: 1, name: 'Test' }, [0, 2]);
    });

    test('应该验证参数 schema（缺少 record）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该验证参数 schema（recordIndex 为负数）', async () => {
      await expect(tool.inputSchema.parseAsync({ record: { id: 1 }, recordIndex: -1 })).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ record: { id: 1 } })).rejects.toThrow(
        'VTable instance not found. Make sure VTable is initialized.'
      );
    });

    test('应该抛出错误（不是 ListTable）', async () => {
      const mockTable = {
        isListTable: jest.fn(() => false)
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ record: { id: 1 } })).rejects.toThrow(
        'VTable instance is not a ListTable (requires ListTable).'
      );
    });

    test('应该抛出错误（缺少 addRecord 方法）', async () => {
      const mockTable = {
        isListTable: jest.fn(() => true)
        // 没有 addRecord 方法
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ record: { id: 1 } })).rejects.toThrow(
        'VTable instance does not support addRecord (requires ListTable)'
      );
    });
  });

  describe('add_records', () => {
    const tool = operateDataTools.find(t => t.name === 'add_records')!;

    test('应该成功添加多条记录（无 recordIndex）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const records = [{ id: 1 }, { id: 2 }];
      const result = await (tool.execute as any)({ records });

      expect(result).toBe('Success');
      expect(mockTable.addRecords).toHaveBeenCalledWith(records, undefined);
    });

    test('应该成功添加多条记录（带 recordIndex）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const records = [{ id: 1 }, { id: 2 }];
      const result = await (tool.execute as any)({ records, recordIndex: 0 });

      expect(result).toBe('Success');
      expect(mockTable.addRecords).toHaveBeenCalledWith(records, 0);
    });

    test('应该验证参数 schema（records 为空数组）', async () => {
      await expect(tool.inputSchema.parseAsync({ records: [] })).rejects.toThrow();
    });

    test('应该验证参数 schema（缺少 records）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ records: [{ id: 1 }] })).rejects.toThrow(
        'VTable instance not found. Make sure VTable is initialized.'
      );
    });

    test('应该抛出错误（不是 ListTable）', async () => {
      const mockTable = {
        isListTable: jest.fn(() => false)
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ records: [{ id: 1 }] })).rejects.toThrow(
        'VTable instance is not a ListTable (requires ListTable).'
      );
    });
  });

  describe('delete_records', () => {
    const tool = operateDataTools.find(t => t.name === 'delete_records')!;

    test('应该成功删除记录（number[]）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const recordIndexs = [0, 1, 2];
      const result = await (tool.execute as any)({ recordIndexs });

      expect(result).toBe('Success');
      expect(mockTable.deleteRecords).toHaveBeenCalledWith(recordIndexs);
    });

    test('应该成功删除记录（number[][] 树形结构）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const recordIndexs = [[0], [0, 2]];
      const result = await (tool.execute as any)({ recordIndexs });

      expect(result).toBe('Success');
      expect(mockTable.deleteRecords).toHaveBeenCalledWith(recordIndexs);
    });

    test('应该验证参数 schema（recordIndexs 为空数组）', async () => {
      await expect(tool.inputSchema.parseAsync({ recordIndexs: [] })).rejects.toThrow();
    });

    test('应该验证参数 schema（缺少 recordIndexs）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ recordIndexs: [0] })).rejects.toThrow(
        'VTable instance not found. Make sure VTable is initialized.'
      );
    });

    test('应该抛出错误（不是 ListTable）', async () => {
      const mockTable = {
        isListTable: jest.fn(() => false)
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ recordIndexs: [0] })).rejects.toThrow(
        'VTable instance is not a ListTable (requires ListTable).'
      );
    });
  });

  describe('update_records', () => {
    const tool = operateDataTools.find(t => t.name === 'update_records')!;

    test('应该成功更新记录', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const records = [{ id: 1, name: 'A1' }];
      const recordIndexs = [0];
      const result = await (tool.execute as any)({ records, recordIndexs });

      expect(result).toBe('Success');
      expect(mockTable.updateRecords).toHaveBeenCalledWith(records, recordIndexs);
    });

    test('应该成功更新多条记录', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const records = [
        { id: 1, name: 'A1' },
        { id: 2, name: 'A2' }
      ];
      const recordIndexs = [0, 1];
      const result = await (tool.execute as any)({ records, recordIndexs });

      expect(result).toBe('Success');
      expect(mockTable.updateRecords).toHaveBeenCalledWith(records, recordIndexs);
    });

    test('应该成功更新记录（树形结构索引）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      const records = [{ id: 1, name: 'A1' }];
      const recordIndexs = [[0, 2]];
      const result = await (tool.execute as any)({ records, recordIndexs });

      expect(result).toBe('Success');
      expect(mockTable.updateRecords).toHaveBeenCalledWith(records, recordIndexs);
    });

    test('应该验证参数 schema（records 为空数组）', async () => {
      await expect(tool.inputSchema.parseAsync({ records: [], recordIndexs: [] })).rejects.toThrow();
    });

    test('应该验证参数 schema（recordIndexs 为空数组）', async () => {
      await expect(tool.inputSchema.parseAsync({ records: [{ id: 1 }], recordIndexs: [] })).rejects.toThrow();
    });

    test('应该抛出错误（records 和 recordIndexs 长度不匹配）', async () => {
      const mockTable = createMockListTable();
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ records: [{ id: 1 }], recordIndexs: [0, 1] })).rejects.toThrow(
        'records length (1) must match recordIndexs length (2)'
      );
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ records: [{ id: 1 }], recordIndexs: [0] })).rejects.toThrow(
        'VTable instance not found. Make sure VTable is initialized.'
      );
    });

    test('应该抛出错误（不是 ListTable）', async () => {
      const mockTable = {
        isListTable: jest.fn(() => false)
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ records: [{ id: 1 }], recordIndexs: [0] })).rejects.toThrow(
        'VTable instance is not a ListTable (requires ListTable).'
      );
    });
  });
});
