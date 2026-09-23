// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

describe('listTable data events test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  const columns = [
    {
      field: 'name',
      title: 'Name',
      width: 'auto'
    },
    {
      field: 'age',
      title: 'Age',
      width: 'auto'
    }
  ];

  const data = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 35 }
  ];

  let table: ListTable;
  let addEventData: any;
  let deleteEventData: any;
  let updateEventData: any;

  beforeEach(() => {
    table = new ListTable({
      container: containerDom,
      columns,
      data
    });

    addEventData = null;
    deleteEventData = null;
    updateEventData = null;

    // Set up event listeners
    table.on('add_record', event => {
      addEventData = event;
    });

    table.on('delete_record', event => {
      deleteEventData = event;
    });

    table.on('update_record', event => {
      updateEventData = event;
    });
  });

  afterEach(() => {
    table.release();
  });

  test('addRecord should fire add_record event', () => {
    const newRecord = { name: 'David', age: 40 };
    table.addRecord(newRecord);

    expect(addEventData).not.toBeNull();
    expect(addEventData.records).toEqual([newRecord]);
    expect(addEventData.recordCount).toBe(1);
    expect(addEventData.recordIndex).toBeUndefined(); // Should be undefined when not specified
  });

  test('addRecord with index should fire add_record event with index', () => {
    const newRecord = { name: 'David', age: 40 };
    const recordIndex = 1;
    table.addRecord(newRecord, recordIndex);

    expect(addEventData).not.toBeNull();
    expect(addEventData.records).toEqual([newRecord]);
    expect(addEventData.recordCount).toBe(1);
    expect(addEventData.recordIndex).toBe(recordIndex);
  });

  test('addRecords should fire add_record event', () => {
    const newRecords = [
      { name: 'David', age: 40 },
      { name: 'Eve', age: 45 }
    ];
    table.addRecords(newRecords);

    expect(addEventData).not.toBeNull();
    expect(addEventData.records).toEqual(newRecords);
    expect(addEventData.recordCount).toBe(2);
    expect(addEventData.recordIndex).toBeUndefined();
  });

  test('deleteRecords should fire delete_record event', () => {
    const recordIndexs = [0, 2];
    table.deleteRecords(recordIndexs);

    expect(deleteEventData).not.toBeNull();
    expect(deleteEventData.recordIndexs).toEqual(recordIndexs);
    expect(deleteEventData.deletedCount).toBe(2);
  });

  test('updateRecords should fire update_record event', () => {
    const updatedRecords = [
      { name: 'Alice Updated', age: 26 },
      { name: 'Charlie Updated', age: 36 }
    ];
    const recordIndexs = [0, 2];
    table.updateRecords(updatedRecords, recordIndexs);

    expect(updateEventData).not.toBeNull();
    expect(updateEventData.records).toEqual(updatedRecords);
    expect(updateEventData.recordIndexs).toEqual(recordIndexs);
    expect(updateEventData.updateCount).toBe(2);
  });

  test('events should not fire if no listeners are registered', () => {
    // Release the table and create a new one without event listeners
    table.release();
    table = new ListTable({
      container: containerDom,
      columns,
      data
    });

    // These operations should not throw any errors even without listeners
    expect(() => {
      table.addRecord({ name: 'David', age: 40 });
      table.deleteRecords([0]);
      table.updateRecords([{ name: 'Updated', age: 99 }], [0]);
    }).not.toThrow();
  });

  test('deleteRecords should fire event with correct data', () => {
    const recordIndexs = [0, 2];
    table.deleteRecords(recordIndexs);

    expect(deleteEventData).not.toBeNull();
    expect(deleteEventData.recordIndexs).toEqual(recordIndexs);
    expect(deleteEventData.deletedCount).toBe(2);
  });

  test('updateRecords should fire event with correct data', () => {
    const updatedRecords = [
      { name: 'Alice Updated', age: 26 },
      { name: 'Bob Updated', age: 31 }
    ];
    const recordIndexs = [0, 1];
    table.updateRecords(updatedRecords, recordIndexs);

    expect(updateEventData).not.toBeNull();
    expect(updateEventData.records).toEqual(updatedRecords);
    expect(updateEventData.recordIndexs).toEqual(recordIndexs);
    expect(updateEventData.updateCount).toBe(2);
  });

  test('addRecord should handle edge cases gracefully', () => {
    // Test adding a valid record
    const validRecord = { name: 'Valid', age: 25 };
    table.addRecord(validRecord);

    expect(addEventData).not.toBeNull();
    expect(addEventData.records).toEqual([validRecord]);
    expect(addEventData.recordCount).toBe(1);
  });

  test('updateFilterRules should include newly added record', () => {
    table.release();
    const records = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 },
      { name: 'Dan', age: 36 }
    ];

    table = new ListTable({
      container: containerDom,
      columns,
      records,
      syncRecordOperationsToSourceRecords: true
    });

    let filterCalls = 0;
    const rules = [
      {
        filterFunc: () => {
          filterCalls++;
          return true;
        }
      }
    ];

    table.updateFilterRules(rules);
    expect(filterCalls).toBe(4);

    table.addRecord({ name: 'Eve', age: 45 });

    filterCalls = 0;
    table.updateFilterRules(rules);
    expect(filterCalls).toBe(5);
  });

  test('addRecords under filter should preserve new records after clearing filter', () => {
    table.release();
    const records = [
      { name: 'Alice', age: 25, group: 'A' },
      { name: 'Bob', age: 30, group: 'B' },
      { name: 'Charlie', age: 35, group: 'A' }
    ];
    const newRecords = [
      { name: 'David', age: 40, group: 'A' },
      { name: 'Eve', age: 45, group: 'B' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'name', title: 'Name' },
        { field: 'age', title: 'Age' },
        { field: 'group', title: 'Group' }
      ],
      records,
      syncRecordOperationsToSourceRecords: true
    });

    table.updateFilterRules([
      {
        filterKey: 'group',
        filteredValues: ['A']
      }
    ]);
    table.addRecords(newRecords);
    table.updateFilterRules([]);

    expect((table.records as typeof records).map(record => record.name)).toEqual([
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Eve'
    ]);
    expect(records).toEqual(table.records);
  });

  test('updateRecords under filter should persist extra fields to source records', () => {
    table.release();
    const records = [
      { id: 1, name: 'Employee 1' },
      { id: 2, name: 'Employee 2' },
      { id: 3, name: 'Employee 3' },
      { id: 4, name: 'Employee 4' },
      { id: 5, name: 'Employee 5' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' }
      ],
      records,
      syncRecordOperationsToSourceRecords: true
    });

    table.updateFilterRules([
      {
        filterKey: 'id',
        filteredValues: [2, 3, 4]
      }
    ]);

    const updatedRecord = {
      ...table.records[0],
      name: 'Employee 2 updated',
      modifiedCells: { name: true }
    };
    table.updateRecords([updatedRecord], [0]);

    expect(records[1]).toBe(updatedRecord);
    expect(records[1].modifiedCells).toEqual({ name: true });

    table.updateFilterRules([]);

    expect(table.records[1]).toBe(updatedRecord);
    expect(table.records[1].name).toBe('Employee 2 updated');
  });

  test('addRecord under filter should keep relative position after clearing filter', () => {
    table.release();
    const records = [
      { name: '小明1', sex: 'boy' },
      { name: '小明2', sex: 'girl' },
      { name: '小明3', sex: 'boy' },
      { name: '小明4', sex: 'girl' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'name', title: 'name' },
        { field: 'sex', title: 'sex' }
      ],
      records,
      syncRecordOperationsToSourceRecords: true
    } as any);

    table.updateFilterRules([
      {
        filterKey: 'sex',
        filteredValues: ['boy']
      } as any
    ]);

    table.addRecord({ name: '新增', sex: 'boy' }, 1);
    table.updateFilterRules([] as any);

    const all = table.records as any[];
    expect(all.map(r => r.name)).toEqual(['小明1', '新增', '小明2', '小明3', '小明4']);
  });

  test('addRecord below last filtered row should insert after its source position', () => {
    table.release();
    const records = [
      { name: '小明1', sex: 'girl' },
      { name: '小明2', sex: 'boy' },
      { name: '小明3', sex: 'girl' },
      { name: '小明4', sex: 'boy' },
      { name: '小明5', sex: 'girl' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'name', title: 'name' },
        { field: 'sex', title: 'sex' }
      ],
      records,
      syncRecordOperationsToSourceRecords: true
    } as any);

    table.updateFilterRules([
      {
        filterKey: 'sex',
        filteredValues: ['boy']
      } as any
    ]);

    expect((table.records as any[]).map(r => r.name)).toEqual(['小明2', '小明4']);

    table.addRecord({ name: '新增', sex: 'boy' }, 2);
    table.updateFilterRules([] as any);

    const all = table.records as any[];
    expect(all.map(r => r.name)).toEqual(['小明1', '小明2', '小明3', '小明4', '新增', '小明5']);
  });

  test('addRecord before first filtered row should insert before its source position', () => {
    table.release();
    const records = [
      { name: '小明1', sex: 'girl' },
      { name: '小明2', sex: 'boy' },
      { name: '小明3', sex: 'girl' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'name', title: 'name' },
        { field: 'sex', title: 'sex' }
      ],
      records,
      syncRecordOperationsToSourceRecords: true
    } as any);

    table.updateFilterRules([
      {
        filterKey: 'sex',
        filteredValues: ['boy']
      } as any
    ]);

    expect((table.records as any[]).map(r => r.name)).toEqual(['小明2']);

    table.addRecord({ name: '新增', sex: 'boy' }, 0);
    table.updateFilterRules([] as any);

    const all = table.records as any[];
    expect(all.map(r => r.name)).toEqual(['小明1', '新增', '小明2', '小明3']);
  });

  test('draft record can stay visible under filter until next updateFilterRules', () => {
    table.release();
    const records = [
      { name: '小明1', sex: 'girl' },
      { name: '小明2', sex: 'boy' },
      { name: '小明3', sex: 'boy' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'name', title: 'name' },
        { field: 'sex', title: 'sex' }
      ],
      records,
      syncRecordOperationsToSourceRecords: true
    } as any);

    table.updateFilterRules([
      {
        filterKey: 'sex',
        filteredValues: ['boy']
      } as any
    ]);
    expect((table.records as any[]).map(r => r.name)).toEqual(['小明2', '小明3']);

    table.addRecord({ name: '新增', sex: undefined } as any, 2);
    expect((table.records as any[]).map(r => r.name)).toEqual(['小明2', '小明3', '新增']);

    table.changeCellValueByRecord(3, 'name', '新名字', { triggerEvent: false, autoRefresh: true } as any);
    expect((table.records as any[]).map(r => r.name)).toEqual(['小明2', '小明3', '新名字']);

    table.updateFilterRules(table.dataSource.dataConfig.filterRules as any);
    expect((table.records as any[]).map(r => r.name)).toEqual(['小明2', '小明3']);
  });

  test('deleteRecords on a sorted table should remove the source record shown in that row', () => {
    table.release();
    const records = [
      { id: 1, name: 'Employee 1' },
      { id: 2, name: 'Employee 2' },
      { id: 3, name: 'Employee 3' },
      { id: 4, name: 'Employee 4' },
      { id: 5, name: 'Employee 5' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' }
      ],
      records,
      sortState: { field: 'id', order: 'desc' },
      syncRecordOperationsToSourceRecords: true
    });

    // 降序排列后 body 第一行是 id 为 5 的记录
    expect(table.getCellValue(0, table.columnHeaderLevelCount)).toBe(5);

    table.deleteRecords([0]);

    // 删除的是显示在第一行的记录（id 5），而不是数据源数组的第 0 条
    expect(records.map(record => record.id)).toEqual([1, 2, 3, 4]);
    expect(table.getCellValue(0, table.columnHeaderLevelCount)).toBe(4);
  });

  test('updateRecords on a sorted table should update the source record shown in that row', () => {
    table.release();
    const records = [
      { id: 1, name: 'Employee 1' },
      { id: 2, name: 'Employee 2' },
      { id: 3, name: 'Employee 3' },
      { id: 4, name: 'Employee 4' },
      { id: 5, name: 'Employee 5' }
    ];

    table = new ListTable({
      container: containerDom,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' }
      ],
      records,
      sortState: { field: 'id', order: 'desc' },
      syncRecordOperationsToSourceRecords: true
    });

    table.updateRecords([{ id: 5, name: 'Employee 5 updated' }], [0]);

    // 更新的同样是显示在第一行的记录（id 5，数据源下标 4）
    expect(records.map(record => record.id)).toEqual([1, 2, 3, 4, 5]);
    expect(records[4].name).toBe('Employee 5 updated');
    expect(table.getCellValue(1, table.columnHeaderLevelCount)).toBe('Employee 5 updated');
  });
});
