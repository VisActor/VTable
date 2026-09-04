// @ts-nocheck
import { DataSource, getField, getRecordFieldValue } from '../../src/data/DataSource';

describe('DataSource nested field updates', () => {
  test('updates a dotted field path by record index', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const dataSource = new DataSource({ records });

    dataSource.changeFieldValueByRecordIndex('18', 0, 'facts.2025-02.qty');

    expect(records[0].facts['2025-02'].qty).toBe(18);
    expect(records[0]['facts.2025-02.qty']).toBeUndefined();
    dataSource.release();
  });

  test('updates an array field path by record index', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const field = ['facts', '2025-02', 'qty'];
    const dataSource = new DataSource({ records });

    dataSource.changeFieldValueByRecordIndex('18', 0, field);

    expect(records[0].facts['2025-02'].qty).toBe(18);
    expect(records[0]['facts,2025-02,qty']).toBeUndefined();
    dataSource.release();
  });

  test('updates an array field path through the view-index write path', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const field = ['facts', '2025-02', 'qty'];
    const dataSource = new DataSource({ records });

    dataSource.changeFieldValue('18', 0, field);

    expect(records[0].facts['2025-02'].qty).toBe(18);
    expect(records[0]['facts,2025-02,qty']).toBeUndefined();
    dataSource.release();
  });

  test('keeps array paths distinct from comma-delimited literal keys', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } }, 'facts,2025-02,qty': 11 }];
    const field = ['facts', '2025-02', 'qty'];
    const dataSource = new DataSource({ records });
    const table = { leftRowSeriesNumberCount: 0 } as any;

    dataSource.changeFieldValueByRecordIndex(18, 0, field);

    expect(records[0].facts['2025-02'].qty).toBe(18);
    expect(records[0]['facts,2025-02,qty']).toBe(11);
    expect(getRecordFieldValue(records[0], field)).toBe(18);
    expect(getField(records[0], field, 0, 0, table, () => undefined)).toBe(18);
    dataSource.release();
  });

  test('updates a dotted field path through the view-index write path', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const dataSource = new DataSource({ records });

    dataSource.changeFieldValue('18', 0, 'facts.2025-02.qty');

    expect(records[0].facts['2025-02'].qty).toBe(18);
    expect(records[0]['facts.2025-02.qty']).toBeUndefined();
    dataSource.release();
  });

  test('creates missing objects while updating a dotted field path', () => {
    const records = [{}];
    const dataSource = new DataSource({ records });

    dataSource.changeFieldValueByRecordIndex(18, 0, 'facts.2025-02.qty');

    expect(records[0]).toEqual({ facts: { '2025-02': { qty: 18 } } });
    dataSource.release();
  });

  test('prefers an existing literal dotted field over path traversal', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } }, 'facts.2025-02.qty': 11 }];
    const dataSource = new DataSource({ records });

    dataSource.changeFieldValueByRecordIndex(18, 0, 'facts.2025-02.qty');

    expect(records[0]['facts.2025-02.qty']).toBe(18);
    expect(records[0].facts['2025-02'].qty).toBe(10);
    dataSource.release();
  });

  test('does not mutate inherited objects while creating a nested field path', () => {
    const inherited = { facts: { '2025-02': { qty: 10 } } };
    const record = Object.create(inherited);
    const dataSource = new DataSource({ records: [record] });

    dataSource.changeFieldValueByRecordIndex(18, 0, 'facts.2025-02.qty');

    expect(record).toHaveProperty('facts', { '2025-02': { qty: 18 } });
    expect(inherited.facts['2025-02'].qty).toBe(10);
    dataSource.release();
  });

  test('recognizes nested fields in hasField', () => {
    const records = [{ facts: { '2025-02': { qty: 10 } } }];
    const dataSource = new DataSource({ records });

    expect(dataSource.hasField(0, 'facts.2025-02.qty')).toBe(true);
    dataSource.release();
  });
});
