// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

describe('ListTable nested field updates', () => {
  test('updates a nested field and reports its old and changed values', () => {
    const field = 'facts.2025-02.qty';
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const table = new ListTable({
      container: createDiv(),
      columns: [{ field, title: 'Quantity' }],
      records
    });
    const events: any[] = [];
    table.on('change_cell_value', event => events.push(event));

    table.changeCellValueByRecord(0, field, '12', { autoRefresh: false });

    expect(records[0].facts['2025-02'].qty).toBe(12);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      col: 0,
      row: 1,
      recordIndex: 0,
      field,
      rawValue: 10,
      currentValue: 10,
      changedValue: 12
    });
    table.release();
  });

  test('updates nested fields in a batch change and reports the aggregate event', () => {
    const field = 'facts.2025-02.qty';
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const table = new ListTable({
      container: createDiv(),
      columns: [{ field, title: 'Quantity' }],
      records
    });
    const cellEvents: any[] = [];
    const batchEvents: any[] = [];
    table.on('change_cell_value', event => cellEvents.push(event));
    table.on('change_cell_values', event => batchEvents.push(event));

    table.changeCellValuesByRecords([{ recordIndex: 0, field, value: '12' }], { autoRefresh: false });

    expect(records[0].facts['2025-02'].qty).toBe(12);
    expect(cellEvents).toHaveLength(1);
    expect(cellEvents[0].changedValue).toBe(12);
    expect(batchEvents).toHaveLength(1);
    expect(batchEvents[0].values).toEqual(cellEvents);
    table.release();
  });

  test('updates an array field path and reports its old and changed values', () => {
    const field = ['facts', '2025-02', 'qty'];
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const table = new ListTable({
      container: createDiv(),
      columns: [{ field, title: 'Quantity' }],
      records
    });
    const events: any[] = [];
    table.on('change_cell_value', event => events.push(event));

    table.changeCellValueByRecord(0, [...field], '12', { autoRefresh: false });

    expect(records[0].facts['2025-02'].qty).toBe(12);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      col: 0,
      recordIndex: 0,
      rawValue: 10,
      currentValue: 10,
      changedValue: 12
    });
    table.release();
  });
});
