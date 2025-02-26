---
category: examples
group: Business
title: Trend table
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/trend.png
order: 9-4
---

# Trend table

This example analyzes sales data at different time granularities and month-on-month ratios, and uses a mini-line chart to show product sales trends from 2020-2021.

## Key Configurations

- `indicators[x].icon` Display different icons based on sales value to indicate rise and fall

- `indicators[x].cellType` Set to sparkline to display miniatures

## Code demo

```javascript livedemo template=vtable
function generateLineData1(count) {
  const lineData = [];
  for (let i = 0; i < count; i++) {
    lineData.push({ x: i, y: Math.floor(Math.random() * 500) });
  }
  return lineData;
}

const option = {
  rowTree: [
    {
      dimensionKey: 'order_data',
      value: 'Order Number'
    },
    {
      dimensionKey: 'order_data',
      value: 'Profit Amount'
    },
    {
      dimensionKey: 'order_data',
      value: 'Sales Amount'
    },
    {
      dimensionKey: 'order_data',
      value: 'Transportation Cost'
    }
  ],
  columnTree: [
    {
      dimensionKey: 'time',
      value: '2020',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2021',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2020Q1',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2020Q2',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2020Q3',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2020Q4',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2021Q1',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2021Q2',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2021Q3',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: '2021Q4',
      children: [
        {
          indicatorKey: 'data'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      value: 'line',
      children: [
        {
          indicatorKey: 'lineData',
          value: 'Trend '
        }
      ]
    }
  ],
  rows: [
    {
      dimensionKey: 'order_data',
      title: 'Order Data',
      headerStyle: {
        textStick: true
      },
      width: '100',
      showSort: false
    }
  ],
  columns: [
    {
      dimensionKey: 'time',
      title: 'Quarter',
      width: '200',
      showSort: false,
      headerStyle: {
        textAlign: 'center',
        borderLineWidth: args => {
          const { col, row } = args;
          const cellHeaderPaths = args.table.getCellHeaderPaths(args.col, args.row);
          if (
            cellHeaderPaths.colHeaderPaths[0].value === '2020Q1' ||
            cellHeaderPaths.colHeaderPaths[0].value === '2021Q1' ||
            cellHeaderPaths.colHeaderPaths[0].value === 'line'
          )
            return [0, 0, 0, 1];
          return [0, 0, 0, 0];
        }
      }
    },
    {
      dimensionKey: 'year',
      title: 'Year',
      width: '200',
      showSort: false,
      headerStyle: {
        textAlign: 'center'
      }
    }
  ],
  indicators: [
    {
      indicatorKey: 'data',
      value: 'Data',
      width: 'auto',
      style: {
        textAlign: 'right',
        borderLineWidth: args => {
          const cellHeaderPaths = args.table.getCellHeaderPaths(args.col, args.row);
          if (
            cellHeaderPaths.colHeaderPaths[0].value === '2020Q1' ||
            cellHeaderPaths.colHeaderPaths[0].value === '2021Q1'
          )
            return [0, 0, 0, 1];
          return [0, 0, 0, 0];
        },
        padding: [8, 5, 8, 20]
      }
    },
    {
      indicatorKey: 'ratio',
      title: '环比',
      width: 'auto',
      format: value => {
        if (value) return value * 100 + '%';
        return '-';
      },
      icon: args => {
        const { dataValue } = args;
        if (dataValue > 0) {
          return {
            type: 'svg',
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/up-arrow.svg',
            width: 12,
            height: 12,
            name: 'up-green',
            positionType: VTable.TYPES.IconPosition.inlineEnd
          };
        } else if (dataValue < 0)
          return {
            type: 'svg',
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/down-arrow.svg',
            width: 14,
            height: 14,
            name: 'down-red',
            positionType: VTable.TYPES.IconPosition.inlineEnd
          };
        return '';
      },
      style: {
        textAlign: 'left',
        borderLineWidth: [0, 0, 0, 0],
        padding: [8, 20, 8, 5],
        color: args => {
          const { dataValue } = args;
          if (dataValue > 0) return 'green';
          return 'red';
        }
      }
    },
    {
      indicatorKey: 'lineData',
      title: 'Trend ',
      width: '300',
      cellType: 'sparkline',
      sparklineSpec: {
        type: 'line',
        xField: 'x',
        yField: 'y',
        pointShowRule: 'none',
        smooth: true,
        line: {
          style: {
            stroke: '#2E62F1',
            strokeWidth: 2
            // interpolate: 'monotone',
          }
        },
        point: {
          hover: {
            stroke: 'blue',
            strokeWidth: 1,
            fill: 'red',
            shape: 'circle',
            size: 4
          },
          style: {
            stroke: 'red',
            strokeWidth: 1,
            fill: 'yellow',
            shape: 'circle',
            size: 2
          }
        },
        crosshair: {
          style: {
            stroke: 'gray',
            strokeWidth: 1
          }
        }
      },
      style: {
        textAlign: 'left',
        borderLineWidth: [0, 1, 0, 1],
        padding: [8, 0, 8, 5]
      }
    }
  ],
  corner: {
    titleOnDimension: 'none',
    headerStyle: {
      color: 'red'
    }
  },
  showColumnHeader: true,
  showRowHeader: true,
  hideIndicatorName: true,
  records: [
    {
      order_data: 'Order Number',
      time: '2020',
      data: 12304,
      ratio: 0.11
    },
    {
      order_data: 'Profit Amount',
      time: '2020',
      data: 102504,
      ratio: 0.11
    },
    {
      order_data: 'Sales Amount',
      time: '2020',
      data: 202504,
      ratio: 0.11
    },
    {
      order_data: 'transportation Cost',
      time: '2020',
      data: 6504,
      ratio: 0.11
    },
    {
      order_data: 'Order Number',
      time: '2021',
      data: 19304,
      ratio: -0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2021',
      data: 302504,
      ratio: -0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2020',
      data: 302504,
      ratio: 0.11
    },
    {
      order_data: 'Transportation Cost',
      time: '2021',
      data: 9504,
      ratio: -0.12
    },
    {
      order_data: 'Order Number',
      time: '2020Q1',
      data: 2304
      // "ratio":0.12
    },
    {
      order_data: 'Order Number',
      time: '2020Q2',
      data: 2504,
      ratio: 0.12
    },
    {
      order_data: 'Order Number',
      time: '2020Q3',
      data: 2904,
      ratio: 0.12
    },
    {
      order_data: 'Order Number',
      time: '2020Q4',
      data: 2704,
      ratio: -0.08
    },
    {
      order_data: 'Order Number',
      time: '2021Q1',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Order Number',
      time: '2021Q2',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Order Number',
      time: '2021Q3',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Order Number',
      time: '2021Q4',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2020Q1',
      data: 2304
      // "ratio":0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2020Q2',
      data: 2504,
      ratio: 0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2020Q3',
      data: 2904,
      ratio: 0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2020Q4',
      data: 2704,
      ratio: -0.08
    },
    {
      order_data: 'Profit Amount',
      time: '2021Q1',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2021Q2',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2021Q3',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Profit Amount',
      time: '2021Q4',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2020Q1',
      data: 2304
      // "ratio":0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2020Q2',
      data: 2504,
      ratio: 0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2020Q3',
      data: 2904,
      ratio: 0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2020Q4',
      data: 2704,
      ratio: -0.08
    },
    {
      order_data: 'Sales Amount',
      time: '2021Q1',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2021Q2',
      data: 5304,
      ratio: 0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2021Q3',
      data: 3304,
      ratio: 0.12
    },
    {
      order_data: 'Sales Amount',
      time: '2021Q4',
      data: 3304,
      ratio: 0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2020Q1',
      data: 2304
      // "ratio":0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2020Q2',
      data: 2504,
      ratio: 0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2020Q3',
      data: 2904,
      ratio: 0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2020Q4',
      data: 2704,
      ratio: -0.08
    },
    {
      order_data: 'Transportation Cost',
      time: '2021Q1',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2021Q2',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2021Q3',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Transportation Cost',
      time: '2021Q4',
      data: 2304,
      ratio: 0.12
    },
    {
      order_data: 'Order Number',
      time: 'line',
      lineData: generateLineData1(30)
    },
    {
      order_data: 'Profit Amount',
      time: 'line',
      lineData: generateLineData1(30)
    },
    {
      order_data: 'Sales Amount',
      time: 'line',
      lineData: generateLineData1(30)
    },
    {
      order_data: 'Transportation Cost',
      time: 'line',
      lineData: generateLineData1(30)
    }
  ],
  theme: {
    headerStyle: {
      frameStyle: {
        borderColor: 'green',
        borderLineWidth: [0, 0, 2, 0]
      },
      borderLineWidth: [0, 1, 0, 1]
    },
    rowHeaderStyle: {
      borderLineWidth: 0,
      frameStyle: {
        borderColor: 'red',
        borderLineWidth: [0, 2, 0, 0]
      }
    },
    cornerHeaderStyle: {
      frameStyle: {
        borderColor: [null, 'red', 'green', null],
        borderLineWidth: [0, 2, 2, 0]
      },
      borderColor: [null, null, null, null]
    }
  },
  defaultColWidth: 200,
  resize: {
    columnResizeType: 'indicatorGroup'
  }
};
const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## Related Tutorials

[performance optimization](link)
