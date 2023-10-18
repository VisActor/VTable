import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';
export function createTable() {
  let tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then(res => res.json())
    .then(data => {
      const option = {
        records: data,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          },
          {
            dimensionKey: 'Sub-Category',
            title: 'Sub-Catogery',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Year',
            title: 'Year',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          },
          {
            dimensionKey: 'Month',
            title: 'Month',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        indicators: [
          {
            indicatorKey: 'avgPrice',
            title: '平均价',
            width: 'auto'
          },
          {
            indicatorKey: 'Quantity',
            title: 'Quantity',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) {
                  return 'black';
                }
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Sales',
            title: 'Sales',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) {
                  return 'black';
                }
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Profit',
            title: 'Profit',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) {
                  return 'black';
                }
                return 'red';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textStick: true
          }
        },
        dataConfig: {
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              subTotalsDimensions: ['Category'],
              grandTotalLabel: 'Row Totals',
              subTotalLabel: 'Sub Totals'
            },
            column: {
              showGrandTotals: true,
              showSubTotals: true,
              subTotalsDimensions: ['Region'],
              grandTotalLabel: 'Column Totals',
              subTotalLabel: 'Sub Totals'
            }
          },
          derivedFieldRules: [
            {
              fieldName: 'Year',
              derivedFunc: VTable.DataStatistics.dateFormat('Order Date', '%y', true)
            },
            {
              fieldName: 'Month',
              derivedFunc: VTable.DataStatistics.dateFormat('Order Date', '%n', true)
            },
            {
              fieldName: 'avgPrice',
              derivedFunc: rec => rec.Sales / rec.Quantity
            }
          ],
          aggregationRules: [
            {
              indicatorKey: 'Sales',
              aggregationType: VTable.TYPES.AggregationType.SUM
            },
            {
              indicatorKey: 'Quantity',
              aggregationType: VTable.TYPES.AggregationType.SUM
            },
            {
              indicatorKey: 'avgPrice',
              aggregationType: VTable.TYPES.AggregationType.AVG
            }
          ],
          sortRules: [
            {
              sortField: 'Month',
              sortBy: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
          ]
        },
        enableDataAnalysis: true,
        widthMode: 'standard'
      };
      tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID)!, option);
      window.tableInstance = tableInstance;
    });
}
