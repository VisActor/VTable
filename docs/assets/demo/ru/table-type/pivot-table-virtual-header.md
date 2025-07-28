---
категория: примеры
группа: table-type
заголовок: сводная таблица with virtual header node
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table-virtual-header.png
ссылка: table_type/Pivot_table/custom_header
опция: PivotTable#columnTree
---

# сводная таблица with virtual header node

Pivot table. This example passes in the custom header tree structure rowTree and columnTree. In columnTree, two virtual header nodes are configured. The node's `virtual` is `true`, indicating a virtual node.

## Ключевые Конфигурации

- `PivotTable` table type
- `columnTree` custom header tree structure
- `rowTree`custom header tree structure
- `columns` Optional Configure, dimension styles, etc.
- `rows`Optional Configure, dimension styles, etc.
- `indicators`

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Категория',
          title: 'Категория',
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
          dimensionKey: 'Подкатегория',
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
          dimensionKey: 'Segment-1',
          value: 'Segment-1 (virtual-node)',
          virtual: true,
          children: [
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              children: [
                {
                  indicatorKey: 'Количество',
                  value: 'Количество'
                },
                {
                  indicatorKey: 'Продажи',
                  value: 'Продажи'
                },
                {
                  indicatorKey: 'Прибыль',
                  value: 'Прибыль'
                }
              ]
            },
            {
              dimensionKey: 'Segment',
              value: 'Corporate',
              children: [
                {
                  indicatorKey: 'Количество',
                  value: 'Количество'
                },
                {
                  indicatorKey: 'Продажи',
                  value: 'Продажи'
                },
                {
                  indicatorKey: 'Прибыль',
                  value: 'Прибыль'
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
                  indicatorKey: 'Количество',
                  value: 'Количество'
                },
                {
                  indicatorKey: 'Продажи',
                  value: 'Продажи'
                },
                {
                  indicatorKey: 'Прибыль',
                  value: 'Прибыль'
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
              indicatorKey: 'Количество',
              value: 'Количество'
            },
            {
              indicatorKey: 'Продажи',
              value: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль',
              value: 'Прибыль'
            }
          ]
        }
      ],
      indicators: [
        {
          indicatorKey: 'Количество',
          title: 'Количество',
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
          indicatorKey: 'Продажи',
          title: 'Продажи',
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
          indicatorKey: 'Прибыль',
          title: 'Прибыль',
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
            subTotalsDimensions: ['Категория'],
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
  });
```
