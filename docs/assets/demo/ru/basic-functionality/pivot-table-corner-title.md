---
категория: примеры
группа: базовый возможности
заголовок: Display dimension имяs в сводный таблица headers
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-таблица-corner-title.png
ссылка: таблица_type/сводный_таблица/сводный_таблица_useвозраст
опция: сводныйтаблица#corner
---

# Display dimension имяs в сводный таблица headers

If you set the header title display content basis к `'все'`, the header cell content will be the concatenation из the row dimension имя и the column dimension имя.

titleOnDimension The corner title displays content based на:

- 'column' column dimension имя as header cell content
- 'row' row dimension имя as header cell content
- 'никто' means the header cell content is empty
- 'все' means the header cell content is the concatenation из the row dimension имя и the column dimension имя

## Ключевые Конфигурации

- `сводныйтаблица`
- `columns`
- `rows`
- `indicators`
- `corner.titleOnDimension` Corner title display content based на

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.данныеValue === 'Row Totals') {
                возврат '#ff9900';
              }
              возврат '#ECF1F5';
            }
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
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
        },
        {
          dimensionKey: 'Segment',
          заголовок: 'Segment',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Количество',
          заголовок: 'Количество',
          ширина: 'авто',
          сортировка: true,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.значение === 'Sub Totals') {
                возврат '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.значение === 'Row Totals') {
                возврат '#ff9900';
              }
              возврат undefined;
            }
          }
        },
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          сортировка: true,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.значение === 'Sub Totals') {
                возврат '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.значение === 'Row Totals') {
                возврат '#ff9900';
              }
              возврат undefined;
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
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.значение === 'Sub Totals') {
                возврат '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.значение === 'Row Totals') {
                возврат '#ff9900';
              }
              возврат undefined;
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'все'
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
