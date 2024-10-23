---
category: examples
group: table-type
title: Pivot Chart
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-chart-wordCloud.png
link: '../guide/table_type/pivot_chart'
option: PivotChart-indicators-chart#cellType
---

# Pivot Chart

The perspective combination diagram combines the vchart chart library to render into the table, enriching the visual display form and improving the rendering performance.

## Key Configurations

- `PivotChart` Initialize the table type using PivotChart.
- `VTable.register.chartModule('vchart', VChart)` Register a charting library for charting, currently supports VChart
- `cellType: 'chart'` Specify the type chart
- `chartModule: 'vchart'` Specify the registered chart library name
- `chartSpec: {}` Chart specs

## Code demo

```javascript livedemo template=vtable
VTable.register.chartModule('vchart', VChart);
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        dimensionKey: 'Region',
        title: 'Region',
        headerStyle: {
          textStick: true
        }
      },
      'Category'
    ];
    const rows = [
      {
        dimensionKey: 'Order Year',
        title: 'Order Year',
        headerStyle: {
          textStick: true
        }
      },
      'Ship Mode'
    ];
    const indicators = [
      {
        indicatorKey: 'Quantity',
        title: 'Quantity',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'wordCloud',
          nameField: 'Segment',
          valueField: 'Quantity',
          seriesField: 'Segment',
          wordCloudConfig: {
            zoomToFit: {
              shrink: true
            }
          },
          random: false,
          data: {
            id: 'baseData',
            name: 'baseData'
          },
          scales: [
            {
              id: 'color',
              type: 'ordinal',
              domain: ['Consumer', 'Corporate', 'Home Office'],
              range: ['#2E62F1', '#4DC36A', '#FF8406']
            }
          ]
        },
        style: {
          padding: 1
        }
      }
    ];
    const option = {
      hideIndicatorName: true,
      rows,
      columns,
      indicators,
      records: data,
      defaultRowHeight: 200,
      defaultHeaderRowHeight: 50,
      defaultColWidth: 280,
      defaultHeaderColWidth: 100,
      indicatorTitle: '指标',
      autoWrapText: true,
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          autoWrapText: true
        }
      },
      legends: {
        orient: 'bottom',
        type: 'discrete',
        data: [
          {
            label: 'Consumer',
            shape: {
              fill: '#2E62F1',
              symbolType: 'circle'
            }
          },
          {
            label: 'Corporate',
            shape: {
              fill: '#4DC36A',
              symbolType: 'square'
            }
          },
          {
            label: 'Home Office',
            shape: {
              fill: '#FF8406',
              symbolType: 'square'
            }
          }
        ]
      },
      pagination: {
        currentPage: 0,
        perPageCount: 8
      }
    };
    tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
    const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
    tableInstance.on(LEGEND_ITEM_CLICK, args => {
      console.log('LEGEND_ITEM_CLICK', args);
      tableInstance.updateFilterRules([
        {
          filterKey: 'Segment',
          filteredValues: args.value
        }
      ]);
    });
    window.tableInstance = tableInstance;
  });
```
