---
category: examples
group: table-type
title: Pivot Chart (Heatmap)
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-chart-heatmap.png
link: table_type/pivot_chart
option: PivotChart-indicators-chart#cellType
---

# Pivot Chart (Heatmap)

Pivot Chart (Heatmap) combines the vchart chart library to render into the table, enriching the visual display form and improving the rendering performance.

## Key Configurations

- `PivotChart` Initialize the table type using PivotChart.
- `VTable.register.chartModule('vchart', VChart)` Register the chart library for drawing charts, currently supports VChart
- `cellType: 'chart'` Specify the type chart
- `chartModule: 'vchart'` Specify the registered chart library name
- `chartSpec: {}` Chart spec

## Code demo

```javascript livedemo template=vtable
VTable.register.chartModule('vchart', VChart);
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const columns= [
    {
      dimensionKey: 'Region',
      title: 'Region',
      headerStyle: {
        color: 'red',
        textAlign: 'center'
      }
    },
    {
      dimensionKey: 'Category',
      title: 'Category',
      headerStyle: {
        color: 'red',
        borderLineWidth: [0, 0, 1, 1]
      }
    }
  ];
  const rows = [
    {
      dimensionKey: 'Segment',
      title: 'Segment',
      headerStyle: {
        color: 'red',
        borderLineWidth: [1, 0, 1, 0],
        autoWrapText: true,
        textStick: true
      }
    }
  ];
  const indicators = [
    {
      indicatorKey: 'Profit',
      title: '利润',
      cellType: 'chart',
      chartModule: 'vchart',
      headerStyle: {
        color: 'red',
        borderLineWidth: [1, 0, 1, 0],
        autoWrapText: true
      },
      style: {
        padding: 1
      },
      chartSpec: {
        type: 'heatmap',
        data: { id: 'data1' },
        xField: 'Order Year',
        yField: 'Ship Mode',
        valueField: 'Profit',
        barWidth: 50,
        cell: {
          style: {
            fill: {
              field: 'Profit',
              scale: 'color'
            }
          }
        },
        color: {
          type: 'linear',
          domain: [0, 3000],
          range: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603']
        }
      }
    }
  ];

  const theme = {
    bodyStyle: {
      borderColor: 'gray',
      borderLineWidth: [1, 0, 0, 1]
    },
    headerStyle: {
      borderColor: 'red',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 0, 1],
      hover: {
        cellBgColor: '#CCE0FF'
      }
    },
    rowHeaderStyle: {
      borderColor: 'red',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 1, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerHeaderStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 1, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerRightTopCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 1, 1],
      hover: {
        cellBgColor: ''
      }
    },
    cornerLeftBottomCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 1, 0, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerRightBottomCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 0, 1],
      hover: {
        cellBgColor: ''
      }
    },
    rightFrozenStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 1, 1],
      hover: {
        cellBgColor: ''
      }
    },
    bottomFrozenStyle: {
      borderColor: 'gray',
      borderLineWidth: [1, 1, 0, 1],
      hover: {
        cellBgColor: ''
      }
    },
    selectionStyle: {
      cellBgColor: '',
      cellBorderColor: ''
    },
    frameStyle: {
      borderLineWidth: 0
    },
    underlayBackgroundColor: '#ddd'
  };
  const option = {
    rows,
    columns,
    indicators,
    indicatorsAsCol: false,
    records:data,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 'auto'],
    widthMode: 'autoWidth',
    heightMode: 'autoHeight',
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        autoWrapText: true,
        padding: 0
      }
    },
    legends: {
      orient: 'top',
      position: 'start',
      type: 'color',
      colors: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
      value: [0, 3000],
      max: 3000,
      min: 0
    },
    axes: [
      {
        orient: 'bottom',
        type: 'band',
        grid: {
          visible: false
        },
        domainLine: {
          visible: false
        },
        label: {
          space: 10,
          style: {
            textAlign: 'left',
            textBaseline: 'middle',
            angle: 90,
            fontSize: 8
          }
        },
        bandPadding: 0
      },
      {
        orient: 'left',
        type: 'band',
        grid: {
          visible: false
        },
        domainLine: {
          visible: false
        },
        label: {
          space: 10,
          style: {
            fontSize: 8
          }
        },
        bandPadding: 0
      }
    ]
  };

  tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  const { LEGEND_CHANGE } = VTable.ListTable.EVENT_TYPE;
  tableInstance.on(LEGEND_CHANGE, args => {
    console.log('LEGEND_CHANGE', args);
    const maxValue = args.value[1];
    const minValue = args.value[0];
    tableInstance.updateFilterRules([
      {
        filterFunc: (record) => {
          console.log('updateFilterRules', record);
          if (record['Profit'] >= minValue && record['Profit'] <= maxValue) {
            return true;
          }
          return false;
        }
      }
    ]);
  });
  window.tableInstance = tableInstance;
})
```
