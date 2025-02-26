---
category: examples
group: Interaction
title: Adjust column width
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/resize-col-width.gif
order: 4-4
link: '/interaction/resize_column_width'
option: ListTable#columnResizeMode
---

# Adjust column width

The mouse style for adjusting the column width appears when the mouse is placed on the column spacer, and the column width can be adjusted by dragging.

## Key Configurations

- `columnResizeMode: 'all' | 'none' | 'header' | 'body'` Specify the Region where the column width can be adjusted
- `columnResizeType: 'column' | 'indicator' | 'all' | 'indicatorGroup'` Adjust the effective range of the column width, configurable items:

  - Column: adjust the column width to adjust only the current column
  - Indicator: Columns corresponding to the same Metirc will be adjusted when adjusting the column width
  - indicatorGroup: Adjust the width of all Metirc columns under the same parent Dimension
  - All: All column widths are adjusted

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
          value: 'Akron'
        },
        {
          dimensionKey: 'City',
          value: 'Albuquerque'
        },
        {
          dimensionKey: 'City',
          value: 'Alexandria'
        },
        {
          dimensionKey: 'City',
          value: 'Allen'
        },
        {
          dimensionKey: 'City',
          value: 'Allentown'
        },
        {
          dimensionKey: 'City',
          value: 'Altoona'
        },
        {
          dimensionKey: 'City',
          value: 'Amarillo'
        },
        {
          dimensionKey: 'City',
          value: 'Anaheim'
        },
        {
          dimensionKey: 'City',
          value: 'Andover'
        },
        {
          dimensionKey: 'City',
          value: 'Ann Arbor'
        },
        {
          dimensionKey: 'City',
          value: 'Antioch'
        },
        {
          dimensionKey: 'City',
          value: 'Apopka'
        },
        {
          dimensionKey: 'City',
          value: 'Apple Valley'
        },
        {
          dimensionKey: 'City',
          value: 'Appleton'
        },
        {
          dimensionKey: 'City',
          value: 'Arlington'
        },
        {
          dimensionKey: 'City',
          value: 'Arlington Heights'
        },
        {
          dimensionKey: 'City',
          value: 'Arvada'
        },
        {
          dimensionKey: 'City',
          value: 'Asheville'
        },
        {
          dimensionKey: 'City',
          value: 'Athens'
        },
        {
          dimensionKey: 'City',
          value: 'Atlanta'
        },
        {
          dimensionKey: 'City',
          value: 'Atlantic City'
        },
        {
          dimensionKey: 'City',
          value: 'Auburn'
        },
        {
          dimensionKey: 'City',
          value: 'Aurora'
        },
        {
          dimensionKey: 'City',
          value: 'Austin'
        },
        {
          dimensionKey: 'City',
          value: 'Avondale'
        },
        {
          dimensionKey: 'City',
          value: 'Bakersfield'
        },
        {
          dimensionKey: 'City',
          value: 'Baltimore'
        },
        {
          dimensionKey: 'City',
          value: 'Bangor'
        },
        {
          dimensionKey: 'City',
          value: 'Bartlett'
        },
        {
          dimensionKey: 'City',
          value: 'Bayonne'
        },
        {
          dimensionKey: 'City',
          value: 'Baytown'
        },
        {
          dimensionKey: 'City',
          value: 'Beaumont'
        },
        {
          dimensionKey: 'City',
          value: 'Bedford'
        },
        {
          dimensionKey: 'City',
          value: 'Belleville'
        },
        {
          dimensionKey: 'City',
          value: 'Bellevue'
        },
        {
          dimensionKey: 'City',
          value: 'Bellingham'
        },
        {
          dimensionKey: 'City',
          value: 'Bethlehem'
        },
        {
          dimensionKey: 'City',
          value: 'Beverly'
        },
        {
          dimensionKey: 'City',
          value: 'Billings'
        },
        {
          dimensionKey: 'City',
          value: 'Bloomington'
        },
        {
          dimensionKey: 'City',
          value: 'Boca Raton'
        },
        {
          dimensionKey: 'City',
          value: 'Boise'
        },
        {
          dimensionKey: 'City',
          value: 'Bolingbrook'
        },
        {
          dimensionKey: 'City',
          value: 'Bossier City'
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
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            return '$' + Number(value).toFixed(2);
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
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            else return '--';
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
          format: value => {
            return '$' + Number(value).toFixed(2);
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
      resize: {
        columnResizeMode: 'header'
        //columnResizeType:'all',
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
