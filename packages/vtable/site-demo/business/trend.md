---
category: examples
group: table-type pivot-table
title: 趋势表
cover:
---

# 趋势表

该示例分析了不同时间粒度的销售数据及同环比，并使用迷你折线图展示了2020-2021年产品的销售趋势。

## 关键配置

- `indicators[x].icon` 根据销售值来展示不同的icon 表示上涨和下降

- `indicators[x].columnType` 设置为sparkline 来展示迷你图

## 代码演示

```ts
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
        value: '订单数量',
      },
      {
        dimensionKey: 'order_data',
        value: '利润金额',
      },
      {
        dimensionKey: 'order_data',
        value: '运输成本',
      },
    ],
    columnTree: [
      {
        dimensionKey: 'time',
        value: '2020',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2021',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2020Q1',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2020Q2',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2020Q3',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2020Q4',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2021Q1',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2021Q2',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2021Q3',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: '2021Q4',
        children: [
          {
            indicatorKey: 'data',
          },
          {
            indicatorKey: 'ratio',
          },
        ],
      },
      {
        dimensionKey: 'time',
        value: 'line',
        children: [
          {
            indicatorKey: 'lineData',
            value: '趋势图',
          },
        ],
      },
    ],
    rows:[
      {
        dimensionKey: 'order_data',
        dimensionTitle: '订单数据',
        headerStyle: {
          textStick: true,
        },
        width: '100',
        showSort: false,
      },
    ],
    columns:[
      {
        dimensionKey: 'time',
        dimensionTitle: '季度',
        width: '200',
        showSort: false,
        headerStyle: {
          textAlign: 'center',
          borderLineWidth: (args) => {
            const { col, row } = args;
            const cellHeaderPaths = args.table.getCellHeaderPaths(
                args.col,
                args.row,
              );
            if (cellHeaderPaths.colHeaderPaths[0].value ==='2020Q1'||cellHeaderPaths.colHeaderPaths[0].value ==='2021Q1'||cellHeaderPaths.colHeaderPaths[0].value ==='line' ) return [0, 0, 0, 1];
            return [0, 0, 0, 0];
        },
        },
      },
      {
        dimensionKey: 'year',
        dimensionTitle: '年度',
        width: '200',
        showSort: false,
        headerStyle: {
          textAlign: 'center',
        },
      },
    ],
    indicators: [
      {
        indicatorKey: 'data',
        value: '数据',
        width: 'auto',
        style: {
          textAlign: 'right',
          borderLineWidth: (args) => {
                const cellHeaderPaths = args.table.getCellHeaderPaths(
                args.col,
                args.row,
              );
                if (cellHeaderPaths.colHeaderPaths[0].value ==='2020Q1'||cellHeaderPaths.colHeaderPaths[0].value ==='2021Q1') return [0, 0, 0, 1];
                return [0, 0, 0, 0];
              },
          padding: [8, 5, 8, 20],
        },
      },
      {
        indicatorKey: 'ratio',
        caption: '环比',
        width: 'auto',
        format: (rec) => {
          if (rec?.ratio) return rec?.ratio * 100 + '%';
          return '-';
        },
        icon: (args) => {
          const { dataValue } = args;
          if (dataValue > 0) {
            return {
              type: 'svg',
              svg: 'http://' + window.location.host + "/mock-data/up-arrow.svg",
              width: 12,
              height: 12,
              name: 'up-green',
              positionType: VTable.TYPES.IconPosition.inlineEnd,
            };
          } else if (dataValue < 0)
            return {
              type: 'svg',
              svg: 'http://' + window.location.host + "/mock-data/down-arrow.svg",
              width: 14,
              height: 14,
              name: 'down-red',
              positionType: VTable.TYPES.IconPosition.inlineEnd,
            };
          return '';
        },
        style: {
          textAlign: 'left',
          borderLineWidth: [0, 0, 0, 0],
          padding: [8, 20, 8, 5],
          color: (args) => {
            const { dataValue } = args;
            if (dataValue > 0) return 'green';
            return 'red';
          },
        },
      },
      {
        indicatorKey: 'lineData',
        caption: '趋势图',
        width: '300',
        columnType: 'sparkline',
        sparklineSpec: {
          type: 'line',
          xField: 'x',
          yField: 'y',
          pointShowRule: 'none',
          smooth: true,
          line: {
            style: {
              stroke: '#2E62F1',
              strokeWidth: 2,
              // interpolate: 'monotone',
            },
          },
          point: {
              hover: {
                stroke: 'blue',
                strokeWidth: 1,
                fill: 'red',
                shape: 'circle',
                size: 4,
            },
            style: {
              stroke: 'red',
              strokeWidth: 1,
              fill: 'yellow',
              shape: 'circle',
              size: 2,
            },
          },
          crosshair: {
            style: {
              stroke: 'gray',
              strokeWidth: 1,
            },
          },
        },
        style: {
          textAlign: 'left',
          borderLineWidth: [0, 1, 0, 1],
          padding: [8, 0, 8, 5],
        },
      },
    ],
    corner: {
      titleOnDimension: 'none',
      headerStyle: {
        color: 'red',
      },
    },
    showColumnHeader: true,
    showRowHeader: true,
    hideIndicatorName: true,
    records: [
      {
        order_data: '订单数量',
        time: '2020',
        data: 12304,
        ratio: 0.11,
      },
      {
        order_data: '利润金额',
        time: '2020',
        data: 102504,
        ratio: 0.11,
      },
      {
        order_data: '运输成本',
        time: '2020',
        data: 6504,
        ratio: 0.11,
      },
      {
        order_data: '订单数量',
        time: '2021',
        data: 19304,
        ratio: -0.12,
      },
      {
        order_data: '利润金额',
        time: '2021',
        data: 302504,
        ratio: -0.12,
      },
      {
        order_data: '运输成本',
        time: '2021',
        data: 9504,
        ratio: -0.12,
      },
      {
        order_data: '订单数量',
        time: '2020Q1',
        data: 2304,
        // "ratio":0.12
      },
      {
        order_data: '订单数量',
        time: '2020Q2',
        data: 2504,
        ratio: 0.12,
      },
      {
        order_data: '订单数量',
        time: '2020Q3',
        data: 2904,
        ratio: 0.12,
      },
      {
        order_data: '订单数量',
        time: '2020Q4',
        data: 2704,
        ratio: -0.08,
      },
      {
        order_data: '订单数量',
        time: '2021Q1',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '订单数量',
        time: '2021Q2',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '订单数量',
        time: '2021Q3',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '订单数量',
        time: '2021Q4',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '利润金额',
        time: '2020Q1',
        data: 2304,
        // "ratio":0.12
      },
      {
        order_data: '利润金额',
        time: '2020Q2',
        data: 2504,
        ratio: 0.12,
      },
      {
        order_data: '利润金额',
        time: '2020Q3',
        data: 2904,
        ratio: 0.12,
      },
      {
        order_data: '利润金额',
        time: '2020Q4',
        data: 2704,
        ratio: -0.08,
      },
      {
        order_data: '利润金额',
        time: '2021Q1',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '利润金额',
        time: '2021Q2',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '利润金额',
        time: '2021Q3',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '利润金额',
        time: '2021Q4',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '运输成本',
        time: '2020Q1',
        data: 2304,
        // "ratio":0.12
      },
      {
        order_data: '运输成本',
        time: '2020Q2',
        data: 2504,
        ratio: 0.12,
      },
      {
        order_data: '运输成本',
        time: '2020Q3',
        data: 2904,
        ratio: 0.12,
      },
      {
        order_data: '运输成本',
        time: '2020Q4',
        data: 2704,
        ratio: -0.08,
      },
      {
        order_data: '运输成本',
        time: '2021Q1',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '运输成本',
        time: '2021Q2',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '运输成本',
        time: '2021Q3',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '运输成本',
        time: '2021Q4',
        data: 2304,
        ratio: 0.12,
      },
      {
        order_data: '订单数量',
        time: 'line',
        lineData: generateLineData1(30),
      },
      {
        order_data: '利润金额',
        time: 'line',
        lineData: generateLineData1(30),
      },
      {
        order_data: '运输成本',
        time: 'line',
        lineData: generateLineData1(30),
      },
    ],
    theme: {
      headerStyle: {
        frameStyle: {
          borderColor: 'green',
          borderLineWidth: [0, 0, 2, 0],
        },
        borderLineWidth:[0,1,0,1]
      },
      rowHeaderStyle: {
        borderLineWidth: 0,
        frameStyle: {
          borderColor: 'red',
          borderLineWidth: [0, 2, 0, 0],
        },
      },
      cornerHeaderStyle: {
        frameStyle: {
          borderColor: [null, 'red', 'green', null],
          borderLineWidth: [0, 2, 2, 0],
        },
        borderColor:[null,null,null,null]
      },
    },
    defaultColWidth: 200,
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    columnResizeType: 'indicatorGroup',
  };
const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
