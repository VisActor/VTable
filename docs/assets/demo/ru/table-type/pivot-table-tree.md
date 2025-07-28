---
категория: примеры
группа: таблица-тип
заголовок: сводный таблица Tree
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-tree.png
ссылка: таблица_type/сводный_таблица/сводный_таблица_tree
опция: сводныйтаблица#rowHierarchyType('grid'%20%7C%20'tree')
---

# сводный таблица Tree Hierarchy(пользовательский header tree)

сводный таблица tree display, this пример passes в the пользовательский header tree structure rowTree и columnTree, и sets rowHierarchyType к tree.

It should be noted that indicatorsAsCol cannot be set к false, because it is currently не supported that indicators are placed на the row header when displayed as the header из a tree structure.

## Ключевые Конфигурации

- `сводныйтаблица`
- `rowHierarchyType` Set the hierarchical presentation к`tree`, defaults к tiling mode`grid`.
- `columnTree`
- `rowTree`
- `columns` необязательный Configure, dimension styles, etc.
- `rows`необязательный Configure, dimension styles, etc.
- `indicators`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный2_данные.json')
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
          dimensionKey: 'Регион',
          значение: 'West',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          значение: 'South',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          значение: 'Central',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          значение: 'East',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
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
            if (значение) возврат '$' + число(значение).toFixed(2);
            возврат '';
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
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
            if (значение) возврат '$' + число(значение).toFixed(2);
            возврат '';
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
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
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
