---
category: examples
group: data-analysis
title: Data Filter
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-filter.png
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.filterRules
---

# Pivot analysis data filtering

To perform pivot analysis table data data filtering rules, configure filterRules in dataConfig.

## Key Configurations

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` configures data rules, optional configuration items

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        },
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      dataConfig: {
        filterRules: [
          {
            filterFunc: record => record['Sub-Category'] !== 'Chairs'
          }
        ]
      },
      widthMode: 'standard'
    };
    const SubCategoryOrder = [
      'Chairs',
      'Tables',
      'Furnishings',
      'Bookcases',
      'Labels',
      'Paper',
      'Technology',
      'Appliances',
      'Art'
    ];
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
