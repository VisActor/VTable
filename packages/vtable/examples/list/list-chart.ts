/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
VTable.register.chartType('vchart', VChart);
const Table_CONTAINER_DOM_ID = 'vTable';
export function createTable() {
  const columns = [
    {
      field: 'personid',
      caption: 'personid',
      description: '这是一个标题的详细描述',
      sort: true,
      width: 80,
      style: {
        textAlign: 'left',
        bgColor: '#ea9999'
      }
    },
    {
      field: 'areaChart',
      caption: 'vchart area',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'area',
        data: {
          id: 'data'
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'type',
        point: {
          style: {
            fillOpacity: 1,
            stroke: '#000',
            strokeWidth: 4
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
        },

        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ],
        legends: [
          {
            visible: true,
            orient: 'bottom'
          }
        ]
      }
    },
    {
      field: 'lineChart',
      caption: 'vchart line',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'line',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            line: {
              state: {
                hover: {
                  strokeWidth: 4
                },
                selected: {
                  stroke: 'red'
                },
                hover_reverse: {
                  stroke: '#ddd'
                }
              }
            },
            point: {
              state: {
                hover: {
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
            legends: [
              {
                visible: true,
                orient: 'bottom'
              }
            ]
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ],
        legends: [
          {
            visible: true,
            orient: 'bottom'
          }
        ]
      }
    },
    {
      field: 'barChart',
      caption: 'vchart line',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'bar',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            bar: {
              state: {
                hover: {
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
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ]
      }
    },
    {
      field: 'scatterChart',
      caption: 'vchart line',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'scatter',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type'
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ]
      }
    },
    {
      field: 'areaChart',
      caption: 'vchart area',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'area',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            point: {
              style: {
                fillOpacity: 1,
                stroke: '#000',
                strokeWidth: 4
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
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ],
        legends: [
          {
            visible: true,
            orient: 'bottom'
          }
        ]
      }
    },
    {
      field: 'lineChart',
      caption: 'vchart line',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'line',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            line: {
              state: {
                hover: {
                  strokeWidth: 4
                },
                selected: {
                  stroke: 'red'
                },
                hover_reverse: {
                  stroke: '#ddd'
                }
              }
            },
            point: {
              state: {
                hover: {
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
            legends: [
              {
                visible: true,
                orient: 'bottom'
              }
            ]
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ],
        legends: [
          {
            visible: true,
            orient: 'bottom'
          }
        ]
      }
    },
    {
      field: 'barChart',
      caption: 'vchart line',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'bar',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            bar: {
              state: {
                hover: {
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
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ]
      }
    },
    {
      field: 'scatterChart',
      caption: 'vchart line',
      width: '320',
      columnType: 'chart',
      chartType: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'scatter',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type'
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ]
      }
    }
  ];
  const records = [
    {
      personid: 1,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 100,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 100,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.5434662648915386e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.1145475372279496
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.3272241776750226e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.46443514644351463
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 873,
          __CHARTSPACE_STACK_START: 100,
          __CHARTSPACE_STACK_START_PERCENT: 0.1145475372279496,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 896,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1673,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.46443514644351463,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 100,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 100,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 100,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 3.7007434154171887e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.16666666666666666
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 600,
          __CHARTSPACE_STACK_START: 100,
          __CHARTSPACE_STACK_START_PERCENT: 0.16666666666666666,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 100,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 2,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 200,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 200,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.2820617155707226e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.20554984583761562
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.252366638043042e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.43824027072758037
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 973,
          __CHARTSPACE_STACK_START: 200,
          __CHARTSPACE_STACK_START_PERCENT: 0.20554984583761562,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 996,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1773,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.43824027072758037,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 200,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 200,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 200,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 3.1720657846433044e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.2857142857142857
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 700,
          __CHARTSPACE_STACK_START: 200,
          __CHARTSPACE_STACK_START_PERCENT: 0.2857142857142857,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 200,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 3,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 300,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 300,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.0693812201773653e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.27958993476234856
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.185502428857615e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4148424986652429
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1073,
          __CHARTSPACE_STACK_START: 300,
          __CHARTSPACE_STACK_START_PERCENT: 0.27958993476234856,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1096,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1873,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.4148424986652429,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 300,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 300,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 300,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.7755575615628914e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.375
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 800,
          __CHARTSPACE_STACK_START: 300,
          __CHARTSPACE_STACK_START_PERCENT: 0.375,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 300,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 4,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 400,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 400,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.8929633838451092e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.3410059676044331
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.1254161425495758e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.3938165230613279
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1173,
          __CHARTSPACE_STACK_START: 400,
          __CHARTSPACE_STACK_START_PERCENT: 0.3410059676044331,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1196,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1973,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.3938165230613279,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 400,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 400,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 400,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.4671622769447923e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4444444444444444
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 900,
          __CHARTSPACE_STACK_START: 400,
          __CHARTSPACE_STACK_START_PERCENT: 0.4444444444444444,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 400,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 5,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 500,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.7442624110371667e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.3927729772191673
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.071126893029577e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.3748191027496382
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1273,
          __CHARTSPACE_STACK_START: 500,
          __CHARTSPACE_STACK_START_PERCENT: 0.3927729772191673,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1296,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 2073,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.3748191027496382,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 500,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.220446049250313e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1000,
          __CHARTSPACE_STACK_START: 500,
          __CHARTSPACE_STACK_START_PERCENT: 0.5,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 6,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 600,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 600,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6172221771670162e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.43699927166788055
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.0218343530834391e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.35757017947537967
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1373,
          __CHARTSPACE_STACK_START: 600,
          __CHARTSPACE_STACK_START_PERCENT: 0.43699927166788055,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1396,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 2173,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.35757017947537967,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 600,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 600,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 600,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 2.0185873175002846e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5454545454545454
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1100,
          __CHARTSPACE_STACK_START: 600,
          __CHARTSPACE_STACK_START_PERCENT: 0.5454545454545454,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 600,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 7,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 700,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 700,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5074311264428466e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47522063815342835
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 9.768790361857955e-20,
          __CHARTSPACE_STACK_END_PERCENT: 0.3418389793224813
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1473,
          __CHARTSPACE_STACK_START: 700,
          __CHARTSPACE_STACK_START_PERCENT: 0.47522063815342835,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1496,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 2273,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.3418389793224813,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 700,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 700,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 700,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.8503717077085944e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5833333333333334
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1200,
          __CHARTSPACE_STACK_START: 700,
          __CHARTSPACE_STACK_START_PERCENT: 0.5833333333333334,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 700,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 8,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 800,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 800,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5085823267641449
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 9.357126208387329e-20,
          __CHARTSPACE_STACK_END_PERCENT: 0.3274336283185841
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 800,
          __CHARTSPACE_STACK_START_PERCENT: 0.5085823267641449,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1596,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 2373,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.3274336283185841,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 800,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 800,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 800,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.7080354225002408e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.6153846153846154
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1300,
          __CHARTSPACE_STACK_START: 800,
          __CHARTSPACE_STACK_START_PERCENT: 0.6153846153846154,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 800,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 9,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 900,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 900,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.3272241776750226e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5379557680812911
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 8.978754748282705e-20,
          __CHARTSPACE_STACK_END_PERCENT: 0.3141932875050546
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1673,
          __CHARTSPACE_STACK_START: 900,
          __CHARTSPACE_STACK_START_PERCENT: 0.5379557680812911,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1696,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 2473,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.3141932875050546,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 900,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 900,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 900,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5860328923216522e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.6428571428571429
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1400,
          __CHARTSPACE_STACK_START: 900,
          __CHARTSPACE_STACK_START_PERCENT: 0.6428571428571429,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 900,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 10,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1000,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 1000,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.252366638043042e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5640157924421884
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 8.629794206180774e-20,
          __CHARTSPACE_STACK_END_PERCENT: 0.30198212203653324
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: '773',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1773,
          __CHARTSPACE_STACK_START: 1000,
          __CHARTSPACE_STACK_START_PERCENT: 0.5640157924421884,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: 1796,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 2573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.30198212203653324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1000,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1000,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0,
          __CHARTSPACE_STACK_END: 1000,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4802973661668753e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.6666666666666666
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1,
          __CHARTSPACE_STACK_END: 707,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4882346174599954e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.4738605898123324
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2,
          __CHARTSPACE_STACK_END: 832,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5135964889231855e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.567143830947512
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3,
          __CHARTSPACE_STACK_END: 726,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4427849572776562e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.47173489278752434
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4,
          __CHARTSPACE_STACK_END: 756,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5484282072875265e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5271966527196653
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5,
          __CHARTSPACE_STACK_END: 777,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4115995227274718e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.49396058486967576
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6,
          __CHARTSPACE_STACK_END: 689,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.65581360868778e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5137956748695004
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7,
          __CHARTSPACE_STACK_END: 795,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.5658998936885141e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5606488011283498
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8,
          __CHARTSPACE_STACK_END: 889,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.4437230489273817e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5780234070221066
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9,
          __CHARTSPACE_STACK_END: 757,
          __CHARTSPACE_STACK_START: 2.220446049250313e-16,
          __CHARTSPACE_STACK_START_PERCENT: 1.6008983772532898e-19,
          __CHARTSPACE_STACK_END_PERCENT: 0.5457822638788753
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10,
          __CHARTSPACE_STACK_END: 1500,
          __CHARTSPACE_STACK_START: 1000,
          __CHARTSPACE_STACK_START_PERCENT: 0.6666666666666666,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11,
          __CHARTSPACE_STACK_END: 1492,
          __CHARTSPACE_STACK_START: 707,
          __CHARTSPACE_STACK_START_PERCENT: 0.4738605898123324,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12,
          __CHARTSPACE_STACK_END: 1467,
          __CHARTSPACE_STACK_START: 832,
          __CHARTSPACE_STACK_START_PERCENT: 0.567143830947512,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13,
          __CHARTSPACE_STACK_END: 1539,
          __CHARTSPACE_STACK_START: 726,
          __CHARTSPACE_STACK_START_PERCENT: 0.47173489278752434,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14,
          __CHARTSPACE_STACK_END: 1434,
          __CHARTSPACE_STACK_START: 756,
          __CHARTSPACE_STACK_START_PERCENT: 0.5271966527196653,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15,
          __CHARTSPACE_STACK_END: 1573,
          __CHARTSPACE_STACK_START: 777,
          __CHARTSPACE_STACK_START_PERCENT: 0.49396058486967576,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16,
          __CHARTSPACE_STACK_END: 1341,
          __CHARTSPACE_STACK_START: 689,
          __CHARTSPACE_STACK_START_PERCENT: 0.5137956748695004,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17,
          __CHARTSPACE_STACK_END: 1418,
          __CHARTSPACE_STACK_START: 795,
          __CHARTSPACE_STACK_START_PERCENT: 0.5606488011283498,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18,
          __CHARTSPACE_STACK_END: 1538,
          __CHARTSPACE_STACK_START: 889,
          __CHARTSPACE_STACK_START_PERCENT: 0.5780234070221066,
          __CHARTSPACE_STACK_END_PERCENT: 1
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19,
          __CHARTSPACE_STACK_END: 1387,
          __CHARTSPACE_STACK_START: 757,
          __CHARTSPACE_STACK_START_PERCENT: 0.5457822638788753,
          __CHARTSPACE_STACK_END_PERCENT: 1
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1000,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 0
        },
        {
          x: '1',
          type: 'A',
          y: '707',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 1
        },
        {
          x: '2',
          type: 'A',
          y: '832',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 2
        },
        {
          x: '3',
          type: 'A',
          y: '726',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 3
        },
        {
          x: '4',
          type: 'A',
          y: '756',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 4
        },
        {
          x: '5',
          type: 'A',
          y: '777',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 5
        },
        {
          x: '6',
          type: 'A',
          y: '689',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 6
        },
        {
          x: '7',
          type: 'A',
          y: '795',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 7
        },
        {
          x: '8',
          type: 'A',
          y: '889',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 8
        },
        {
          x: '9',
          type: 'A',
          y: '757',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 9
        },
        {
          x: '0',
          type: 'B',
          y: 500,
          __CHARTSPACE_DEFAULT_DATA_INDEX: 10
        },
        {
          x: '1',
          type: 'B',
          y: '785',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 11
        },
        {
          x: '2',
          type: 'B',
          y: '635',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 12
        },
        {
          x: '3',
          type: 'B',
          y: '813',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 13
        },
        {
          x: '4',
          type: 'B',
          y: '678',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 14
        },
        {
          x: '5',
          type: 'B',
          y: '796',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 15
        },
        {
          x: '6',
          type: 'B',
          y: '652',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 16
        },
        {
          x: '7',
          type: 'B',
          y: '623',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 17
        },
        {
          x: '8',
          type: 'B',
          y: '649',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 18
        },
        {
          x: '9',
          type: 'B',
          y: '630',
          __CHARTSPACE_DEFAULT_DATA_INDEX: 19
        }
      ]
    },
    {
      personid: 11,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 1896
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 12,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 1996
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 13,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2096
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 14,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2196
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 15,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2296
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 16,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2396
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 17,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2496
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 18,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2596
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 19,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 1900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2696
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 1900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 1900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 1900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 20,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2796
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 21,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2896
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 22,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 2996
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 23,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3096
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 24,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3196
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 25,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3296
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 26,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3396
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 27,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3496
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 28,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3596
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 29,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 2900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3696
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 2900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 2900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 2900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 30,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3796
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 31,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3896
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3100
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 32,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 3996
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3200
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 33,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4096
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3300
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 34,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4196
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3400
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 35,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4296
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3500
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 36,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4396
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3600
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 37,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4496
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3700
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 38,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4596
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3800
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 39,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 3900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4696
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 3900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 3900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 3900
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    },
    {
      personid: 40,
      fname: 'total',
      lname: 'total',
      birthday: '',
      email: 'total@example.com',
      stars: 0,
      progress: 0,
      total: true,
      areaChart: [
        {
          x: '0',
          type: 'A',
          y: 4000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: '773'
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: 4796
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      lineChart: [
        {
          x: '0',
          type: 'A',
          y: 4000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      barChart: [
        {
          x: '0',
          type: 'A',
          y: 4000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ],
      scatterChart: [
        {
          x: '0',
          type: 'A',
          y: 4000
        },
        {
          x: '1',
          type: 'A',
          y: '707'
        },
        {
          x: '2',
          type: 'A',
          y: '832'
        },
        {
          x: '3',
          type: 'A',
          y: '726'
        },
        {
          x: '4',
          type: 'A',
          y: '756'
        },
        {
          x: '5',
          type: 'A',
          y: '777'
        },
        {
          x: '6',
          type: 'A',
          y: '689'
        },
        {
          x: '7',
          type: 'A',
          y: '795'
        },
        {
          x: '8',
          type: 'A',
          y: '889'
        },
        {
          x: '9',
          type: 'A',
          y: '757'
        },
        {
          x: '0',
          type: 'B',
          y: 500
        },
        {
          x: '1',
          type: 'B',
          y: '785'
        },
        {
          x: '2',
          type: 'B',
          y: '635'
        },
        {
          x: '3',
          type: 'B',
          y: '813'
        },
        {
          x: '4',
          type: 'B',
          y: '678'
        },
        {
          x: '5',
          type: 'B',
          y: '796'
        },
        {
          x: '6',
          type: 'B',
          y: '652'
        },
        {
          x: '7',
          type: 'B',
          y: '623'
        },
        {
          x: '8',
          type: 'B',
          y: '649'
        },
        {
          x: '9',
          type: 'B',
          y: '630'
        }
      ]
    }
  ];
  const option = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    records,
    columns,
    transpose: false,
    defaultColWidth: 200,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50
  };

  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;
}
