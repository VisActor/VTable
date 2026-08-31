---
category: examples
group: data-analysis
title: 透视维度小计总计
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-total.png
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.totals
---

# 透视分析——小计总计

透视分析表格通过 `dataConfig.totals` 配置行列维度的小计和总计。本示例中，行方向保持原有的小计和总计效果；列方向通过 `grandTotalDimensions: ['Segment']`，让列总计在 `Segment` 维度下分组展示，并追加一个包含全部分组的整体小计。行总计默认显示在底部，可通过 `showGrandTotalsOnTop` 调整到顶部；列总计默认显示在右侧，可通过 `showGrandTotalsOnLeft` 调整到左侧。[配置参考](../../option/PivotTable#dataConfig.totals)

## 关键配置

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` 配置数据规则，可选配置项

## 代码演示

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
            grandTotalDimensions: ['Segment'],
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
