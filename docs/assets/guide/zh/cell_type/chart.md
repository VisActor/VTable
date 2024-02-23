# 单元格显示图表

上一篇文章我们介绍了如何在单元格中显示迷你图，迷你图可以做简单的趋势分析和样式配置，如果想要将功能更强大的图表VChart在表格中应用，请看这篇教程。

## 注入图表组件

在使用之前需要先注入使用的图表库组件：
```
import VChart from '@visactor/vchart';
VTable.register.chartModule('vchart', VChart);
```
关于为什么注册VChart需要配置个名称`'vchart'`？我们是有打算接入其他图表库的计划的哈。

## 相关配置

表格展示类型`cellType`设置成`chart`用于生成图表。
- cellType: 'chart' //chart图表类型
- chartModule: 'vchart' // vchart是注册时配置的名称
- chartSpec:{ }  //chart配置项 支持函数形式返回spec

其中chartSpec配置项对应[VChart配置](https://visactor.io/vchart/option)

## chart图表数据

chart图表数据来源于设置到table的records，如果是基本表格数据可设置如下：
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
我们的records中有三个字段：persionid，areaChart，scatterChart，其中areaChart和scatterChart是两个需要提供给chart使用的数据。

## 示例
我们利用如上数据使用不同的spec展示不同的图表效果：

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

通过以上介绍和示例，我们可以在VTable中快速创建并配置表格展示类型sparkline迷你图。虽然目前仅支持折线图，但随着后续的开发，迷你图的功能和类型将愈发完善，为数据可视化提供更多便捷实用的功能。