import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    records: [
      { Category: 'A', 'Sub-Category': 'A1', Sales: 100, Profit: 10 },
      { Category: 'A', 'Sub-Category': 'A2', Sales: 150, Profit: 15 },
      { Category: 'B', 'Sub-Category': 'B1', Sales: 200, Profit: 20 },
      { Category: 'B', 'Sub-Category': 'B2', Sales: 250, Profit: 25 }
    ],
    rows: [
      {
        dimensionKey: 'Category',
        title: 'Category',
        showSortInCorner: true
      }
    ],
    columns: [
      {
        dimensionKey: 'Category',
        title: 'Category',
        showSortInCorner: true
      }
    ],
    indicators: [
      { indicatorKey: 'Sales', title: 'Sales', showSortInCorner: true } as any,
      { indicatorKey: 'Profit', title: 'Profit', showSortInCorner: true } as any
    ],
    corner: {
      titleOnDimension: 'all'
    },
    pivotSortState: [
      {
        dimensions: [
          {
            dimensionKey: 'Category',
            isPivotCorner: true
          }
        ],
        order: 'desc'
      }
    ]
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
  (window as any).tableInstance = instance;
}
