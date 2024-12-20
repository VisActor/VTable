---
category: examples
group: data-analysis
title: Pivot analysis table drill down and drill up
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-table-drill.gif
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable-columns-text#drillDown
---

# Pivot analysis table drill down and drill up

Add the drillDown configuration item to the dimension configuration rows or columns to display the download button, listen to the icon button click event `drillmenu_click`, determine whether to drill down or roll up the dimension according to the event parameter `drillDown` or `drillUp`, determine the dimension to drill down or drill up according to the parameter `dimensionKey`, add or delete it to rows or columns, obtain the data source corresponding to the new dimension level, and call the interface `updateOption` to update the new option to the table.

In the demo example below, if you hover the mouse over the row dimension, a drill-down button will appear. Clicking it will add `Sub-Category` to the row dimension.

## Key Configurations

- `PivotTable` table type
- `columns` column dimension configuration
- `columns.drillDown` dimension drill-down configuration
- `columns.drillUp` dimension drill-up configuration
- `rows` row dimension configuration
- `indicators` indicator configuration

## Code demo

```javascript livedemo template=vtable
let tableInstance;
const data = [
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '16'
  },
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '4'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '37.90399980545044'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '62.22999954223633'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '10'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '4'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '7'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '18'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '7'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '17'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '7'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '17'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '4'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '6'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '4.361999988555908'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '280.58800506591797'
  }
];
const option = {
  records: data,
  rows: [
    {
      dimensionKey: 'Category',
      title: 'Category',
      drillDown: true,
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
  widthMode: 'standard'
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
const newData = [
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '16',
    'Sub-Category': 'Chairs'
  },
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '4',
    'Sub-Category': 'Tables'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '37.90399980545044',
    'Sub-Category': 'Paper'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '62.22999954223633',
    'Sub-Category': 'Appliances'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '10',
    'Sub-Category': 'Phones'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '4',
    'Sub-Category': 'Accessories'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '7',
    'Sub-Category': 'Bookcases'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '18',
    'Sub-Category': 'Furnishings'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '7',
    'Sub-Category': 'Paper'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '17',
    'Sub-Category': 'Binders'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '4',
    'Sub-Category': 'Furnishings'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '6',
    'Sub-Category': 'Tables'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '4.361999988555908',
    'Sub-Category': 'Accessories'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '280.58800506591797',
    'Sub-Category': 'Phones'
  }
];
tableInstance.on('drillmenu_click', args => {
  if (args.drillDown) {
    if (args.dimensionKey === 'Category') {
      tableInstance.updateOption({
        records: newData,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            drillUp: true,
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
        widthMode: 'standard'
      });
    }
  } else if (args.drillUp) {
    if (args.dimensionKey === 'Category') {
      tableInstance.updateOption({
        records: data,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            drillDown: true,
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
          }
          //  {
          //    "dimensionKey": "Order Year",
          //     "title": "Order Year",
          //     "headerStyle": {
          //         "textStick": true
          //     },
          //     "width": "auto",
          // },
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
        widthMode: 'standard'
      });
    }
  }
});
```
