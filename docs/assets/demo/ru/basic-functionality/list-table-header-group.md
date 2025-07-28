---
категория: примеры
группа: базовый возможности
заголовок: список таблица - Header Group
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-таблица-header-group.png
ссылка: таблица-тип/список-таблица
опция: списоктаблица-columns-текст#columns
---

# список таблица - Header Group

Configure columns as a nested multi-layer structure к achieve multi-layer header grouping effects

## Ключевые Конфигурации

- columns

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
const records = [
  {
    id: 1,
    имя1: 'a1',
    имя2: 'a2',
    имя3: 'a3'
  },
  {
    id: 2,
    имя1: 'b1',
    имя2: 'b2',
    имя3: 'b3'
  },
  {
    id: 3,
    имя1: 'c1',
    имя2: 'c2',
    имя3: 'c3'
  },
  {
    id: 4,
    имя1: 'd1',
    имя2: 'd2',
    имя3: 'd3'
  },
  {
    id: 5,
    имя1: 'e1',
    имя2: 'e2',
    имя3: 'e3'
  }
];

const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 100
  },
  {
    заголовок: 'имя',
    columns: [
      {
        поле: 'имя1',
        заголовок: 'имя1',
        ширина: 100
      },
      {
        заголовок: 'имя-level-2',
        ширина: 150,
        columns: [
          {
            поле: 'имя2',
            заголовок: 'имя2',
            ширина: 100
          },
          {
            заголовок: 'имя3',
            поле: 'имя3',
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
  ширинаMode: 'standard',
  автоWrapText: true,
  автоRowвысота: true,
  defaultColширина: 150
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
