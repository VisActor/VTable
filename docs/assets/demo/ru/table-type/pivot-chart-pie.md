---
категория: примеры
группа: таблица-тип
заголовок: сводный график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-график-pie.png
ссылка: таблица_type/сводный_график
опция: сводныйграфик-indicators-график#cellType
---

# сводный график

The perspective combination diagram combines the vграфик график library к render into the таблица, enriching the visual display form и improving the rendering Производительность.

## Ключевые Конфигурации

- `сводныйграфик` Initialize the таблица тип using сводныйграфик.
- `Vтаблица.регистрация.графикModule('vграфик', Vграфик)` регистрация a графикing library для графикing, currently supports Vграфик
- `cellType: 'график'` Specify the тип график
- `графикModule: 'vграфик'` Specify the регистрацияed график library имя
- `графикSpec: {}` график specs

## код демонстрация

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        dimensionKey: 'Регион',
        заголовок: 'Регион',
        headerStyle: {
          textStick: true
        }
      },
      'Категория'
    ];
    const rows = [
      {
        dimensionKey: 'Order Year',
        заголовок: 'Order Year',
        headerStyle: {
          textStick: true
        }
      },
      'Ship Mode'
    ];
    const indicators = [
      {
        indicatorKey: 'Количество',
        заголовок: 'Количество',
        cellType: 'график',
        графикModule: 'vграфик',
        графикSpec: {
          // тип: 'common',
          stack: true,
          тип: 'pie',
          данные: {
            id: 'данные',
            полеs: {
              'Segment-Indicator': {
                сортировкаIndex: 1,
                domain: ['Consumer-Количество', 'Corporate-Количество', 'Home Office-Количество']
              }
            }
          },
          Категорияполе: 'Segment-Indicator',
          valueполе: 'Количество',
          scales: [
            {
              id: 'цвет',
              тип: 'ordinal',
              domain: ['Consumer-Количество', 'Corporate-Количество', 'Home Office-Количество'],
              range: ['#2E62F1', '#4DC36A', '#FF8406']
            }
          ]
        },
        style: {
          заполнение: 1
        }
      }
    ];
    const option = {
      hideIndicatorимя: true,
      rows,
      columns,
      indicators,
      records: данные,
      defaultRowвысота: 200,
      defaultHeaderRowвысота: 50,
      defaultColширина: 280,
      defaultHeaderColширина: 100,
      indicatorзаголовок: '指标',
      автоWrapText: true,
      ширинаMode: 'adaptive',
      высотаMode: 'adaptive',
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          автоWrapText: true
        }
      },
      легендаs: {
        orient: 'низ',
        тип: 'discrete',
        данные: [
          {
            label: 'Consumer-Количество',
            shape: {
              fill: '#2E62F1',
              symbolType: 'circle'
            }
          },
          {
            label: 'Corporate-Количество',
            shape: {
              fill: '#4DC36A',
              symbolType: 'square'
            }
          },
          {
            label: 'Home Office-Количество',
            shape: {
              fill: '#FF8406',
              symbolType: 'square'
            }
          }
        ]
      },
      pagination: {
        currentPвозраст: 0,
        perPвозрастCount: 8
      }
    };

    таблицаInstance = новый Vтаблица.сводныйграфик(document.getElementById(CONTAINER_ID), option);
    const { легенда_ITEM_Нажать } = Vтаблица.списоктаблица.событие_TYPE;
    таблицаInstance.на(легенда_ITEM_Нажать, args => {
      console.log('легенда_ITEM_Нажать', args);
      таблицаInstance.updateFilterRules([
        {
          filterKey: 'Segment-Indicator',
          filteredValues: args.значение
        }
      ]);
    });
    window.таблицаInstance = таблицаInstance;
  });
```
