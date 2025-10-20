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
});
