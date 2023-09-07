# 迷你图在表格中展示意义

在数据分析过程中，表格是一种常见的表现形式，它可以清晰地显示数据，方便阅读。然而，当需要展示的数据量较大或者对数据的变化趋势、分布等需要进行更直观的展示时，仅仅依靠表格可能难以满足需求。这个时候，迷你图就可以发挥作用了。

迷你图是在表格中嵌入的一种小型图表，可以用于展示趋势、分布等信息，同时不影响原有的表格数据展示。通过在表格中嵌入迷你图，我们可以让数据表现得更加生动、直观，有助于更好地进行数据分析。

# 迷你图支持的图表类型

在VTable中，表格展示类型`cellType`设置成`sparkline`用于生成迷你图。目前，VTable提供的迷你图图表类型仅支持折线图（line），随着时间的推移，VTable将逐步丰富迷你图的图表类型，后续还将支持柱状图、面积图等多种迷你图类型。

# 迷你图的sparklineSpec配置介绍

sparklineSpec是一个配置对象，用于设置迷你图的具体样式和行为。

该配置项可缺省，将使用内部默认配置，同时它可以是一个静态的对象，也可以是一个根据单元格信息动态生成配置对象的函数。示例代码如下：

```typescript{
  // ...其他配置
  columns: [
    {
      field: 'timeSeriesData',
      cellType: 'sparkline',
      sparklineSpec: {
        type: 'line',
        // ...其他sparklineSpec配置
      },
      // ...其他配置
    },
    // ...其他列
  ],
  // ...其他配置
}
```

或者：

```typescript
{
  // ...其他配置
  columns: [
    {
      field: 'timeSeriesData',
      cellType: 'sparkline',
      sparklineSpec: (cellInfo) => {
        return {
          type: 'line',
          // ...根据cellInfo动态配置
        };
      },
      // ...其他列配置
    },
    // ...其他列
  ],
  // ...其他配置
}
```

目前，[sparklineSpec](../../option/ListTable-columns-sparkline#sparklineSpec.type)的具体可配置内容可参考api。

## 示例
该示例将展示不同配置形式的迷你图效果：

```javascript livedemo template=vtable
const records = [
  {
   'lineData':[50,20,20,40,60,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineData':[50,20,60,40,60,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineData':[50,50,20,40,10,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineData':[70,20,20,40,60,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  }
];

const columns = [
  {
    field: 'lineData',
    title: 'sparkline',
    cellType: 'sparkline',
    width:300,
    sparklineSpec: {
        type: 'line',
        pointShowRule: 'none',
        smooth: true,
        line: {
          style: {
            stroke: '#2E62F1',
            strokeWidth: 2,
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
  },
  {
    field: 'lineData2',
    title: 'sparkline 2',
    cellType: 'sparkline',
    width:300,
    sparklineSpec: {
        type: 'line', 
        xField: 'x',
        yField: 'y',
        pointShowRule: 'all',
        smooth: true,
        line: {
          style: {
            stroke: '#2E62F1',
            strokeWidth: 2,
          },
        },
      },
  },
];
const option = {
  records,
  columns,
  autoWrapText:true,
  autoRowHeight:true
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

```

通过以上介绍和示例，我们可以在VTable中快速创建并配置表格展示类型sparkline迷你图。虽然目前仅支持折线图，但随着后续的开发，迷你图的功能和类型将愈发完善，为数据可视化提供更多便捷实用的功能。