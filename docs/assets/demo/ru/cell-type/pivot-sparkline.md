---
категория: примеры
группа: Cell тип
заголовок: сводныйтаблица display sparkline
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-sparkline.png
ссылка: cell_type/график
опция: сводныйтаблица-indicators-график#cellType
---

# сводныйтаблица display sparkline

Display the данные corresponding к the cell в the form из a mini график.

## Ключевые Конфигурации

- `cellType: 'sparkline'` specifies the тип из график
- `sparklineSpec: {}` Sparkline spec
- `данныеConfig.aggregationRules` configures aggregation rules. The rule used here is из `RECORD` тип, which means that the source данные record из a cell needs к be collected as the данные source из the mini график

## код демонстрация

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        dimensionKey: 'Регион',
        заголовок: 'Регион',
        headerStyle: {
          textStick: true
        }
      }
    ];
    const rows = ['Категория'];
    const indicators = [
      {
        indicatorKey: 'Продажи',
        заголовок: 'Продажи',
        ширина: 120,
        format: rec => {
          возврат '$' + число(rec).toFixed(2);
        }
      },
      {
        indicatorKey: 'ПродажиRecords',
        заголовок: 'Продажи Trend',
        cellType: 'sparkline',
        ширина: 500,
        sparklineSpec: {
          тип: 'line',
          xполе: 'Дата Заказа',
          yполе: 'Продажи',
          pointShowRule: 'никто',
          smooth: true,
          line: {
            style: {
              strхорошоe: '#2E62F1',
              strхорошоeширина: 2
              // interpolate: 'monotone',
            }
          },
          point: {
            навести: {
              strхорошоe: 'blue',
              strхорошоeширина: 1,
              fill: 'red',
              shape: 'circle',
              размер: 4
            },
            style: {
              strхорошоe: 'red',
              strхорошоeширина: 1,
              fill: 'yellow',
              shape: 'circle',
              размер: 2
            }
          },
          crosshair: {
            style: {
              strхорошоe: 'gray',
              strхорошоeширина: 1
            }
          }
        }
      }
    ];
    const option = {
      данныеConfig: {
        aggregationRules: [
          //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
          {
            indicatorKey: 'ПродажиRecords', //指标名称
            поле: 'Продажи', //指标依据字段
            aggregationType: Vтаблица.TYPES.AggregationType.RECORD //计算类型
          }
        ]
      },
      rows,
      columns,
      indicators,
      indicatorsAsCol: true,
      records: данные,
      defaultRowвысота: 80,
      defaultHeaderRowвысота: 50,
      defaultColширина: 280,
      defaultHeaderColширина: 130,
      indicatorзаголовок: '指标',
      автоWrapText: true,
      // ширинаMode:'adaptive',
      // высотаMode:'adaptive',
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          автоWrapText: true
        }
      }
    };

    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    const { легенда_ITEM_Нажать } = Vтаблица.списоктаблица.событие_TYPE;
    window.таблицаInstance = таблицаInstance;
    таблицаInstance.onVграфиксобытие('Нажать', args => {
      console.log('onVграфиксобытие Нажать', args);
    });
    таблицаInstance.onVграфиксобытие('mouseover', args => {
      console.log('onVграфиксобытие mouseover', args);
    });
    window.таблицаInstance = таблицаInstance;
  });
```
