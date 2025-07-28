---
категория: примеры
группа: таблица-тип
заголовок: сводный таблица Multiple Tree
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-multi-tree.png
ссылка: таблица_type/сводный_таблица/сводный_таблица_multi_tree
опция: сводныйтаблица#extensionRows(IExtensionRowDefine%5B%5D)
---

# сводный таблица Multiple Tree

сводный таблица multi-column tree display. Multiple columns belong к a special tree display structure и require the business party к pass в rowTree, columnTree и extensionRows.

## Ключевые Конфигурации

- `rowHierarchyType` Set the hierarchical presentation к`tree`, defaults к tiling mode`grid`.
- `extensionRows` sets the extension row header, which takes effect when the option `rowHierarchyType` is `tree`.

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_extension_rows.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rowTree: [
        {
          dimensionKey: 'Категория',
          значение: 'Furniture',
          hierarchyState: 'развернуть',
          children: [
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Boхорошоcases',
              hierarchyState: 'свернуть'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Chairs',
              hierarchyState: 'свернуть'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Furnishings'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'таблицаs'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          значение: 'Office Supplies',
          children: [
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Appliances'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Art'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Binders'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Envelopes'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Fasteners'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Labels'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Paper'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Storвозраст'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Supplies'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          значение: 'Technology',
          children: [
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Accessories'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Copiers'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Machines'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Phones'
            }
          ]
        }
      ],
      columnTree: [
        {
          значение: 'Продажи',
          indicatorKey: 'Продажи'
        },
        {
          значение: 'Прибыль',
          indicatorKey: 'Прибыль'
        }
      ],
      extensionRows: [
        {
          rows: [{ dimensionKey: 'Регион', заголовок: 'Регион', ширина: 'авто' }, 'State'],
          rowTree: [
            {
              dimensionKey: 'Регион',
              значение: 'East',
              children: [
                {
                  dimensionKey: 'State',
                  значение: 'Connecticut'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Delaware'
                },
                {
                  dimensionKey: 'State',
                  значение: 'District из Columbia'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Maine'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Maryland'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Massachusetts'
                },
                {
                  dimensionKey: 'State',
                  значение: 'новый Hampshire'
                },
                {
                  dimensionKey: 'State',
                  значение: 'новый Jersey'
                },
                {
                  dimensionKey: 'State',
                  значение: 'новый York'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Ohio'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Pennsylvania'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Rhode Island'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Vermont'
                },
                {
                  dimensionKey: 'State',
                  значение: 'West Virginia'
                }
              ]
            },
            {
              dimensionKey: 'Регион',
              значение: 'Central',
              children: [
                {
                  dimensionKey: 'State',
                  значение: 'Illinois'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Indiana'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Iowa'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Kansas'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Michigan'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Minnesota'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Missouri'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Nebraska'
                },
                {
                  dimensionKey: 'State',
                  значение: 'North Dakota'
                },
                {
                  dimensionKey: 'State',
                  значение: 'хорошоlahoma'
                },
                {
                  dimensionKey: 'State',
                  значение: 'South Dakota'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Texas'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Wisconsin'
                }
              ]
            },
            {
              dimensionKey: 'Регион',
              значение: 'West',
              children: [
                {
                  dimensionKey: 'State',
                  значение: 'Arizona'
                },
                {
                  dimensionKey: 'State',
                  значение: 'California'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Colorado'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Idaho'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Montana'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Nevada'
                },
                {
                  dimensionKey: 'State',
                  значение: 'новый Mexico'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Oregon'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Utah'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Washington'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Wyoming'
                }
              ]
            },
            {
              dimensionKey: 'Регион',
              значение: 'South',
              children: [
                {
                  dimensionKey: 'State',
                  значение: 'Alabama'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Arkansas'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Florida'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Georgia'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Kentucky'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Louisiana'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Mississippi'
                },
                {
                  dimensionKey: 'State',
                  значение: 'North Carolina'
                },
                {
                  dimensionKey: 'State',
                  значение: 'South Carolina'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Tennessee'
                },
                {
                  dimensionKey: 'State',
                  значение: 'Virginia'
                }
              ]
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Catogery',
          ширина: 'авто'
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Регион',
          заголовок: 'Регион',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: значение => {
            if (значение) {
              возврат '$' + число(значение).toFixed(2);
            }
            возврат '';
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) {
                возврат 'black';
              }
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: значение => {
            if (значение) {
              возврат '$' + число(значение).toFixed(2);
            }
            возврат '';
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) {
                возврат 'black';
              }
              возврат 'red';
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
      ширинаMode: 'standard',
      rowHierarchyIndent: 20,
      rowExpandLevel: 1,
      rowHierarchyTextStartAlignment: true,
      dragпорядок: {
        dragHeaderMode: 'все'
      }
    };
    const instance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = instance;
  });
```
