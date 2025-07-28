---
категория: примеры
группа: данные-analysis
заголовок: сортировка функция
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-сортировка-func.png
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица#данныеConfig.сортировкаRules
---

# пользовательский сортировкаing из сводный analysis таблица

The сводный таблица is сортировкаed according к the dimension значение из a certain dimension. сортировкаRules can be configured в данныеConfig. Multiple сортировкаing rules can be configured. The one configured первый has a higher priority.

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
            textStick: true
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
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
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
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
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
      данныеConfig: {
        сортировкаRules: [
          {
            сортировкаполе: 'Sub-Категория',
            сортировкаFunc: (a, b) => {
              const indexA = SubКатегорияOrder.indexOf(a);
              const indexB = SubКатегорияOrder.indexOf(b);
              возврат (indexA === -1 ? 100 : indexA) > (indexB === -1 ? 100 : indexB) ? 1 : -1;
            }
          }
        ]
      },
      ширинаMode: 'standard'
    };
    const SubКатегорияOrder = [
      'Chairs',
      'таблицаs',
      'Furnishings',
      'Boхорошоcases',
      'Labels',
      'Paper',
      'Technology',
      'Appliances',
      'Art'
    ];
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
