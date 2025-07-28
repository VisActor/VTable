---
категория: примеры
группа: базовый возможности
заголовок: список таблица - Header Group свернуть
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-таблица-header-hierarchy-tree.gif
ссылка: таблица-тип/список-таблица
опция: списоктаблица-columns-текст#columns
---

# список таблица - Header Group свернуть

Configure columns as a nested multi-layer structure к achieve multi-layer header grouping effects. включить tree-style expansion и свернуть функциональность through `headerHierarchyType: 'grid-tree'`, и set the по умолчанию expansion level с `headerExpandLevel`.

## Ключевые Конфигурации

- columns
- `headerHierarchyType` Set hierarchy display к `grid-tree` к включить tree-style развернуть/свернуть
- `headerExpandLevel` Configure по умолчанию expansion level (defaults к 1)

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
const records = [
  {
    id: 1,
    имя: 'имя.1',
    имя_1: 'имя_1.1',
    имя_2: 'имя_2.1',
    имя_2_1: 'имя_2_1.1',
    имя_2_2: 'имя_2_2.1'
  },
  {
    id: 2,
    имя: 'имя.2',
    имя_1: 'имя_1.2',
    имя_2: 'имя_2.2',
    имя_2_1: 'имя_2_1.2',
    имя_2_2: 'имя_2_2.2'
  },
  {
    id: 3,
    имя: 'имя.3',
    имя_1: 'имя_1.3',
    имя_2: 'имя_2.3',
    имя_2_1: 'имя_2_1.3',
    имя_2_2: 'имя_2_2.3'
  },
  {
    id: 4,
    имя: 'имя.4',
    имя_1: 'имя_1.4',
    имя_2: 'имя_2.4',
    имя_2_1: 'имя_2_1.4',
    имя_2_2: 'имя_2_2.4'
  },
  {
    id: 5,
    имя: 'имя.5',
    имя_1: 'имя_1.5',
    имя_2: 'имя_2.5',
    имя_2_1: 'имя_2_1.5',
    имя_2_2: 'имя_2_2.5'
  }
];

const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 100
  },
  {
    поле: 'имя',
    заголовок: 'имя',
    columns: [
      {
        поле: 'имя_1',
        заголовок: 'имя_1',
        ширина: 120
      },
      {
        поле: 'имя_2',
        заголовок: 'имя_2',
        ширина: 150,
        columns: [
          {
            поле: 'имя_2_1',
            заголовок: 'имя_2_1',
            ширина: 150
          },
          {
            поле: 'имя_2_2',
            заголовок: 'имя_2_2',
            ширина: 150
          }
        ]
      }
    ]
  }
];

const option = {
  records,
  columns,
  headerHierarchyType: 'grid-tree',
  headerExpandLevel: 3,
  ширинаMode: 'standard',
  автоWrapText: true,
  автоRowвысота: true,
  defaultColширина: 150
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
