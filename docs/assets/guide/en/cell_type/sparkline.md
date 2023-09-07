# Miniatures show meaning in tables

In the process of data analytics, tables are a common form of representation, which can clearly display data and facilitate reading. However, when the amount of data that needs to be displayed is large or the trend and distribution of the data need to be displayed more intuitively, it may be difficult to rely on tables alone to meet the needs. At this time, the miniature can come into play.

A minigraph is a small chart embedded in a table, which can be used to display information such as trends and distributions without affecting the original table data display. By embedding minigraphs in tables, we can make the data more vivid and intuitive, which helps to better perform data analytics.

# Chart Types Supported by Minicharts

In VTable, the table shows the type`cellType`Set to`sparkline`Used to generate minigraphs. At present, the miniature chart types provided by VTable only support line graphs. Over time, VTable will gradually enrich the chart types of minigraphs, and will also support various miniature chart types such as bar graphs and area graphs in the future.

# Introduction to sparklineSpec configuration for miniatures

SparklineSpec is a configuration object used to set the specific style and behavior of the miniature.

This configuration item can be defaulted and will use the internal default configuration. At the same time, it can be a static object or a function that dynamically generates configuration objects based on cell information. The example code is as follows:

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

Or:

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

Currently,[sparklineSpec](../../option/ListTable-columns-sparkline#sparklineSpec.type)For specific configurable content, please refer to the api.

## example

This example will show the miniature effect in different configurations:

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
  container:  document.getElementById(CONTAINER_ID),
  records,
  columns,
  autoWrapText:true,
  autoRowHeight:true
};
const tableInstance = new VTable.ListTable(option);

```

Through the above introduction and examples, we can quickly create and configure the table display type sparkline miniature in VTable. Although only line graphs are currently supported, with subsequent development, the functions and types of minigraphs will become more and more perfect, providing more convenient and practical functions for data lake visualization.
