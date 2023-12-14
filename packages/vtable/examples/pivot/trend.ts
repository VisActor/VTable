import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

function generateLineData1(count) {
  // const count = Math.floor(Math.random() * 50);
  // const count = 5;
  const nums = [300, 544, 321, 556, 32, 45, 665, 32, 65, 66, 570, 100, 200, 100, 400];
  const lineData: any[] = [];
  for (let i = 0; i < count; i++) {
    lineData.push({ x: i, y: nums[i % nums.length] });
  }
  return lineData;
}

export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    theme: {
      headerStyle: {
        frameStyle: {
          borderColor: 'green',
          borderLineWidth: [0, 0, 2, 0]
        }
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
        }
      }
    },
    rowTree: [
      {
        dimensionKey: 'order_data',
        value: '订单数量'
      },
      {
        dimensionKey: 'order_data',
        value: '利润金额'
      },
      {
        dimensionKey: 'order_data',
        value: '运输成本'
      }
    ],
    columnTree: [
      {
        dimensionKey: 'time',
        value: '2020',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2021',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2020Q1',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2020Q2',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2020Q3',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2020Q4',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2021Q1',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2021Q2',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2021Q3',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: '2021Q4',
        children: [
          {
            indicatorKey: 'data',
            value: '数值'
          },
          {
            indicatorKey: 'ratio',
            value: '环比'
          }
        ]
      },
      {
        dimensionKey: 'time',
        value: 'line',
        children: [
          {
            indicatorKey: 'lineData',
            value: '趋势图'
          }
        ]
      }
    ],
    columns: [
      {
        dimensionKey: 'time',
        title: '季度',
        width: '200',
        showSort: false,
        headerStyle: {
          textAlign: 'center',
          borderLineWidth: [0, 0, 0, 1]
        }
      },
      {
        dimensionKey: 'year',
        title: '年度',
        width: '200',
        showSort: false,
        headerStyle: {
          textAlign: 'center'
        }
      },
      {
        dimensionKey: '指标名称',
        title: '指标名称',
        width: '200',
        headerStyle: {
          textAlign: 'right'
        }
      }
    ],
    rows: [
      {
        dimensionKey: 'order_data',
        title: '订单数据',
        width: '100',
        showSort: false
      }
    ],
    indicators: [
      {
        indicatorKey: 'data',
        title: '数据',
        width: 'auto',
        style: {
          textAlign: 'right',
          borderLineWidth: [0, 0, 0, 1],
          padding: [8, 5, 8, 20]
        }
      },
      {
        indicatorKey: 'ratio',
        title: '环比',
        width: 'auto',
        format: value => {
          if (value) {
            return value * 100 + '%';
          }
          return '-';
        },
        style: {
          textAlign: 'left',
          borderLineWidth: [0, 1, 0, 0],
          padding: [8, 20, 8, 5],
          color: args => {
            const { dataValue } = args;
            if (Number(dataValue) > 0) {
              return 'green';
            }
            return 'red';
          }
        },
        icon: args => {
          const { dataValue } = args;
          if (dataValue > 0) {
            return {
              type: 'svg',
              svg: '<svg width="12" height="12"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="rgb(0, 170, 0)"><path d="M503.146667 117.429333a64.373333 64.373333 0 0 1 11.029333 0.341334l0.714667 0.085333 1.749333 0.245333 0.682667 0.117334c0.554667 0.085333 1.088 0.192 1.632 0.288l0.853333 0.181333c1.514667 0.32 2.986667 0.682667 4.458667 1.098667l0.202666 0.064a60.618667 60.618667 0 0 1 10.656 4.138666l0.64 0.330667c0.512 0.256 1.024 0.522667 1.525334 0.8l0.704 0.394667 1.493333 0.853333 0.426667 0.266667a47.466667 47.466667 0 0 1 3.36 2.186666 82.24 82.24 0 0 1 3.989333 3.04l0.512 0.416c1.173333 0.992 2.314667 2.016 3.413333 3.082667l0.298667 0.288 282.666667 277.333333a64 64 0 1 1-89.642667 91.370667L570.666667 333.792v539.392a64 64 0 0 1-61.6 63.957333l-2.4 0.042667a64 64 0 0 1-64-64v-539.413333L268.821333 504.352a64 64 0 0 1-88.565333 1.024l-1.941333-1.888a64 64 0 0 1 0.864-90.506667l282.666666-277.333333a65.301333 65.301333 0 0 1 11.573334-9.013333l0.437333-0.266667a50.24 50.24 0 0 1 1.482667-0.853333l0.704-0.394667c0.501333-0.277333 1.013333-0.544 1.514666-0.8l0.650667-0.32a52.949333 52.949333 0 0 1 2.784-1.312 63.765333 63.765333 0 0 1 7.872-2.848l0.213333-0.053333c1.450667-0.426667 2.933333-0.789333 4.437334-1.098667l0.864-0.170667c0.533333-0.106667 1.077333-0.213333 1.621333-0.298666l0.704-0.106667c0.576-0.106667 1.152-0.181333 1.738667-0.256l0.714666-0.085333c0.906667-0.106667 1.813333-0.192 2.730667-0.266667z"></path></svg>',
              width: 12,
              height: 12,
              name: 'up-green111',
              positionType: VTable.TYPES.IconPosition.inlineEnd
            };
          } else if (dataValue < 0) {
            return {
              type: 'svg',
              svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1671454470494" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="2794" width="200" height="200"><path d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z" fill="#FD3333" p-id="2795"/></svg>',
              width: 14,
              height: 14,
              name: 'down-red',
              positionType: VTable.TYPES.IconPosition.inlineEnd
            };
          }
          return '';
        }
      },
      {
        indicatorKey: 'lineData',
        title: '趋势图',
        width: 300,
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
          padding: 1
        }
      }
    ],
    corner: {
      titleOnDimension: 'none',
      headerStyle: {
        borderLineWidth: 0
      }
    },
    hideIndicatorName: true,
    showColumnHeader: true,
    showRowHeader: true,
    indicatorTitle: '指标名称',
    records: [
      {
        order_data: '订单数量',
        time: '2020',
        data: 12304,
        ratio: 0.11
      },
      {
        order_data: '利润金额',
        time: '2020',
        data: 102504,
        ratio: 0.11
      },
      {
        order_data: '运输成本',
        time: '2020',
        data: 6504,
        ratio: 0.11
      },
      {
        order_data: '订单数量',
        time: '2021',
        data: 19304,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2021',
        data: 302504,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2021',
        data: 9504,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: '2020Q1',
        data: 2304
        // "ratio":0.12
      },
      {
        order_data: '订单数量',
        time: '2020Q2',
        data: 2504,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: '2020Q3',
        data: 2904,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: '2020Q4',
        data: 2704,
        ratio: -0.08
      },
      {
        order_data: '订单数量',
        time: '2021Q1',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: '2021Q2',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: '2021Q3',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: '2021Q4',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2020Q1',
        data: 2304
        // "ratio":0.12
      },
      {
        order_data: '利润金额',
        time: '2020Q2',
        data: 2504,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2020Q3',
        data: 2904,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2020Q4',
        data: 2704,
        ratio: -0.08
      },
      {
        order_data: '利润金额',
        time: '2021Q1',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2021Q2',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2021Q3',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '利润金额',
        time: '2021Q4',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2020Q1',
        data: 2304
        // "ratio":0.12
      },
      {
        order_data: '运输成本',
        time: '2020Q2',
        data: 2504,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2020Q3',
        data: 2904,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2020Q4',
        data: 2704,
        ratio: -0.08
      },
      {
        order_data: '运输成本',
        time: '2021Q1',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2021Q2',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2021Q3',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '运输成本',
        time: '2021Q4',
        data: 2304,
        ratio: 0.12
      },
      {
        order_data: '订单数量',
        time: 'line',
        lineData: generateLineData1(30)
      },
      {
        order_data: '利润金额',
        time: 'line',
        lineData: generateLineData1(30)
      },
      {
        order_data: '运输成本',
        time: 'line',
        lineData: generateLineData1(30)
      }
    ],
    // widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
    columnResizeType: 'indicatorGroup' // 'column' | 'indicator' | 'all'
  };

  const instance = new PivotTable(option);

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
