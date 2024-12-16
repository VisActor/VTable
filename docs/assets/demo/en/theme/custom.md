---
category: examples
group: Theme
title: Theme - custom
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom.png
order: 6-6
link: theme_and_style/theme
option: ListTable#theme.bodyStyle.bgColor
---

# Form Theme -custom

Custom Theme

## Key Configurations

- `theme` Configure Theme Name or Customize Theme Style

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: 'City',
          value: 'Aberdeen'
        },
        {
          dimensionKey: 'City',
          value: 'Abilene'
        },
        {
          dimensionKey: 'City',
          value: 'Bowling Green'
        },
        {
          dimensionKey: 'City',
          value: 'Boynton Beach'
        },
        {
          dimensionKey: 'City',
          value: 'Bozeman'
        },
        {
          dimensionKey: 'City',
          value: 'Brentwood'
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Category',
          value: 'Office Supplies',
          children: [
            {
              indicatorKey: 'Quantity'
            },
            {
              indicatorKey: 'Sales'
            },
            {
              indicatorKey: 'Profit'
            }
          ]
        },
        {
          dimensionKey: 'Category',
          value: 'Technology',
          children: [
            {
              indicatorKey: 'Quantity'
            },
            {
              indicatorKey: 'Sales'
            },
            {
              indicatorKey: 'Profit'
            }
          ]
        },
        {
          dimensionKey: 'Category',
          value: 'Furniture',
          children: [
            {
              indicatorKey: 'Quantity'
            },
            {
              indicatorKey: 'Sales'
            },
            {
              indicatorKey: 'Profit'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'City',
          title: 'City',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Category',
          title: 'Category',
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
          showSort: false
        },
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            else return '--';
          }
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          width: 'auto',
          showSort: false,
          format: value => {
            return Number(value).toFixed(2);
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      widthMode: 'standard',
      theme: {
        defaultStyle: {
          borderLineWidth: 0
        },
        headerStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineWidth: [0, 0, 1, 0]
          }
        },
        rowHeaderStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineWidth: [0, 1, 0, 0]
          }
        },
        cornerHeaderStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineWidth: [0, 1, 1, 0]
          }
        }
      }
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
