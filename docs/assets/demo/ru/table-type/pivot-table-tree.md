---
категория: примеры
группа: table-type
заголовок: Pivot Table Tree
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-tree.png
ссылка: table_type/Pivot_table/pivot_table_tree
опция: PivotTable#rowHierarchyType('grid'%20%7C%20'tree')
---

# Pivot Table Tree Hierarchy(custom header tree)

Pivot table tree display, this example passes in the custom header tree structure rowTree and columnTree, and sets rowHierarchyType to tree.

It should be noted that indicatorsAsCol cannot be set to false, because it is currently not supported that indicators are placed on the row header when displayed as the header of a tree structure.

## Ключевые Конфигурации

- `PivotTable`
- `rowHierarchyType` Set the hierarchical presentation to`tree`, defaults to tiling mode`grid`.
- `columnTree`
- `rowTree`
- `columns` Optional Configure, dimension styles, etc.
- `rows`Optional Configure, dimension styles, etc.
- `indicators`

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot2_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: 'Категория',
          value: 'Furniture',
          hierarchyState: 'expand',
          children: [
            {
              dimensionKey: 'Подкатегория',
              value: 'Bookcases',
              hierarchyState: 'collapse'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Chairs',
              hierarchyState: 'collapse'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Furnishings'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Tables'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Office Supplies',
          children: [
            {
              dimensionKey: 'Подкатегория',
              value: 'Appliances'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Art'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Binders'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Envelopes'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Fasteners'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Labels'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Paper'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Storage'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Supplies'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Technology',
          children: [
            {
              dimensionKey: 'Подкатегория',
              value: 'Accessories'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Copiers'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Machines'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Phones'
            }
          ]
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Регион',
          value: 'West',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          value: 'South',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          value: 'Central',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          value: 'East',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Категория',
          title: 'Catogery',
          width: 'auto'
        },
        {
          dimensionKey: 'Подкатегория',
          title: 'Sub-Catogery',
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Регион',
          title: 'Регион',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Продажи',
          title: 'Продажи',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            return '';
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
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
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            return '';
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
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
      rowHierarchyType: 'tree',
      widthMode: 'standard',
      rowHierarchyIndent: 20,
      rowExpandLevel: 1,
      rowHierarchyTextStartAlignment: true,
      dragOrder: {
        dragHeaderMode: 'all'
      }
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
