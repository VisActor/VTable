---
category: examples
group: data-analysis
title: Pivot Analysis Total
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-total.png
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.totals
---

# Pivot Analysis - Subtotal Total

To summarize table data in pivot analysis, configure totals in dataConfig to set the total subtotal of the row and column dimensions.This example summary is always displayed to the bottom, and can also be displayed to the top through total.showGrandTotalsOnTop. [Configuration reference](../../option/PivotTable#dataConfig.totals)

## Key Configurations

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` configures data rules, optional configuration items

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.dataValue === 'Row Totals') {
                return '#ff9900';
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
                return '#ba54ba';
              }
              return '#ECF1F5';
            }
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
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
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                return '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                return '#ff9900';
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
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                return '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                return '#ff9900';
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
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                return '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                return '#ff9900';
              }
              return undefined;
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
        }
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
