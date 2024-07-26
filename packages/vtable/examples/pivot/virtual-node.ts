import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  let tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      const option: VTable.PivotTableConstructorOptions = {
        supplementIndicatorNodes: false,
        records: data,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            headerStyle: {
              textStick: true,
              bgColor(arg) {
                if (arg.dataValue === 'Row Totals') {
                  return '#a5b7fc';
                }
                return '#ECF1F5';
              }
            },
            width: 'auto'
          },
          {
            dimensionKey: 'Sub-Category',
            title: 'Sub-Catogery',
            headerStyle: {
              textStick: true,
              bgColor(arg) {
                if (arg.dataValue === 'Sub Totals') {
                  return '#d2dcff';
                }
                return '#ECF1F5';
              }
            },
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Segment',
            title: 'Segment',
            headerStyle: {
              textStick: true
            }
          }
        ],
        columnTree: [
          {
            dimensionKey: 'Segment-3',
            value: 'Segment-3 (virtual-node)',
            virtual: true
          },
          {
            dimensionKey: 'Segment',
            value: 'Consumer'
          },
          {
            dimensionKey: 'Segment-1',
            value: 'Segment-1 (virtual-node)',
            virtual: true,
            // levelSpan: 2,
            children: [
              // {
              //   dimensionKey: 'Segment',
              //   value: 'Consumer',
              //   children: [
              {
                indicatorKey: 'Quantity',
                value: 'Quantity'
              },
              {
                indicatorKey: 'Sales',
                value: 'Sales'
              },
              {
                indicatorKey: 'Profit',
                value: 'Profit'
              },
              //   ]
              // },
              {
                dimensionKey: 'Segment',
                value: 'Corporate',
                children: [
                  {
                    indicatorKey: 'Quantity',
                    value: 'Quantity'
                  },
                  {
                    indicatorKey: 'Sales',
                    value: 'Sales'
                  },
                  {
                    indicatorKey: 'Profit',
                    value: 'Profit'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: 'Segment-1',
            value: 'Segment-1 (virtual-node)',
            virtual: true,
            children: [
              {
                dimensionKey: 'Segment',
                value: 'Consumer',
                children: [
                  {
                    indicatorKey: 'Quantity',
                    value: 'Quantity'
                  },
                  {
                    indicatorKey: 'Sales',
                    value: 'Sales'
                  },
                  {
                    indicatorKey: 'Profit',
                    value: 'Profit'
                  }
                ]
              },
              {
                dimensionKey: 'Segment',
                value: 'Corporate',
                children: [
                  {
                    indicatorKey: 'Quantity',
                    value: 'Quantity'
                  },
                  {
                    indicatorKey: 'Sales',
                    value: 'Sales'
                  },
                  {
                    indicatorKey: 'Profit',
                    value: 'Profit'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: 'Segment',
            value: 'Home Office',
            children: [
              {
                dimensionKey: 'Segment-2',
                value: 'Segment-2 (virtual-node)',
                virtual: true,
                children: [
                  {
                    indicatorKey: 'Quantity',
                    value: 'Quantity'
                  },
                  {
                    indicatorKey: 'Sales',
                    value: 'Sales'
                  },
                  {
                    indicatorKey: 'Profit',
                    value: 'Profit'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: 'Segment',
            value: 'Column Totals',
            children: [
              {
                indicatorKey: 'Quantity',
                value: 'Quantity'
              },
              {
                indicatorKey: 'Sales',
                value: 'Sales'
              },
              {
                indicatorKey: 'Profit',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: 'Segment-4',
            value: 'Segment-4 (virtual-node)',
            virtual: true
          },
          {
            dimensionKey: 'Segment',
            value: 'Consumer'
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
              },
              bgColor(arg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                  return '#d2dcff';
                } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                  return '#a5b7fc';
                }
                return undefined;
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
              },
              bgColor(arg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                  return '#d2dcff';
                } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                  return '#a5b7fc';
                }
                return undefined;
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
              },
              bgColor(arg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                  return '#d2dcff';
                } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                  return '#a5b7fc';
                }
                return undefined;
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row'
        },
        dataConfig: {
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              showSubTotalsOnTop: true,
              showGrandTotalsOnTop: true,
              subTotalsDimensions: ['Category'],
              grandTotalLabel: 'Row Totals',
              subTotalLabel: 'Sub Totals'
            },
            column: {
              showGrandTotals: true,
              showSubTotals: false,
              grandTotalLabel: 'Column Totals'
            }
          }
        },
        theme: VTable.themes.DEFAULT.extends({
          headerStyle: {
            bgColor: '#5071f9',
            color(args) {
              if (
                (args.cellHeaderPaths.colHeaderPaths?.length === 1 && args.cellHeaderPaths.colHeaderPaths[0].virtual) ||
                (args.cellHeaderPaths.colHeaderPaths?.length === 2 && args.cellHeaderPaths.colHeaderPaths[1].virtual)
              ) {
                return 'red';
              }
              return '#fff';
            }
          },
          cornerHeaderStyle: {
            bgColor: '#5071f9',
            color: '#fff'
          }
        }),

        widthMode: 'standard'
      };
      tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
    })
    .catch(e => {
      console.log(e);
    });
}
