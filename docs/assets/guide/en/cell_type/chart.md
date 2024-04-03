# Cell display chart

In the previous article, we introduced how to display minigraphs in cells. Minigraphs can do simple trend analysis and style configuration. If you want to apply the more powerful chart VChart to tables, please take a look at this tutorial.

## Inject Chart Components

Before using it, you need to inject the used chart library components:

    import VChart from '@visactor/vchart';
    VTable.register.chartModule('vchart', VChart);

About why you need to configure a name to register VChart`'vchart'`? We have plans to access other chart libraries.

## Related configuration

Table display type`cellType`Set to`chart`Used to generate charts.

*   cellType: 'chart'//chart chart type
*   chartModule: 'vchart'//vchart is the name configured during registration
*   Chart Spec :{ } // chart configuration item, support funciton define

Where the chartSpec configuration item corresponds[VChart configuration](https://visactor.io/vchart/option)

## Chart chart data

Chart The chart data comes from the records set to the table. If it is basic table data, it can be set as follows:

```javascript
[
    {
        "personid": 1,
        "areaChart": [{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 120},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 111}],
        "scatterChart": [{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 120},{"x": "0","type": "A","y": 130}]]
    },
    {
        "personid": 2,
        "areaChart": [{"x": "0","type": "A","y": 120},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 120},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 111}{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 130}],
        "scatterChart": [{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 120},{"x": "0","type": "A","y": 130},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 111}{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 100},{"x": "0","type": "A","y": 100}]
    }
]
```

There are three fields in our records: persionid, areaChart, scatterChart, where areaChart and scatterChart are the two data that need to be provided for chart use.

## example

We use the above data to display different chart effects with different specs:

```javascript livedemo template=vtable
VTable.register.chartModule('vchart', VChart);
const records = [
    {
        "personid": 1,
        "areaChart": [{"x": "0","type": "A","y": 100},{"x": "1","type": "A","y": 130},{"x": "2","type": "A","y": 120},{"x": "3","type": "A","y": 130},{"x": "4","type": "A","y": 100},{"x": "5","type": "A","y": 111}],
        "scatterChart": [{"x": "1","type": "A","y": 100},{"x": "2","type": "A","y": 100},{"x": "3","type": "A","y": 130},{"x": "4","type": "A","y": 130},{"x": "5","type": "A","y": 120},{"x": "6","type": "A","y": 130}]
    },
    {
        "personid": 2,
        "areaChart": [{"x": "0","type": "A","y": 120},{"x": "1","type": "A","y": 130},{"x": "2","type": "A","y": 120},{"x": "3","type": "A","y": 130},{"x": "4","type": "A","y": 100},{"x": "5","type": "A","y": 111},{"x": "6","type": "A","y": 100},{"x": "7","type": "A","y": 100},{"x": "8","type": "A","y": 130}],
        "scatterChart": [{"x": "0","type": "A","y": 100},{"x": "1","type": "A","y": 130},{"x": "2","type": "A","y": 120},{"x": "3","type": "A","y": 130},{"x": "4","type": "A","y": 100},{"x": "5","type": "A","y": 111},{"x": "6","type": "A","y": 100},{"x": "7","type": "A","y": 100},{"x": "8","type": "A","y": 100},{"x": "9","type": "A","y": 100}]
    }
];

const columns =[
    {
      field: 'personid',
      title: 'personid',
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
      title: 'vchart area',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
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
      }
    },
    {
      field: 'areaChart',
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
      }
    },
    {
      field: 'areaChart',
      title: 'vchart line',
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
      title: 'vchart line',
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
       
      }
    },
    {
      field: 'areaChart',
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
       
      }
    },
    {
      field: 'areaChart',
      title: 'vchart line',
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
      title: 'vchart line',
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
    }
  ];
const option = {
  records,
  columns,
  defaultColWidth: 200,
  defaultRowHeight: 200,
  defaultHeaderRowHeight: 50,
  autoWrapText:true,
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

```

Through the above introduction and examples, we can quickly create and configure the table display type sparkline miniature in VTable. Although only line graphs are currently supported, with subsequent development, the functions and types of minigraphs will become more and more perfect, providing more convenient and practical functions for data lake visualization.
