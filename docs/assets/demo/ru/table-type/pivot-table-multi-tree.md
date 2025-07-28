---
категория: примеры
группа: table-type
заголовок: Pivot Table Multiple Tree
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-multi-tree.png
ссылка: table_type/Pivot_table/pivot_table_multi_tree
опция: PivotTable#extensionRows(IExtensionRowDefine%5B%5D)
---

# Pivot Table Multiple Tree

Pivot table multi-column tree display. Multiple columns belong to a special tree display structure and require the business party to pass in rowTree, columnTree and extensionRows.

## Ключевые Конфигурации

- `rowHierarchyType` Set the hierarchical presentation to`tree`, defaults to tiling mode`grid`.
- `extensionRows` sets the extension row header, which takes effect when the опция `rowHierarchyType` is `tree`.

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_pivot_extension_rows.json')
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
          value: 'Продажи',
          indicatorKey: 'Продажи'
        },
        {
          value: 'Прибыль',
          indicatorKey: 'Прибыль'
        }
      ],
      extensionRows: [
        {
          rows: [{ dimensionKey: 'Регион', title: 'Регион', width: 'auto' }, 'State'],
          rowTree: [
            {
              dimensionKey: 'Регион',
              value: 'East',
              children: [
                {
                  dimensionKey: 'State',
                  value: 'Connecticut'
                },
                {
                  dimensionKey: 'State',
                  value: 'Delaware'
                },
                {
                  dimensionKey: 'State',
                  value: 'District of Columbia'
                },
                {
                  dimensionKey: 'State',
                  value: 'Maine'
                },
                {
                  dimensionKey: 'State',
                  value: 'Maryland'
                },
                {
                  dimensionKey: 'State',
                  value: 'Massachusetts'
                },
                {
                  dimensionKey: 'State',
                  value: 'New Hampshire'
                },
                {
                  dimensionKey: 'State',
                  value: 'New Jersey'
                },
                {
                  dimensionKey: 'State',
                  value: 'New York'
                },
                {
                  dimensionKey: 'State',
                  value: 'Ohio'
                },
                {
                  dimensionKey: 'State',
                  value: 'Pennsylvania'
                },
                {
                  dimensionKey: 'State',
                  value: 'Rhode Island'
                },
                {
                  dimensionKey: 'State',
                  value: 'Vermont'
                },
                {
                  dimensionKey: 'State',
                  value: 'West Virginia'
                }
              ]
            },
            {
              dimensionKey: 'Регион',
              value: 'Central',
              children: [
                {
                  dimensionKey: 'State',
                  value: 'Illinois'
                },
                {
                  dimensionKey: 'State',
                  value: 'Indiana'
                },
                {
                  dimensionKey: 'State',
                  value: 'Iowa'
                },
                {
                  dimensionKey: 'State',
                  value: 'Kansas'
                },
                {
                  dimensionKey: 'State',
                  value: 'Michigan'
                },
                {
                  dimensionKey: 'State',
                  value: 'Minnesota'
                },
                {
                  dimensionKey: 'State',
                  value: 'Missouri'
                },
                {
                  dimensionKey: 'State',
                  value: 'Nebraska'
                },
                {
                  dimensionKey: 'State',
                  value: 'North Dakota'
                },
                {
                  dimensionKey: 'State',
                  value: 'Oklahoma'
                },
                {
                  dimensionKey: 'State',
                  value: 'South Dakota'
                },
                {
                  dimensionKey: 'State',
                  value: 'Texas'
                },
                {
                  dimensionKey: 'State',
                  value: 'Wisconsin'
                }
              ]
            },
            {
              dimensionKey: 'Регион',
              value: 'West',
              children: [
                {
                  dimensionKey: 'State',
                  value: 'Arizona'
                },
                {
                  dimensionKey: 'State',
                  value: 'California'
                },
                {
                  dimensionKey: 'State',
                  value: 'Colorado'
                },
                {
                  dimensionKey: 'State',
                  value: 'Idaho'
                },
                {
                  dimensionKey: 'State',
                  value: 'Montana'
                },
                {
                  dimensionKey: 'State',
                  value: 'Nevada'
                },
                {
                  dimensionKey: 'State',
                  value: 'New Mexico'
                },
                {
                  dimensionKey: 'State',
                  value: 'Oregon'
                },
                {
                  dimensionKey: 'State',
                  value: 'Utah'
                },
                {
                  dimensionKey: 'State',
                  value: 'Washington'
                },
                {
                  dimensionKey: 'State',
                  value: 'Wyoming'
                }
              ]
            },
            {
              dimensionKey: 'Регион',
              value: 'South',
              children: [
                {
                  dimensionKey: 'State',
                  value: 'Alabama'
                },
                {
                  dimensionKey: 'State',
                  value: 'Arkansas'
                },
                {
                  dimensionKey: 'State',
                  value: 'Florida'
                },
                {
                  dimensionKey: 'State',
                  value: 'Georgia'
                },
                {
                  dimensionKey: 'State',
                  value: 'Kentucky'
                },
                {
                  dimensionKey: 'State',
                  value: 'Louisiana'
                },
                {
                  dimensionKey: 'State',
                  value: 'Mississippi'
                },
                {
                  dimensionKey: 'State',
                  value: 'North Carolina'
                },
                {
                  dimensionKey: 'State',
                  value: 'South Carolina'
                },
                {
                  dimensionKey: 'State',
                  value: 'Tennessee'
                },
                {
                  dimensionKey: 'State',
                  value: 'Virginia'
                }
              ]
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
            if (value) {
              return '$' + Number(value).toFixed(2);
            }
            return '';
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
          indicatorKey: 'Прибыль',
          title: 'Прибыль',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            if (value) {
              return '$' + Number(value).toFixed(2);
            }
            return '';
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
      rowHierarchyType: 'tree',
      widthMode: 'standard',
      rowHierarchyIndent: 20,
      rowExpandLevel: 1,
      rowHierarchyTextStartAlignment: true,
      dragOrder: {
        dragHeaderMode: 'all'
      }
    };
    const instance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = instance;
  });
```
