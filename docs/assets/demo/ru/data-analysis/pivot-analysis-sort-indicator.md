---
категория: примеры
группа: данные-analysis
заголовок: сортировка Indicator
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-сортировка-indicator.png
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица#данныеConfig.сортировкаRules
---

# сводный analysis таблица is сортировкаed по indicator значение

The сводный таблица is сортировкаed according к the dimension значение из a certain dimension. сортировкаRules can be configured в данныеConfig. Multiple сортировкаing rules can be configured. The one configured первый has a higher priority. в this пример, the indicators indicator is configured с сортировка:true, which will display a сортировка иконка в the header cell that displays the indicator имя. Нажать the иконка к сортировка по indicator значение.

## Ключевые Конфигурации

- `сводныйтаблица`
- `columns`
- `rows`
- `indicators`
- `данныеConfig` configures данные rules, необязательный configuration items

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
        titleOnDimension: 'row'
      },
      данныеConfig: {
        сортировкаRules: [
          {
            сортировкаполе: 'Sub-Категория',
            сортировкаByIndicator: 'Продажи',
            сортировкаType: Vтаблица.TYPES.сортировкаType.DESC,
            query: ['East', 'Consumer']
          },
          {
            сортировкаполе: 'Регион',
            сортировкаBy: ['East', 'Central']
          }
        ]
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
