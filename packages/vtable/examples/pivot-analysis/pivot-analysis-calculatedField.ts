import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const option: VTable.PivotTableConstructorOptions = {
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
          }
        },
        {
          dimensionKey: 'Month',
          title: 'Month',
          headerStyle: {
            textStick: true
          }
        }
      ],
      indicators: [
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
        },
        {
          indicatorKey: 'calField1',
          title: 'AvgPrice',
          width: 'auto',
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            color: 'blue'
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {}
      },
      dataConfig: {
        derivedFieldRules: [
          {
            fieldName: 'Year',
            derivedFunc: VTable.DataStatistics.dateFormat('Order Date', '%y', true)
          },
          {
            fieldName: 'Month',
            derivedFunc: VTable.DataStatistics.dateFormat('Order Date', '%n', true)
          }
        ],
        calculatedFieldRules: [
          {
            key: 'calField1',
            dependIndicatorKeys: ['Quantity', 'Sales'],
            calculateFun: (dependValue: any) => {
              return dependValue.Sales / dependValue.Quantity;
            }
          }
        ],
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Category'],
            grandTotalLabel: '行总计',
            subTotalLabel: '小计'
          },
          column: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Year'],
            grandTotalLabel: '列总计',
            subTotalLabel: '小计'
          }
        }
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;

    bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
  })
  .catch(e => {
    console.error(e);
  });
