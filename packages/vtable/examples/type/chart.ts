import * as VTable from '../../src';
import VChart from '@visactor/vchart';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const temperatureList = {
    东北: {
      year: {
        '2013': 4.7,
        '2014': 5.5,
        '2015': 5.1,
        '2016': 5.4,
        '2017': 4.7,
        '2018': 5.7,
        '2019': 6.1,
        '2020': 5.7,
        '2021': 6.0,
        '2022': 6.3
      },
      month: {
        '1': -20.8,
        '2': -16.7,
        '3': -6.4,
        '4': 5.7,
        '5': 14.2,
        '6': 20.7,
        '7': 23.7,
        '8': 22.5,
        '9': 15.6,
        '10': 6.9,
        '11': -4.1,
        '12': -16.1
      },
      day: {
        '0': -20.6,
        '1': -21.2,
        '2': -21.4,
        '3': -21.2,
        '4': -20.8,
        '5': -20.5,
        '6': -19.8,
        '7': -17.9,
        '8': -14.9,
        '9': -11.6,
        '10': -8.6,
        '11': -6.3,
        '12': -4.8,
        '13': -4.0,
        '14': -3.7,
        '15': -4.2,
        '16': -6.0,
        '17': -8.6,
        '18': -11.2,
        '19': -14.0,
        '20': -16.3,
        '21': -18.1,
        '22': -19.5,
        '23': -20.2
      }
    },
    华北: {
      year: {
        '2013': 12.6,
        '2014': 13.2,
        '2015': 12.8,
        '2016': 13.4,
        '2017': 12.1,
        '2018': 13.2,
        '2019': 13.4,
        '2020': 13.0,
        '2021': 13.2,
        '2022': 13.7
      },
      month: {
        '1': -10.3,
        '2': -5.7,
        '3': 3.8,
        '4': 13.0,
        '5': 21.1,
        '6': 25.9,
        '7': 26.8,
        '8': 24.9,
        '9': 19.2,
        '10': 11.0,
        '11': 1.0,
        '12': -6.4
      },
      day: {
        '0': -5.6,
        '1': -5.9,
        '2': -6.0,
        '3': -5.8,
        '4': -5.3,
        '5': -4.7,
        '6': -3.4,
        '7': -1.5,
        '8': 1.3,
        '9': 4.4,
        '10': 7.1,
        '11': 9.0,
        '12': 10.3,
        '13': 10.9,
        '14': 11.0,
        '15': 10.5,
        '16': 8.9,
        '17': 6.2,
        '18': 3.3,
        '19': 0.8,
        '20': -1.5,
        '21': -3.0,
        '22': -4.0,
        '23': -4.9
      }
    },

    华东: {
      year: {
        '2013': 16.4,
        '2014': 16.9,
        '2015': 17.2,
        '2016': 17.2,
        '2017': 17.2,
        '2018': 17.4,
        '2019': 17.6,
        '2020': 17.5,
        '2021': 17.3,
        '2022': 18.0
      },
      month: {
        '1': 3.4,
        '2': 5.6,
        '3': 9.8,
        '4': 15.0,
        '5': 20.3,
        '6': 25.0,
        '7': 28.1,
        '8': 27.5,
        '9': 24.3,
        '10': 19.0,
        '11': 13.0,
        '12': 6.3
      },
      day: {
        '0': 2.4,
        '1': 1.9,
        '2': 1.7,
        '3': 1.4,
        '4': 1.7,
        '5': 2.7,
        '6': 5.1,
        '7': 8.1,
        '8': 11.1,
        '9': 14.0,
        '10': 16.1,
        '11': 17.4,
        '12': 18.2,
        '13': 18.6,
        '14': 18.4,
        '15': 17.6,
        '16': 15.9,
        '17': 13.4,
        '18': 10.6,
        '19': 7.9,
        '20': 5.8,
        '21': 4.1,
        '22': 2.8,
        '23': 2.2
      }
    },
    华南: {
      year: {
        '2013': 22.9,
        '2014': 22.8,
        '2015': 23.2,
        '2016': 23.2,
        '2017': 23.3,
        '2018': 23.5,
        '2019': 23.7,
        '2020': 23.6,
        '2021': 23.5,
        '2022': 24.1
      },
      month: {
        '1': 13.6,
        '2': 14.2,
        '3': 17.3,
        '4': 21.1,
        '5': 24.4,
        '6': 27.3,
        '7': 28.4,
        '8': 28.1,
        '9': 26.9,
        '10': 24.1,
        '11': 20.0,
        '12': 15.5
      },
      day: {
        '0': 13.2,
        '1': 12.8,
        '2': 12.5,
        '3': 12.3,
        '4': 12.4,
        '5': 13.3,
        '6': 15.3,
        '7': 18.3,
        '8': 21.3,
        '9': 23.8,
        '10': 25.3,
        '11': 26.3,
        '12': 26.8,
        '13': 26.8,
        '14': 26.4,
        '15': 25.6,
        '16': 24.2,
        '17': 22.1,
        '18': 19.6,
        '19': 17.4,
        '20': 15.6,
        '21': 14.2,
        '22': 13.1,
        '23': 12.4
      }
    },
    中南: {
      year: {
        '2013': 18.9,
        '2014': 19.0,
        '2015': 19.2,
        '2016': 19.3,
        '2017': 19.2,
        '2018': 19.5,
        '2019': 19.7,
        '2020': 19.6,
        '2021': 19.5,
        '2022': 20.1
      },
      month: {
        '1': 7.6,
        '2': 8.3,
        '3': 12.2,
        '4': 16.9,
        '5': 21.1,
        '6': 24.6,
        '7': 27.2,
        '8': 27.1,
        '9': 24.7,
        '10': 20.9,
        '11': 15.9,
        '12': 10.6
      },
      day: {
        '0': 11.8,
        '1': 11.3,
        '2': 10.9,
        '3': 10.7,
        '4': 11.0,
        '5': 12.0,
        '6': 14.0,
        '7': 17.1,
        '8': 20.7,
        '9': 23.3,
        '10': 24.8,
        '11': 25.2,
        '12': 25.4,
        '13': 25.3,
        '14': 24.9,
        '15': 23.9,
        '16': 22.3,
        '17': 20.4,
        '18': 18.4,
        '19': 16.4,
        '20': 14.8,
        '21': 13.5,
        '22': 12.5,
        '23': 11.9
      }
    },
    西南: {
      year: {
        '2013': 16.1,
        '2014': 16.3,
        '2015': 16.4,
        '2016': 16.6,
        '2017': 16.5,
        '2018': 16.8,
        '2019': 17.0,
        '2020': 16.9,
        '2021': 16.8,
        '2022': 17.4
      },
      month: {
        '1': 8.4,
        '2': 9.5,
        '3': 12.8,
        '4': 15.7,
        '5': 18.4,
        '6': 20.9,
        '7': 21.6,
        '8': 21.3,
        '9': 20.3,
        '10': 17.6,
        '11': 13.8,
        '12': 10.2
      },
      day: {
        '0': 13.7,
        '1': 13.0,
        '2': 12.5,
        '3': 12.2,
        '4': 12.3,
        '5': 13.0,
        '6': 14.5,
        '7': 16.9,
        '8': 19.9,
        '9': 22.4,
        '10': 23.9,
        '11': 24.4,
        '12': 24.5,
        '13': 24.3,
        '14': 23.8,
        '15': 22.8,
        '16': 21.1,
        '17': 19.0,
        '18': 17.0,
        '19': 15.2,
        '20': 14.0,
        '21': 13.0,
        '22': 12.3,
        '23': 11.9
      }
    },
    西北: {
      year: {
        '2013': 10.5,
        '2014': 10.3,
        '2015': 10.6,
        '2016': 10.7,
        '2017': 10.6,
        '2018': 11.0,
        '2019': 11.2,
        '2020': 11.0,
        '2021': 10.8,
        '2022': 11.5
      },
      month: {
        '1': -7.8,
        '2': -4.0,
        '3': 2.9,
        '4': 11.0,
        '5': 16.8,
        '6': 21.2,
        '7': 23.5,
        '8': 22.4,
        '9': 16.8,
        '10': 8.4,
        '11': -0.3,
        '12': -6.1
      },
      day: {
        '0': -9.2,
        '1': -9.5,
        '2': -9.4,
        '3': -9.1,
        '4': -8.9,
        '5': -8.8,
        '6': -8.6,
        '7': -7.9,
        '8': -6.7,
        '9': -5.1,
        '10': -3.3,
        '11': -1.5,
        '12': -0.3,
        '13': 0.5,
        '14': 0.6,
        '15': -0.1,
        '16': -1.8,
        '17': -3.9,
        '18': -5.9,
        '19': -7.3,
        '20': -8.0,
        '21': -8.6,
        '22': -9.0,
        '23': -9.2
      }
    }
  };
  const rowTree = [
    {
      dimensionKey: 'region',
      value: '东北'
    },
    {
      dimensionKey: 'region',
      value: '华北'
    },
    {
      dimensionKey: 'region',
      value: '华东'
    },
    {
      dimensionKey: 'region',
      value: '华南'
    },
    {
      dimensionKey: 'region',
      value: '中南'
    },
    {
      dimensionKey: 'region',
      value: '西南'
    },
    {
      dimensionKey: 'region',
      value: '西北'
    }
  ];

  const records = [];
  for (let i = 0; i <= 6; i++) {
    const record = {
      region: rowTree[i].value
    };
    record.dayTrendChart = [temperatureList[rowTree[i].value].day];

    record.monthTrendChart = [temperatureList[rowTree[i].value].month];

    record.yearTrendChart = [temperatureList[rowTree[i].value].year];

    records.push(record);
  }
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50,
    indicators: [
      {
        indicatorKey: 'dayTrendChart',
        cellType: 'chart',
        chartModule: 'vchart',
        width: 500,
        chartSpec: args => {
          if (args.row % 2 === 0) {
            return {
              type: 'common',
              series: [
                {
                  type: 'area',
                  data: {
                    id: 'data',
                    transforms: [
                      {
                        type: 'fold',
                        options: {
                          key: 'x', // 转化后，原始数据的 key 放入这个配置对应的字段中作为值
                          value: 'y', // 转化后，原始数据的 value 放入这个配置对应的字段中作为值
                          fields: Object.keys(temperatureList[rowTree[0].value].month) // 需要转化的维度
                        }
                      }
                    ]
                  },
                  xField: 'x',
                  yField: 'y',
                  seriesField: 'type',
                  point: {
                    style: {
                      fillOpacity: 1,
                      strokeWidth: 0
                    },
                    state: {
                      hover: {
                        fillOpacity: 0.5,
                        stroke: 'blue',
                        strokeWidth: 2
                      },
                      selected: {
                        fill: 'red'
                      }
                    }
                  },
                  area: {
                    style: {
                      fillOpacity: 0.3,
                      stroke: '#000',
                      strokeWidth: 4
                    },
                    state: {
                      hover: {
                        fillOpacity: 1
                      },
                      selected: {
                        fill: 'red',
                        fillOpacity: 1
                      }
                    }
                  },
                  line: {
                    state: {
                      hover: {
                        stroke: 'red'
                      },
                      selected: {
                        stroke: 'yellow'
                      }
                    }
                  }
                }
              ],
              axes: [{ orient: 'left' }, { orient: 'bottom', label: { visible: true } }],

              markLine: [
                {
                  y: 0,
                  line: {
                    // 配置线样式
                    style: {
                      lineWidth: 1,
                      stroke: 'black',
                      lineDash: [5, 5]
                    }
                  },
                  endSymbol: {
                    style: {
                      visible: false
                    }
                  }
                }
              ]
            };
          }
          return {
            type: 'common',
            series: [
              {
                type: 'line',
                data: {
                  id: 'data',
                  transforms: [
                    {
                      type: 'fold',
                      options: {
                        key: 'x', // 转化后，原始数据的 key 放入这个配置对应的字段中作为值
                        value: 'y', // 转化后，原始数据的 value 放入这个配置对应的字段中作为值
                        fields: Object.keys(temperatureList[rowTree[0].value].day) // 需要转化的维度
                      }
                    }
                  ]
                },
                xField: 'x',
                yField: 'y',
                seriesField: 'type'
              }
            ],
            axes: [{ orient: 'left' }, { orient: 'bottom', label: { visible: true } }]
          };
        }
      },
      {
        indicatorKey: 'monthTrendChart',
        cellType: 'chart',
        chartModule: 'vchart',
        width: 500,
        chartSpec: {
          type: 'common',
          series: [
            {
              type: 'area',
              data: {
                id: 'data',
                transforms: [
                  {
                    type: 'fold',
                    options: {
                      key: 'x', // 转化后，原始数据的 key 放入这个配置对应的字段中作为值
                      value: 'y', // 转化后，原始数据的 value 放入这个配置对应的字段中作为值
                      fields: Object.keys(temperatureList[rowTree[0].value].month) // 需要转化的维度
                    }
                  }
                ]
              },
              xField: 'x',
              yField: 'y',
              seriesField: 'type',
              point: {
                style: {
                  fillOpacity: 1,
                  strokeWidth: 0
                },
                state: {
                  hover: {
                    fillOpacity: 0.5,
                    stroke: 'blue',
                    strokeWidth: 2
                  },
                  selected: {
                    fill: 'red'
                  }
                }
              },
              area: {
                style: {
                  fillOpacity: 0.3,
                  stroke: '#000',
                  strokeWidth: 4
                },
                state: {
                  hover: {
                    fillOpacity: 1
                  },
                  selected: {
                    fill: 'red',
                    fillOpacity: 1
                  }
                }
              },
              line: {
                state: {
                  hover: {
                    stroke: 'red'
                  },
                  selected: {
                    stroke: 'yellow'
                  }
                }
              }
            }
          ],
          axes: [{ orient: 'left' }, { orient: 'bottom', label: { visible: true } }],

          markLine: [
            {
              y: 0,
              line: {
                // 配置线样式
                style: {
                  lineWidth: 1,
                  stroke: 'black',
                  lineDash: [5, 5]
                }
              },
              endSymbol: {
                style: {
                  visible: false
                }
              }
            }
          ]
        }
      },
      {
        indicatorKey: 'yearTrendChart',
        cellType: 'chart',
        chartModule: 'vchart',
        width: 500,
        chartSpec: {
          type: 'common',
          data: {
            id: 'data',
            transforms: [
              {
                type: 'fold',
                options: {
                  key: 'x', // 转化后，原始数据的 key 放入这个配置对应的字段中作为值
                  value: 'y', // 转化后，原始数据的 value 放入这个配置对应的字段中作为值
                  fields: Object.keys(temperatureList[rowTree[0].value].year) // 需要转化的维度
                }
              }
            ]
          },
          series: [
            {
              type: 'bar',
              xField: 'x',
              yField: 'y'
            },
            {
              type: 'line',
              xField: 'x',
              yField: 'y',
              point: {
                style: {
                  fill: 'purple',
                  fillOpacity: 1,
                  strokeWidth: 0
                }
              },
              line: {
                style: { stroke: 'red' }
              }
            }
          ],
          axes: [
            { orient: 'left', range: { min: 0, max: 20 } },
            { orient: 'bottom', label: { visible: true } }
          ]
        }
      }
    ],
    columnTree: [
      {
        value: '日气温走势',
        indicatorKey: 'dayTrendChart'
      },
      {
        value: '月气温走势',
        indicatorKey: 'monthTrendChart'
      },
      {
        value: '年气温走势',
        indicatorKey: 'yearTrendChart'
      }
    ],
    rowTree: [
      {
        dimensionKey: 'region',
        value: '东北'
      },
      {
        dimensionKey: 'region',
        value: '华北'
      },
      {
        dimensionKey: 'region',
        value: '华东'
      },
      {
        dimensionKey: 'region',
        value: '华南'
      },
      {
        dimensionKey: 'region',
        value: '中南'
      },
      {
        dimensionKey: 'region',
        value: '西南'
      },
      {
        dimensionKey: 'region',
        value: '西北'
      }
    ],
    corner: {
      titleOnDimension: 'row'
    },
    // hover: {
    //   disableHover: true
    // },
    select: {
      disableSelect: true
    },
    theme: VTable.themes.DEFAULT.extends({
      bodyStyle: {
        borderColor: '',
        hover: {
          cellBgColor: ''
        },
        bgColor: ''
      },
      headerStyle: {
        textAlign: 'center',
        borderColor: '',
        bgColor: ''
      },
      rowHeaderStyle: {
        textAlign: 'center',
        borderColor: '',
        bgColor: ''
      },
      cornerHeaderStyle: {
        borderColor: '',
        bgColor: ''
      }
    })
  };
  const tableInstance = new VTable.PivotTable(option);
  window.tableInstance = tableInstance;
}
