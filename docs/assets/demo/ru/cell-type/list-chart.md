---
категория: примеры
группа: Cell тип
заголовок: список таблица integrated график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-график-multiple.png
ссылка: cell_type/график
опция: списоктаблица-columns-график#cellType
---

# базовый таблица integrated график

Combine vграфик график library и render it into таблицаs к enrich visual display forms и improve multi-график rendering Производительность. This пример refers к vграфик’s bar line pie график. для details, please refer к: https://visactor.io/vграфик/демонстрация/progress/linear-progress-с-target-значение

## Ключевые Конфигурации

- `Vтаблица.регистрация.графикModule('vграфик', Vграфик)` регистрацияs the график library для drawing графикs. Currently supports Vграфик
- `cellType: 'график'` specifies the тип график
- `графикModule: 'vграфик'` specifies the регистрацияed график library имя
- `графикSpec: {}` график spec

## код демонстрация

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
const columns = [
  {
    поле: 'id',
    заголовок: 'id',
    сортировка: true,
    ширина: 80,
    style: {
      textAlign: 'лево',
      bgColor: '#ea9999'
    }
  },
  {
    поле: 'areaграфик',
    заголовок: 'multiple vграфик тип',
    ширина: '320',
    cellType: 'график',
    графикModule: 'vграфик',
    графикSpec(args) {
      if (args.row % 3 == 2)
        возврат {
          тип: 'area',
          данные: {
            id: 'данные'
          },
          xполе: 'x',
          yполе: 'y',
          seriesполе: 'тип',
          point: {
            style: {
              fillOpaГород: 1,
              strхорошоe: '#000',
              strхорошоeширина: 4
            },
            state: {
              навести: {
                fillOpaГород: 0.5,
                strхорошоe: 'blue',
                strхорошоeширина: 2
              },
              selected: {
                fill: 'red'
              }
            }
          },
          area: {
            style: {
              fillOpaГород: 0.3,
              strхорошоe: '#000',
              strхорошоeширина: 4
            },
            state: {
              навести: {
                fillOpaГород: 1
              },
              selected: {
                fill: 'red',
                fillOpaГород: 1
              }
            }
          },
          line: {
            state: {
              навести: {
                strхорошоe: 'red'
              },
              selected: {
                strхорошоe: 'yellow'
              }
            }
          },

          axes: [
            {
              orient: 'лево',
              range: {
                min: 0
              }
            },
            {
              orient: 'низ',
              label: {
                видимый: true
              },
              тип: 'band'
            }
          ],
          легендаs: [
            {
              видимый: true,
              orient: 'низ'
            }
          ]
        };
      else if (args.row % 3 == 1)
        возврат {
          тип: 'common',
          series: [
            {
              тип: 'line',
              данные: {
                id: 'данные'
              },
              xполе: 'x',
              yполе: 'y',
              seriesполе: 'тип',
              line: {
                state: {
                  навести: {
                    strхорошоeширина: 4
                  },
                  selected: {
                    strхорошоe: 'red'
                  },
                  hover_reverse: {
                    strхорошоe: '#ddd'
                  }
                }
              },
              point: {
                state: {
                  навести: {
                    fill: 'red'
                  },
                  selected: {
                    fill: 'yellow'
                  },
                  hover_reverse: {
                    fill: '#ddd'
                  }
                }
              },
              легендаs: [
                {
                  видимый: true,
                  orient: 'низ'
                }
              ]
            }
          ],
          axes: [
            {
              orient: 'лево',
              range: {
                min: 0
              }
            },
            {
              orient: 'низ',
              label: {
                видимый: true
              },
              тип: 'band'
            }
          ],
          легендаs: [
            {
              видимый: true,
              orient: 'низ'
            }
          ]
        };
      возврат {
        тип: 'pie',
        данные: { id: 'данные1' },
        Категорияполе: 'y',
        valueполе: 'x'
      };
    }
  },
  {
    поле: 'lineграфик',
    заголовок: 'vграфик line',
    ширина: '320',
    cellType: 'график',
    графикModule: 'vграфик',
    графикSpec: {
      тип: 'common',
      series: [
        {
          тип: 'line',
          данные: {
            id: 'данные'
          },
          xполе: 'x',
          yполе: 'y',
          seriesполе: 'тип',
          line: {
            state: {
              навести: {
                strхорошоeширина: 4
              },
              selected: {
                strхорошоe: 'red'
              },
              hover_reverse: {
                strхорошоe: '#ddd'
              }
            }
          },
          point: {
            state: {
              навести: {
                fill: 'red'
              },
              selected: {
                fill: 'yellow'
              },
              hover_reverse: {
                fill: '#ddd'
              }
            }
          },
          легендаs: [
            {
              видимый: true,
              orient: 'низ'
            }
          ]
        }
      ],
      axes: [
        {
          orient: 'лево',
          range: {
            min: 0
          }
        },
        {
          orient: 'низ',
          label: {
            видимый: true
          },
          тип: 'band'
        }
      ],
      легендаs: [
        {
          видимый: true,
          orient: 'низ'
        }
      ]
    }
  },
  {
    поле: 'barграфик',
    заголовок: 'vграфик bar',
    ширина: '320',
    cellType: 'график',
    графикModule: 'vграфик',
    графикSpec: {
      тип: 'common',
      series: [
        {
          тип: 'bar',
          данные: {
            id: 'данные'
          },
          xполе: 'x',
          yполе: 'y',
          seriesполе: 'тип',
          bar: {
            state: {
              навести: {
                fill: 'green'
              },
              selected: {
                fill: 'orange'
              },
              hover_reverse: {
                fill: '#ccc'
              }
            }
          }
        }
      ],
      axes: [
        {
          orient: 'лево',
          range: {
            min: 0
          }
        },
        {
          orient: 'низ',
          label: {
            видимый: true
          },
          тип: 'band'
        }
      ]
    }
  },
  {
    поле: 'scatterграфик',
    заголовок: 'vграфик scatter',
    ширина: '320',
    cellType: 'график',
    графикModule: 'vграфик',
    графикSpec: {
      тип: 'common',
      series: [
        {
          тип: 'scatter',
          данные: {
            id: 'данные'
          },
          xполе: 'x',
          yполе: 'y',
          seriesполе: 'тип'
        }
      ],
      axes: [
        {
          orient: 'лево',
          range: {
            min: 0
          }
        },
        {
          orient: 'низ',
          label: {
            видимый: true
          },
          тип: 'band'
        }
      ]
    }
  },
  {
    поле: 'areaграфик',
    заголовок: 'vграфик area',
    ширина: '320',
    cellType: 'график',
    графикModule: 'vграфик',
    графикSpec: {
      тип: 'common',
      series: [
        {
          тип: 'area',
          данные: {
            id: 'данные'
          },
          xполе: 'x',
          yполе: 'y',
          seriesполе: 'тип',
          point: {
            style: {
              fillOpaГород: 1,
              strхорошоe: '#000',
              strхорошоeширина: 4
            },
            state: {
              навести: {
                fillOpaГород: 0.5,
                strхорошоe: 'blue',
                strхорошоeширина: 2
              },
              selected: {
                fill: 'red'
              }
            }
          },
          area: {
            style: {
              fillOpaГород: 0.3,
              strхорошоe: '#000',
              strхорошоeширина: 4
            },
            state: {
              навести: {
                fillOpaГород: 1
              },
              selected: {
                fill: 'red',
                fillOpaГород: 1
              }
            }
          },
          line: {
            state: {
              навести: {
                strхорошоe: 'red'
              },
              selected: {
                strхорошоe: 'yellow'
              }
            }
          }
        }
      ],
      axes: [
        {
          orient: 'лево',
          range: {
            min: 0
          }
        },
        {
          orient: 'низ',
          label: {
            видимый: true
          },
          тип: 'band'
        }
      ],
      легендаs: [
        {
          видимый: true,
          orient: 'низ'
        }
      ]
    }
  }
];
const records = [];
для (let i = 1; i <= 10; i++)
  records.push({
    id: i,
    areaграфик: [
      { x: '0', тип: 'A', y: 100 * i },
      { x: '1', тип: 'A', y: '707' },
      { x: '2', тип: 'A', y: '832' },
      { x: '3', тип: 'A', y: '726' },
      { x: '4', тип: 'A', y: '756' },
      { x: '5', тип: 'A', y: '777' },
      { x: '6', тип: 'A', y: '689' },
      { x: '7', тип: 'A', y: '795' },
      { x: '8', тип: 'A', y: '889' },
      { x: '9', тип: 'A', y: '757' },
      { x: '0', тип: 'B', y: '773' },
      { x: '1', тип: 'B', y: '785' },
      { x: '2', тип: 'B', y: '635' },
      { x: '3', тип: 'B', y: '813' },
      { x: '4', тип: 'B', y: '678' },
      { x: '5', тип: 'B', y: 796 + 100 * i },
      { x: '6', тип: 'B', y: '652' },
      { x: '7', тип: 'B', y: '623' },
      { x: '8', тип: 'B', y: '649' },
      { x: '9', тип: 'B', y: '630' }
    ],
    lineграфик: [
      { x: '0', тип: 'A', y: 100 * i },
      { x: '1', тип: 'A', y: '707' },
      { x: '2', тип: 'A', y: '832' },
      { x: '3', тип: 'A', y: '726' },
      { x: '4', тип: 'A', y: '756' },
      { x: '5', тип: 'A', y: '777' },
      { x: '6', тип: 'A', y: '689' },
      { x: '7', тип: 'A', y: '795' },
      { x: '8', тип: 'A', y: '889' },
      { x: '9', тип: 'A', y: '757' },
      { x: '0', тип: 'B', y: 500 },
      { x: '1', тип: 'B', y: '785' },
      { x: '2', тип: 'B', y: '635' },
      { x: '3', тип: 'B', y: '813' },
      { x: '4', тип: 'B', y: '678' },
      { x: '5', тип: 'B', y: '796' },
      { x: '6', тип: 'B', y: '652' },
      { x: '7', тип: 'B', y: '623' },
      { x: '8', тип: 'B', y: '649' },
      { x: '9', тип: 'B', y: '630' }
    ],
    barграфик: [
      { x: '0', тип: 'A', y: 100 * i },
      { x: '1', тип: 'A', y: '707' },
      { x: '2', тип: 'A', y: '832' },
      { x: '3', тип: 'A', y: '726' },
      { x: '4', тип: 'A', y: '756' },
      { x: '5', тип: 'A', y: '777' },
      { x: '6', тип: 'A', y: '689' },
      { x: '7', тип: 'A', y: '795' },
      { x: '8', тип: 'A', y: '889' },
      { x: '9', тип: 'A', y: '757' },
      { x: '0', тип: 'B', y: 500 },
      { x: '1', тип: 'B', y: '785' },
      { x: '2', тип: 'B', y: '635' },
      { x: '3', тип: 'B', y: '813' },
      { x: '4', тип: 'B', y: '678' },
      { x: '5', тип: 'B', y: '796' },
      { x: '6', тип: 'B', y: '652' },
      { x: '7', тип: 'B', y: '623' },
      { x: '8', тип: 'B', y: '649' },
      { x: '9', тип: 'B', y: '630' }
    ],
    scatterграфик: [
      { x: '0', тип: 'A', y: 100 * i },
      { x: '1', тип: 'A', y: '707' },
      { x: '2', тип: 'A', y: '832' },
      { x: '3', тип: 'A', y: '726' },
      { x: '4', тип: 'A', y: '756' },
      { x: '5', тип: 'A', y: '777' },
      { x: '6', тип: 'A', y: '689' },
      { x: '7', тип: 'A', y: '795' },
      { x: '8', тип: 'A', y: '889' },
      { x: '9', тип: 'A', y: '757' },
      { x: '0', тип: 'B', y: 500 },
      { x: '1', тип: 'B', y: '785' },
      { x: '2', тип: 'B', y: '635' },
      { x: '3', тип: 'B', y: '813' },
      { x: '4', тип: 'B', y: '678' },
      { x: '5', тип: 'B', y: '796' },
      { x: '6', тип: 'B', y: '652' },
      { x: '7', тип: 'B', y: '623' },
      { x: '8', тип: 'B', y: '649' },
      { x: '9', тип: 'B', y: '630' }
    ]
  });
const option = {
  records,
  columns,
  transpose: false,
  defaultColширина: 200,
  defaultRowвысота: 200,
  defaultHeaderRowвысота: 50
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
