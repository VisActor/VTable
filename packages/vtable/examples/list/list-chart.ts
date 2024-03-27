/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
VTable.register.chartModule('vchart', VChart);
const CONTAINER_ID = 'vTable';
export function createTable() {
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'id',
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
      title: 'multiple vchart type',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec(args) {
        if (args.row % 3 == 2)
          return {
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
          };
        else if (args.row % 3 == 1)
          return {
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
          };
        return {
          type: 'pie',
          data: { id: 'data1' },
          categoryField: 'y',
          valueField: 'x'
        };
      }
    },
    {
      field: 'lineChart',
      title: 'vchart line',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
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
      title: 'vchart bar',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
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
      title: 'vchart scatter',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
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
      title: 'vchart area',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
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
    }
  ];
  const records: any[] = []; // = generatePersonsDataSource(10);
  for (let i = 1; i <= 10; i++)
    records.push({
      id: i,
      areaChart: [
        { x: '0', type: 'A', y: 100 * i },
        { x: '1', type: 'A', y: '707' },
        { x: '2', type: 'A', y: '832' },
        { x: '3', type: 'A', y: '726' },
        { x: '4', type: 'A', y: '756' },
        { x: '5', type: 'A', y: '777' },
        { x: '6', type: 'A', y: '689' },
        { x: '7', type: 'A', y: '795' },
        { x: '8', type: 'A', y: '889' },
        { x: '9', type: 'A', y: '757' },
        { x: '0', type: 'B', y: '773' },
        { x: '1', type: 'B', y: '785' },
        { x: '2', type: 'B', y: '635' },
        { x: '3', type: 'B', y: '813' },
        { x: '4', type: 'B', y: '678' },
        { x: '5', type: 'B', y: 796 + 100 * i },
        { x: '6', type: 'B', y: '652' },
        { x: '7', type: 'B', y: '623' },
        { x: '8', type: 'B', y: '649' },
        { x: '9', type: 'B', y: '630' }
      ],
      lineChart: [
        { x: '0', type: 'A', y: 100 * i },
        { x: '1', type: 'A', y: '707' },
        { x: '2', type: 'A', y: '832' },
        { x: '3', type: 'A', y: '726' },
        { x: '4', type: 'A', y: '756' },
        { x: '5', type: 'A', y: '777' },
        { x: '6', type: 'A', y: '689' },
        { x: '7', type: 'A', y: '795' },
        { x: '8', type: 'A', y: '889' },
        { x: '9', type: 'A', y: '757' },
        { x: '0', type: 'B', y: 500 },
        { x: '1', type: 'B', y: '785' },
        { x: '2', type: 'B', y: '635' },
        { x: '3', type: 'B', y: '813' },
        { x: '4', type: 'B', y: '678' },
        { x: '5', type: 'B', y: '796' },
        { x: '6', type: 'B', y: '652' },
        { x: '7', type: 'B', y: '623' },
        { x: '8', type: 'B', y: '649' },
        { x: '9', type: 'B', y: '630' }
      ],
      barChart: [
        { x: '0', type: 'A', y: 100 * i },
        { x: '1', type: 'A', y: '707' },
        { x: '2', type: 'A', y: '832' },
        { x: '3', type: 'A', y: '726' },
        { x: '4', type: 'A', y: '756' },
        { x: '5', type: 'A', y: '777' },
        { x: '6', type: 'A', y: '689' },
        { x: '7', type: 'A', y: '795' },
        { x: '8', type: 'A', y: '889' },
        { x: '9', type: 'A', y: '757' },
        { x: '0', type: 'B', y: 500 },
        { x: '1', type: 'B', y: '785' },
        { x: '2', type: 'B', y: '635' },
        { x: '3', type: 'B', y: '813' },
        { x: '4', type: 'B', y: '678' },
        { x: '5', type: 'B', y: '796' },
        { x: '6', type: 'B', y: '652' },
        { x: '7', type: 'B', y: '623' },
        { x: '8', type: 'B', y: '649' },
        { x: '9', type: 'B', y: '630' }
      ],
      scatterChart: [
        { x: '0', type: 'A', y: 100 * i },
        { x: '1', type: 'A', y: '707' },
        { x: '2', type: 'A', y: '832' },
        { x: '3', type: 'A', y: '726' },
        { x: '4', type: 'A', y: '756' },
        { x: '5', type: 'A', y: '777' },
        { x: '6', type: 'A', y: '689' },
        { x: '7', type: 'A', y: '795' },
        { x: '8', type: 'A', y: '889' },
        { x: '9', type: 'A', y: '757' },
        { x: '0', type: 'B', y: 500 },
        { x: '1', type: 'B', y: '785' },
        { x: '2', type: 'B', y: '635' },
        { x: '3', type: 'B', y: '813' },
        { x: '4', type: 'B', y: '678' },
        { x: '5', type: 'B', y: '796' },
        { x: '6', type: 'B', y: '652' },
        { x: '7', type: 'B', y: '623' },
        { x: '8', type: 'B', y: '649' },
        { x: '9', type: 'B', y: '630' }
      ]
    });
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    transpose: false,
    defaultColWidth: 200,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50
  };

  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
  tableInstance.onVChartEvent('click', args => {
    console.log('onVChartEvent click', args);
  });
  tableInstance.onVChartEvent('mouseover', args => {
    console.log('onVChartEvent mouseover', args);
  });
}
