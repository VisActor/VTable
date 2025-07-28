---
категория: примеры
группа: пользовательский
заголовок: cell пользовательский style
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-style.png
порядок: 7-4
ссылка: пользовательский_define/пользовательский_style
опция: списоктаблица#пользовательскийCellStyle
---

#Cell пользовательский style

пользовательскийize the display style из некоторые cells по defining и assigning styles.

## Key configuration

- `пользовательскийCellStyle` пользовательский style definition configuration
- `пользовательскийCellStyleArrangement` пользовательский style assignment configuration

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      пользовательскийCellStyle: [
        {
          id: 'пользовательский-1',
          style: {
            bgColor: 'red'
          }
        },
        {
          id: 'пользовательский-2',
          style: {
            цвет: 'green'
          }
        },
        {
          id: 'пользовательский-3',
          style: styleArg => {
            возврат {
              цвет: styleArg.row % 2 === 0 ? 'red' : 'blue'
            };
          }
        }
      ],
      пользовательскийCellStyleArrangement: [
        {
          cellPosition: {
            col: 3,
            row: 4
          },
          пользовательскийStyleId: 'пользовательский-1'
        },
        {
          cellPosition: {
            range: {
              начало: {
                col: 3,
                row: 5
              },
              конец: {
                col: 4,
                row: 6
              }
            }
          },
          пользовательскийStyleId: 'пользовательский-2'
        },
        {
          cellPosition: {
            range: {
              начало: {
                col: 1,
                row: 3
              },
              конец: {
                col: 2,
                row: 10
              }
            }
          },
          пользовательскийStyleId: 'пользовательский-3'
        }
      ]
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
