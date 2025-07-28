---
категория: примеры
группа: grammatical-tag
заголовок: сводный график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-график.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# сводный график

The props attributes accepted по сводныйтаблица&сводныйграфик are consistent с options. The semantic sub-компонентs are as follows:

- сводныйColumnDimension: The dimension configuration на the column is consistent с the definition из columns в option [апи](../../option/сводныйтаблица-columns-текст#headerType)
- сводныйRowDimension: The dimension configuration на the row is consistent с the definition из rows в option [апи](../../option/сводныйтаблица-rows-текст#headerType)
- сводныйIndicator: indicator configuration, consistent с the definition из indicators в option [апи](../../option/сводныйтаблица-indicators-текст#cellType)
- сводныйColumnHeaderзаголовок: column header title configuration, consistent с the definition из columnHeaderTitle в option [апи](../../option/сводныйтаблица#rowHeaderTitle)
- сводныйRowHeaderзаголовок: row header title configuration, consistent с the definition из rowHeaderTitle в option [апи](../../option/сводныйтаблица#columnHeaderTitle)
- сводныйCorner: Corner configuration, consistent с the definition из corner в option [апи](../../option/сводныйтаблица#corner)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';
// import Vграфик от '@visactor/vграфик';

ReactVтаблица.регистрация.графикModule('vграфик', Vграфик);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
    root.render(
      <ReactVтаблица.сводныйграфик
        records={данные}
        indicatorsAsCol={false}
        defaultRowвысота={200}
        defaultHeaderRowвысота={50}
        defaultColширина={280}
        defaultHeaderColширина={100}
      >
        <ReactVтаблица.сводныйColumnDimension dimensionKey={'Регион'} title={'Регион'} />
        <ReactVтаблица.сводныйRowDimension dimensionKey={'Order Year'} title={'Order Year'} />
        <ReactVтаблица.сводныйRowDimension dimensionKey={'Ship Mode'} title={'Ship Mode'} />
        <ReactVтаблица.сводныйIndicator
          indicatorKey={'Количество'}
          title={'Количество'}
          ширина={'авто'}
          cellType={'график'}
          графикModule={'vграфик'}
          графикSpec={{
            // тип: 'common',
            stack: true,
            тип: 'bar',
            данные: {
              id: 'данные',
              полеs: {
                //设置xполе数据的顺序
                'Sub-Категория': {
                  сортировкаIndex: 0,
                  domain: [
                    'Chairs',
                    'таблицаs',
                    'Boхорошоcases',
                    'Furnishings',

                    'Binders',
                    'Art',
                    'Storвозраст',
                    'Appliances',
                    'Envelopes',
                    'Fasteners',
                    'Paper',
                    'Labels',
                    'Supplies',
                    'Accessories',
                    'Phones',
                    'Copiers',
                    'Machines'
                  ]
                },
                'Segment-Indicator': {
                  //设置seriesполе数据的顺序 应该设置20001的顺序的 但是按照图例的顺序设置后堆叠效果和3.X不一致
                  сортировкаIndex: 1,
                  domain: [
                    'Consumer-Количество',
                    'Corporate-Количество',
                    'Home Office-Количество',
                    'Consumer-Продажи',
                    'Corporate-Продажи',
                    'Home Office-Продажи',
                    'Consumer-Прибыль',
                    'Corporate-Прибыль',
                    'Home Office-Прибыль'
                  ]
                  // lockStatisticsByDomain:  true
                }
              }
            },
            xполе: ['Sub-Категория'],
            yполе: 'Количество',
            seriesполе: 'Segment-Indicator',
            axes: [
              { orient: 'лево', видимый: true, label: { видимый: true } },
              { orient: 'низ', видимый: true }
            ],
            bar: {
              state: {
                selected: {
                  fill: 'yellow'
                },
                selected_reverse: {
                  // fill: '#ddd'
                  opaГород: 0.2
                }
              }
            },
            scales: [
              {
                id: 'цвет',
                тип: 'ordinal',
                domain: [
                  'Consumer-Количество',
                  'Corporate-Количество',
                  'Home Office-Количество',
                  'Consumer-Продажи',
                  'Corporate-Продажи',
                  'Home Office-Продажи',
                  'Consumer-Прибыль',
                  'Corporate-Прибыль',
                  'Home Office-Прибыль'
                ],
                range: [
                  '#2E62F1',
                  '#4DC36A',
                  '#FF8406',
                  '#FFCC00',
                  '#4F44CF',
                  '#5AC8FA',
                  '#003A8C',
                  '#B08AE2',
                  '#FF6341',
                  '#98DD62',
                  '#07A199',
                  '#87DBDD'
                ]
              }
            ]
          }}
          style={{
            заполнение: 1
          }}
        />
        <ReactVтаблица.сводныйIndicator
          indicatorKey={'Продажи'}
          title={'Продажи'}
          ширина={'авто'}
          cellType={'график'}
          графикModule={'vграфик'}
          графикSpec={{
            тип: 'common',
            series: [
              {
                тип: 'bar',
                данные: {
                  id: 'данные1',
                  полеs: {
                    //设置xполе数据的顺序
                    'Sub-Категория': {
                      сортировкаIndex: 0,
                      domain: [
                        'Chairs',
                        'таблицаs',
                        'Boхорошоcases',
                        'Furnishings',

                        'Binders',
                        'Art',
                        'Storвозраст',
                        'Appliances',
                        'Envelopes',
                        'Fasteners',
                        'Paper',
                        'Labels',
                        'Supplies',
                        'Accessories',
                        'Phones',
                        'Copiers',
                        'Machines'
                      ]
                    },
                    'Segment-Indicator': {
                      //设置seriesполе数据的顺序 应该设置20001的顺序的 但是按照图例的顺序设置后堆叠效果和3.X不一致
                      сортировкаIndex: 1,
                      domain: [
                        'Consumer-Количество',
                        'Corporate-Количество',
                        'Home Office-Количество',
                        'Consumer-Продажи',
                        'Corporate-Продажи',
                        'Home Office-Продажи',
                        'Consumer-Прибыль',
                        'Corporate-Прибыль',
                        'Home Office-Прибыль'
                      ]
                      // lockStatisticsByDomain:  true
                    }
                  }
                },
                stack: true,
                xполе: ['Sub-Категория'],
                yполе: 'Продажи',
                seriesполе: 'Segment-Indicator',
                bar: {
                  state: {
                    selected: {
                      fill: 'yellow'
                    },
                    selected_reverse: {
                      // fill: '#ddd'
                      opaГород: 0.2
                    }
                  }
                }
              },
              {
                тип: 'line',
                данные: {
                  id: 'данные2',
                  полеs: {
                    //设置xполе数据的顺序
                    'Sub-Категория': {
                      сортировкаIndex: 0,
                      domain: [
                        'Chairs',
                        'таблицаs',
                        'Boхорошоcases',
                        'Furnishings',

                        'Binders',
                        'Art',
                        'Storвозраст',
                        'Appliances',
                        'Envelopes',
                        'Fasteners',
                        'Paper',
                        'Labels',
                        'Supplies',

                        'Phones',
                        'Accessories',
                        'Machines',
                        'Copiers'
                      ]
                    },
                    'Segment-Indicator': {
                      //设置seriesполе数据的顺序 应该设置20001的顺序的 但是按照图例的顺序设置后堆叠效果和3.X不一致
                      сортировкаIndex: 1,
                      domain: [
                        'Consumer-Количество',
                        'Corporate-Количество',
                        'Home Office-Количество',
                        'Consumer-Продажи',
                        'Corporate-Продажи',
                        'Home Office-Продажи',
                        'Consumer-Прибыль',
                        'Corporate-Прибыль',
                        'Home Office-Прибыль'
                      ]
                      // lockStatisticsByDomain:  true
                    }
                  }
                },
                stack: false,
                xполе: ['Sub-Категория'],
                yполе: 'Прибыль',
                seriesполе: 'Segment-Indicator',
                line: {
                  state: {
                    selected: {
                      lineширина: 3
                    },
                    selected_reverse: {
                      lineширина: 1
                    }
                  }
                },
                point: {
                  state: {
                    selected: {
                      fill: 'yellow'
                    },
                    selected_reverse: {
                      fill: '#ddd'
                    }
                  }
                }
              }
            ],
            scales: [
              {
                id: 'цвет',
                тип: 'ordinal',
                domain: [
                  'Consumer-Количество',
                  'Corporate-Количество',
                  'Home Office-Количество',
                  'Consumer-Продажи',
                  'Corporate-Продажи',
                  'Home Office-Продажи',
                  'Consumer-Прибыль',
                  'Corporate-Прибыль',
                  'Home Office-Прибыль'
                ],
                range: [
                  '#2E62F1',
                  '#4DC36A',
                  '#FF8406',
                  '#FFCC00',
                  '#4F44CF',
                  '#5AC8FA',
                  '#003A8C',
                  '#B08AE2',
                  '#FF6341',
                  '#98DD62',
                  '#07A199',
                  '#87DBDD'
                ]
              }
            ]
            // axes: [
            //   { orient: 'лево', видимый: true, label: { видимый: true } },
            //   { orient: 'низ', видимый: true }
            // ]
          }}
          style={{
            заполнение: 1
          }}
        />
      </ReactVтаблица.сводныйграфик>
    );
  });

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
