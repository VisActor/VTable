---
category: examples
group: Cell Type
title: PivotTable display sparkline
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-sparkline.png
link: cell_type/chart
option: PivotTable-indicators-chart#cellType
---

# PivotTable display sparkline

Display the data corresponding to the cell in the form of a mini chart.

## Key Configurations

- `cellType: 'sparkline'` specifies the type of chart
- `sparklineSpec: {}` Sparkline spec
- `dataConfig.aggregationRules` configures aggregation rules. The rule used here is of `RECORD` type, which means that the source data record of a cell needs to be collected as the data source of the mini chart

## Code demo

```javascript livedemo template=vtable
VTable.register.chartModule('vchart', VChart);
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        dimensionKey: 'Region',
        title: 'Region',
        headerStyle: {
          textStick: true
        }
      }
    ];
    const rows = ['Category'];
    const indicators = [
      {
        indicatorKey: 'Sales',
        title: 'Sales',
        width: 120,
        format: rec => {
          return '$' + Number(rec).toFixed(2);
        }
      },
      {
        indicatorKey: 'SalesRecords',
        title: 'Sales Trend',
        cellType: 'sparkline',
        width: 500,
        sparklineSpec: {
          type: 'line',
          xField: 'Order Date',
          yField: 'Sales',
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
        }
      }
    ];
    const option = {
      dataConfig: {
        aggregationRules: [
          //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
          {
            indicatorKey: 'SalesRecords', //指标名称
            field: 'Sales', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.RECORD //计算类型
          }
        ]
      },
      rows,
      columns,
      indicators,
      indicatorsAsCol: true,
      records: data,
      defaultRowHeight: 80,
      defaultHeaderRowHeight: 50,
      defaultColWidth: 280,
      defaultHeaderColWidth: 130,
      indicatorTitle: '指标',
      autoWrapText: true,
      // widthMode:'adaptive',
      // heightMode:'adaptive',
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          autoWrapText: true
        }
      }
    };

    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
    window.tableInstance = tableInstance;
    tableInstance.onVChartEvent('click', args => {
      console.log('onVChartEvent click', args);
    });
    tableInstance.onVChartEvent('mouseover', args => {
      console.log('onVChartEvent mouseover', args);
    });
    window.tableInstance = tableInstance;
  });
```
