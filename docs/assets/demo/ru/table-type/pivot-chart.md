---
категория: примеры
группа: таблица-тип
заголовок: сводный график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-график.png
ссылка: таблица_type/сводный_график
опция: сводныйграфик-indicators-график#cellType
---

# Perspective combination diagram

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
        ширина: 'авто',
        cellType: 'график',
        графикModule: 'vграфик',
        графикSpec: {
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
        },
        style: {
          заполнение: 1
        }
      },
      {
        indicatorKey: 'Продажи',
        заголовок: 'Продажи & Прибыль',
        cellType: 'график',
        графикModule: 'vграфик',
        графикSpec: {
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
        },
        style: {
          заполнение: 1
        }
      }
    ];
    const option = {
      rows,
      columns,
      indicators,
      indicatorsAsCol: false,
      records: данные,
      defaultRowвысота: 200,
      defaultHeaderRowвысота: 50,
      defaultColширина: 280,
      defaultHeaderColширина: 100,
      indicatorзаголовок: '指标',
      автоWrapText: true,
      // ширинаMode:'adaptive',
      // высотаMode:'adaptive',
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
            label: 'Consumer-Количество',
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
          },
          {
            label: 'Consumer-Продажи',
            shape: {
              fill: '#FFCC00',
              symbolType: 'square'
            }
          },
          {
            label: 'Consumer-Продажи',
            shape: {
              fill: '#4F44CF',
              symbolType: 'square'
            }
          },
          {
            label: 'Home Office-Продажи',
            shape: {
              fill: '#5AC8FA',
              symbolType: 'square'
            }
          },
          {
            label: 'Consumer-Прибыль',
            shape: {
              fill: '#003A8C',
              symbolType: 'square'
            }
          },
          {
            label: 'Consumer-Прибыль',
            shape: {
              fill: '#B08AE2',
              symbolType: 'square'
            }
          },
          {
            label: 'Home Office-Прибыль',
            shape: {
              fill: '#FF6341',
              symbolType: 'square'
            }
          }
        ]
      },
      тема: {
        bodyStyle: {
          borderColor: 'gray',
          borderLineширина: [1, 0, 0, 1]
        },
        headerStyle: {
          borderColor: 'gray',
          borderLineширина: [0, 0, 1, 1],
          навести: {
            cellBgColor: '#CCE0FF'
          }
        },
        rowHeaderStyle: {
          borderColor: 'gray',
          borderLineширина: [1, 1, 0, 0],
          навести: {
            cellBgColor: '#CCE0FF'
          }
        },
        cornerHeaderStyle: {
          borderColor: 'gray',
          borderLineширина: [0, 1, 1, 0],
          навести: {
            cellBgColor: ''
          }
        },
        cornerRightTopCellStyle: {
          borderColor: 'gray',
          borderLineширина: [0, 0, 1, 1],
          навести: {
            cellBgColor: ''
          }
        },
        cornerLeftBottomCellStyle: {
          borderColor: 'gray',
          borderLineширина: [1, 1, 0, 0],
          навести: {
            cellBgColor: ''
          }
        },
        cornerRightBottomCellStyle: {
          borderColor: 'gray',
          borderLineширина: [1, 0, 0, 1],
          навести: {
            cellBgColor: ''
          }
        },
        rightFrozenStyle: {
          borderColor: 'gray',
          borderLineширина: [1, 0, 1, 1],
          навести: {
            cellBgColor: ''
          }
        },
        bottomFrozenStyle: {
          borderColor: 'gray',
          borderLineширина: [1, 1, 0, 1],
          навести: {
            cellBgColor: ''
          }
        },
        selectionStyle: {
          cellBgColor: '',
          cellBorderColor: ''
        },
        frameStyle: {
          borderLineширина: 0
        }
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
    таблицаInstance.onVграфиксобытие('Нажать', args => {
      console.log('onVграфиксобытие Нажать', args);
    });
    таблицаInstance.onVграфиксобытие('mouseover', args => {
      console.log('onVграфиксобытие mouseover', args);
    });
    window.таблицаInstance = таблицаInstance;
  });
```
