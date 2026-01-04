/**
 * VTable（ListTable）数据操作工具集
 *
 * 基于 ListTable 的公开 API：
 * - addRecord(record, recordIndex?)
 * - addRecords(records, recordIndex?)
 * - deleteRecords(recordIndexs)
 * - updateRecords(records, recordIndexs)
 *
 * ⚠️ 注意：这些 API 仅 ListTable 支持，执行前必须判定 table.isListTable() === true
 *
 * @module operate-data
 */

import { z } from 'zod';

import type { ListTableAPI } from '@visactor/vtable';

/**
 * 扩展的 ListTableAPI 类型，支持实际的 recordIndex 参数类型（number | number[]）
 * 注意：ListTableAPI 接口定义中 recordIndex 是 number | undefined，
 * 但实际实现支持 number | number[] | undefined（用于树形结构等场景）
 */
type VTableListTableDataApi = Partial<ListTableAPI>;

function getVTableInstance(): VTableListTableDataApi {
  const table = (globalThis as unknown as { __vtable_instance?: unknown }).__vtable_instance;
  if (!table) {
    throw new Error('VTable instance not found. Make sure VTable is initialized.');
  }
  return table as VTableListTableDataApi;
}

function ensureListTable(table: VTableListTableDataApi): void {
  if (typeof table.isListTable !== 'function' || !table.isListTable()) {
    throw new Error('VTable instance is not a ListTable (requires ListTable).');
  }
}

const nonNegativeInt = z.number().int().nonnegative();

const recordIndexSchema = z.union([nonNegativeInt, z.array(nonNegativeInt).min(1)]).optional();

const recordIndexsSchema = z.union([z.array(nonNegativeInt).min(1), z.array(z.array(nonNegativeInt).min(1)).min(1)]);

const updateRecordIndexsSchema = z
  .array(z.union([nonNegativeInt, z.array(nonNegativeInt).min(1)]))
  .min(1)
  .describe('与 records 一一对应的索引数组');

export const operateDataTools = [
  {
    name: 'add_record',
    category: 'data',
    description: `添加数据（单条记录，仅 ListTable）

使用示例：
  - add_record({ record: { id: 1, name: "A" } })
  - add_record({ record: { id: 1, name: "A" }, recordIndex: 0 })
  - add_record({ record: { id: 1, name: "A" }, recordIndex: [0, 2] })

参数：
  - record: 单条数据（任意结构）
  - recordIndex: 插入位置（可选）
    - number：向数据源中要插入的位置（0-based）
    - number[]：树形结构等场景下的索引路径

返回：
  'Success' 字符串`,
    inputSchema: z.object({
      record: z.any().refine(val => val !== undefined, {
        message: 'record is required'
      }),
      recordIndex: recordIndexSchema
    }),
    execute: async (params: { record: any; recordIndex?: number | number[] }) => {
      const table = getVTableInstance();
      ensureListTable(table);
      if (typeof table.addRecord !== 'function') {
        throw new Error('VTable instance does not support addRecord (requires ListTable)');
      }
      // 类型断言：实际实现支持 number | number[]，但接口定义只声明了 number
      (table.addRecord as (record: any, recordIndex?: number | number[]) => void)(params.record, params.recordIndex);
      return 'Success';
    }
  },

  {
    name: 'add_records',
    category: 'data',
    description: `添加数据（多条记录，仅 ListTable）

使用示例：
  - add_records({ records: [{ id: 1 }, { id: 2 }] })
  - add_records({ records: [{ id: 1 }, { id: 2 }], recordIndex: 0 })

参数：
  - records: 多条数据数组
  - recordIndex: 插入位置（可选，规则同 add_record）

返回：
  'Success' 字符串`,
    inputSchema: z.object({
      records: z.array(z.any()).min(1),
      recordIndex: recordIndexSchema
    }),
    execute: async (params: { records: any[]; recordIndex?: number | number[] }) => {
      const table = getVTableInstance();
      ensureListTable(table);
      if (typeof table.addRecords !== 'function') {
        throw new Error('VTable instance does not support addRecords (requires ListTable)');
      }
      // 类型断言：实际实现支持 number | number[]，但接口定义只声明了 number
      (table.addRecords as (records: any[], recordIndex?: number | number[]) => void)(
        params.records,
        params.recordIndex
      );
      return 'Success';
    }
  },

  {
    name: 'delete_records',
    category: 'data',
    description: `删除数据（支持多条，仅 ListTable）

使用示例：
  - delete_records({ recordIndexs: [0, 1, 2] })
  - delete_records({ recordIndexs: [[0], [0, 2]] })  // 树形结构索引路径

参数：
  - recordIndexs: 要删除数据的索引（显示在 body 中的索引）

返回：
  'Success' 字符串`,
    inputSchema: z.object({
      recordIndexs: recordIndexsSchema
    }),
    execute: async (params: { recordIndexs: number[] | number[][] }) => {
      const table = getVTableInstance();
      ensureListTable(table);
      if (typeof table.deleteRecords !== 'function') {
        throw new Error('VTable instance does not support deleteRecords (requires ListTable)');
      }
      table.deleteRecords(params.recordIndexs);
      return 'Success';
    }
  },

  {
    name: 'update_records',
    category: 'data',
    description: `修改数据（支持多条，仅 ListTable）

使用示例：
  - update_records({ records: [{ id: 1, name: "A1" }], recordIndexs: [0] })
  - update_records({ records: [{ id: 1, name: "A1" }], recordIndexs: [[0, 2]] })  // 树形结构索引路径

参数：
  - records: 修改后的数据条目数组
  - recordIndexs: 对应修改数据的索引数组（与 records 一一对应）

返回：
  'Success' 字符串`,
    inputSchema: z.object({
      records: z.array(z.any()).min(1),
      recordIndexs: updateRecordIndexsSchema
    }),
    execute: async (params: { records: any[]; recordIndexs: (number | number[])[] }) => {
      const table = getVTableInstance();
      ensureListTable(table);
      if (typeof table.updateRecords !== 'function') {
        throw new Error('VTable instance does not support updateRecords (requires ListTable)');
      }
      if (params.records.length !== params.recordIndexs.length) {
        throw new Error(
          `records length (${params.records.length}) must match recordIndexs length (${params.recordIndexs.length})`
        );
      }
      table.updateRecords(params.records, params.recordIndexs);
      return 'Success';
    }
  }
];
