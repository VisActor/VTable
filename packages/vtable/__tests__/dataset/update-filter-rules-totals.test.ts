// @ts-nocheck
import { PivotTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';

const records = [
  { region: 'East', city: 'A', cat: 'X', sales: 10 },
  { region: 'East', city: 'B', cat: 'X', sales: 20 },
  { region: 'East', city: 'B', cat: 'Y', sales: 5 },
  { region: 'West', city: 'C', cat: 'X', sales: 100 },
  { region: 'West', city: 'D', cat: 'Y', sales: 1 }
];

function createPivotTable() {
  const totals = { showGrandTotals: true, showSubTotals: true, grandTotalLabel: 'TOTAL', subTotalLabel: 'SUB' };
  return new PivotTable(createDiv(), {
    records: records.slice(),
    rows: ['region', 'city'],
    columns: ['cat'],
    indicators: ['sales'],
    indicatorsAsCol: true,
    enableDataAnalysis: true,
    dataConfig: {
      totals: {
        row: { ...totals, subTotalsDimensions: ['region'] },
        column: { ...totals, subTotalsDimensions: [] }
      }
    }
  });
}

function totalsOf(pivotTable) {
  const value = (rowKey: string[], colKey: string[]) =>
    pivotTable.dataset.getAggregator(rowKey, colKey, 'sales').value();
  return {
    eastSubTotal: value(['East', 'SUB'], ['TOTAL']),
    westSubTotal: value(['West', 'SUB'], ['TOTAL']),
    grandTotalX: value(['TOTAL'], ['X']),
    grandTotal: value(['TOTAL'], ['TOTAL'])
  };
}

describe('updateFilterRules without resetting the tree', () => {
  test('totals only count the records that pass the filter', () => {
    const pivotTable = createPivotTable();
    pivotTable.updateFilterRules([{ filterFunc: record => record.city !== 'B' }]);

    expect(totalsOf(pivotTable)).toEqual({ eastSubTotal: 10, westSubTotal: 101, grandTotalX: 110, grandTotal: 111 });
    pivotTable.release();
  });

  test('clearing the filter restores the initial totals', () => {
    const pivotTable = createPivotTable();
    const initial = totalsOf(pivotTable);
    expect(initial).toEqual({ eastSubTotal: 35, westSubTotal: 101, grandTotalX: 130, grandTotal: 136 });

    pivotTable.updateFilterRules([{ filterFunc: record => record.city !== 'B' }]);
    pivotTable.updateFilterRules([]);

    expect(totalsOf(pivotTable)).toEqual(initial);
    pivotTable.release();
  });
});
