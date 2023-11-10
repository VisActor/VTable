# VTable Usage Issue: How to insert sparklines in table?

## Question Description

A mini-line chart reflecting the dynamics of a set of data needs to be displayed in a cell in a column of the table. How to achieve this effect in VTable?

## Solution

In VTable, you can specify the column to be a sparkline type cell by setting `cellType` to `sparkline` in `columns`.

1. sparkLine data
   The data specified by the `sparkline` type cell can be an array of numbers (the number will default to y field in the sparkline, and x field will be automatically filled in order), or it can be an array of x, y objects:

```javascript
// ......
{
  lineData1: [10, 20, 30, 40, 60, 30, 10],
  lineData2: [
    { x: 0, y: 10 },
    { x: 1, y: 40 },
    { x: 2, y: 60 },
    { x: 3, y: 30 },
    { x: 4, y: 20 },
    { x: 5, y: 20 },
    { x: 6, y: 60 },
    { x: 7, y: 50 },
    { x: 8, y: 70 }
  ]
}
```

2. sparkline style
   In `columns`, in addition to configuring the `cellType` as `sparkline`, you can also configure the sparkline style spec through `sparklineSpec` (if not configured using default style), and the spec rules refer to VChart:

```javascript
const baseSpec: TYPES.SparklineSpec = {
  type: 'line',
  xField: {
    field: 'x',
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  yField: {
    field: 'y',
    domain: [0, 80]
  },
  smooth: true,
  pointShowRule: 'all',
  line: {
    style: {
      stroke: '#2E62F1',
      strokeWidth: 2
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
};

// option: ......
columns: [
  {
    field: 'lineData2',
    title: 'spark line2',
    cellType: 'sparkline',
    width: 250,
    sparklineSpec: baseSpec
  }
];
```

- type: the type of sparkline, currently only supports line
- xField: x-axis dimension information, configure the data field for x-axis mapping, x-axis data range, etc.
- yField: y-axis dimension information, configure the data field for y-axis mapping, y-axis data range, etc.
- smooth: whether the polyline is displayed smoothly
- pointShowRule: The display rule of the vertex, which supports the following configurations:
  - all: show all points
  - none: do not display points
  - isolatedPoint: Indicates that only isolated points are displayed (the front and rear values are empty)
- line: polyline style
- point: style of vertex
- crosshair: interactively displayed crosshair style

## Code Example

```javascript
const baseSpec: TYPES.SparklineSpec = {
  type: 'line',
  xField: {
    field: 'x',
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  yField: {
    field: 'y',
    domain: [0, 80]
  },
  smooth: true,
  pointShowRule: 'all',
  line: {
    style: {
      stroke: '#2E62F1',
      strokeWidth: 2
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
};

const records = generateRecords(10);

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'lineData1',
    title: 'spark line1',
    cellType: 'sparkline',
    width: 250
  },
  {
    field: 'lineData2',
    title: 'spark line2',
    cellType: 'sparkline',
    width: 250,
    sparklineSpec: baseSpec
  }
];
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns
};
```

## Results

[Online demo](https://codesandbox.io/s/vtable-miniline-w536q9)

![result](/vtable/faq/8-0.png)

## Quote

- [Cell Type Demo](https://www.visactor.io/vtable/demo/cell-type/multi-type)
- [Sparkline Tutorial](https://visactor.io/vtable/guide/cell_type/sparkline)
- [github](https://github.com/VisActor/VTable)
