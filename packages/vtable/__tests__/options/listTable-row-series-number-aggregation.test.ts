// @ts-nocheck
import { ListTable, TYPES } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('ListTable row series number with aggregation', () => {
  const container = createDiv();
  container.style.width = '600px';
  container.style.height = '400px';

  const table = new ListTable(container, {
    records: [{ value: 1 }, { value: 2 }],
    columns: [
      {
        field: 'value',
        title: 'Value',
        aggregation: {
          aggregationType: TYPES.AggregationType.SUM
        }
      }
    ],
    rowSeriesNumber: {
      title: 'No.'
    }
  });

  afterAll(() => {
    table.release();
  });

  test('does not display a series number in the aggregation row', () => {
    const aggregationRow = table.rowCount - 1;

    expect(table.internalProps.layoutMap.isAggregation(0, aggregationRow)).toBe(true);
    expect(table.getCellValue(0, aggregationRow)).toBe('');
    expect(table.getCellOriginValue(0, aggregationRow)).toBe('');
  });
});
