---
category: examples
group: Cell Type
title: 透视表展示迷你图
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-sparkline.png
link: cell_type/chart
option: PivotTable-indicators-chart#cellType
---

# 透视表展示迷你图

将单元格对应的数据以迷你图表的形式展示。

## 关键配置

- `cellType: 'sparkline'` 指定类型 chart
- `sparklineSpec: {}` 迷你图 spec
- `dataConfig.aggregationRules` 配置聚合规则 这里用到的规则是`RECORD`类型，表示需要搜集单元格对一个的源数据记录，作为迷你图表的数据源

## 代码演示

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
