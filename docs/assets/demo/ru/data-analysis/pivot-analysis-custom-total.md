---
категория: примеры
группа: данные-analysis
заголовок: пользовательский Total
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-пользовательский-total.png
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица#данныеConfig.totals
---

# сводный analysis таблица—пользовательскийized summary данные

сводный analysis таблица данные summary, if summary данные is passed в the данные source record, the таблица will give priority к using the user-ввод значение as the summary значение.

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
    debugger;
    данные = данные.concat([
      // 追加汇总数据
      {
        Регион: 'Central',
        Segment: 'Consumer',
        категория: 'Office Supplies',
        Количество: '1111',
        Продажи: '3333',
        Прибыль: '2222'
      },
      {
        Регион: 'Central',
        категория: 'Office Supplies',
        'Sub-Категория': 'Appliances',
        Количество: '1111',
        Продажи: '3333',
        Прибыль: '2222'
      },
      {
        Регион: 'Central',
        Количество: '4444',
        Продажи: '6666',
        Прибыль: '5555'
      },
      {
        категория: 'Office Supplies',
        Количество: '7777',
        Продажи: '9999',
        Прибыль: '8888'
      },
      {
        Количество: '9999',
        Продажи: '9999',
        Прибыль: '9999'
      }
    ]);
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
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      данныеConfig: {
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Категория'],
            grandTotalLabel: 'Row Totals',
            subTotalLabel: 'Sub Totals'
          },
          column: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Регион'],
            grandTotalLabel: 'Column Totals',
            subTotalLabel: 'Sub Totals'
          }
        }
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
