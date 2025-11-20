# Cell display график

в the предыдущий article, we introduced how к display minigraphs в cells. Minigraphs can do simple trend analysis и style configuration. If you want к apply the more powerful график Vграфик к таблицаs, please take a loхорошо в this tutorial.

## Inject график компонентs

Before using it, you need к inject the used график library компонентs:

    import Vграфик от '@visactor/vграфик';
    Vтаблица.регистрация.графикModule('vграфик', Vграфик);

About why you need к configure a имя к регистрация Vграфик`'vграфик'`? We have plans к access other график libraries.

## Related configuration

таблица display тип`cellType`Set к`график`Used к generate графикs.

*   cellType: 'график'//график график тип
*   графикModule: 'vграфик'//vграфик is the имя configured during registration
*   график Spec :{ } // график configuration item, support funciton define

Where the графикSpec configuration item corresponds[Vграфик configuration](https://visactor.io/vграфик/option)

## график график данные

график The график данные comes от the records set к the таблица. If it is базовый таблица данные, it can be set as follows:

```javascript
[
    {
        "personid": 1,
        "areaграфик": [{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 120},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 111}],
        "scatterграфик": [{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 120},{"x": "0","тип": "A","y": 130}]]
    },
    {
        "personid": 2,
        "areaграфик": [{"x": "0","тип": "A","y": 120},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 120},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 111}{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 130}],
        "scatterграфик": [{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 120},{"x": "0","тип": "A","y": 130},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 111}{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 100},{"x": "0","тип": "A","y": 100}]
    }
]
```

There are three полеs в our records: persionid, areaграфик, scatterграфик, where areaграфик и scatterграфик are the two данные that need к be provided для график use.

## пример

We use the above данные к display different график effects с different specs:

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
const records = [
    {
        "personid": 1,
        "areaграфик": [{"x": "0","тип": "A","y": 100},{"x": "1","тип": "A","y": 130},{"x": "2","тип": "A","y": 120},{"x": "3","тип": "A","y": 130},{"x": "4","тип": "A","y": 100},{"x": "5","тип": "A","y": 111}],
        "scatterграфик": [{"x": "1","тип": "A","y": 100},{"x": "2","тип": "A","y": 100},{"x": "3","тип": "A","y": 130},{"x": "4","тип": "A","y": 130},{"x": "5","тип": "A","y": 120},{"x": "6","тип": "A","y": 130}]
    },
    {
        "personid": 2,
        "areaграфик": [{"x": "0","тип": "A","y": 120},{"x": "1","тип": "A","y": 130},{"x": "2","тип": "A","y": 120},{"x": "3","тип": "A","y": 130},{"x": "4","тип": "A","y": 100},{"x": "5","тип": "A","y": 111},{"x": "6","тип": "A","y": 100},{"x": "7","тип": "A","y": 100},{"x": "8","тип": "A","y": 130}],
        "scatterграфик": [{"x": "0","тип": "A","y": 100},{"x": "1","тип": "A","y": 130},{"x": "2","тип": "A","y": 120},{"x": "3","тип": "A","y": 130},{"x": "4","тип": "A","y": 100},{"x": "5","тип": "A","y": 111},{"x": "6","тип": "A","y": 100},{"x": "7","тип": "A","y": 100},{"x": "8","тип": "A","y": 100},{"x": "9","тип": "A","y": 100}]
    }
];

const columns =[
    {
      поле: 'personid',
      заголовок: 'personid',
      description: '这是一个标题的详细描述',
      сортировка: true,
      ширина: 80,
      style: {
        textAlign: 'лево',
        bgColor: '#ea9999'
      }
    },
    {
      поле: 'areaграфик',
      заголовок: 'vграфик area',
      ширина: '320',
      cellType: 'график',
      графикModule: 'vграфик',
      графикSpec: {
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
      }
    },
    {
      поле: 'areaграфик',
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
      }
    },
    {
      поле: 'areaграфик',
      заголовок: 'vграфик line',
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
      заголовок: 'vграфик line',
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
       
      }
    },
    {
      поле: 'areaграфик',
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
       
      }
    },
    {
      поле: 'areaграфик',
      заголовок: 'vграфик line',
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
      заголовок: 'vграфик line',
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
    }
  ];
const option = {
  records,
  columns,
  defaultColширина: 200,
  defaultRowвысота: 200,
  defaultHeaderRowвысота: 50,
  автоWrapText:true,
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);

```

Through the above introduction и примеры, we can quickly create и configure the таблица display тип sparkline miniature в Vтаблица. Although only line graphs are currently supported, с subsequent development, the functions и types из minigraphs will become more и more perfect, providing more convenient и practical functions для данные lake visualization.
