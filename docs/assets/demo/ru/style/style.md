---
category: examples
group: Style
title: Style
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/style.png
order: 5-1
link: theme_and_style/style
option: ListTable-columns-text#style.bgColor
---

# style

In this example, the styles of the header and body are configured by configuring headerStyle and style, respectively. All PivotTable columns with the same Dimension Category are set to the same background color, and Quantity, Sales and Profit in Metirc are set to different font colors.

## Key Configurations

\-`headerStyle` Configure the header style of a Dimension

\-`style` Configure the style of a Dimension or Metirc body part

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
            textStick: true,
            bgColor: '#356b9c',
            color: '#00ffff'
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true,
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true,
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
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
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            fontWeight: 'bold',
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
          headerStyle: {
            color: 'black',
            fontWeight: 'normal',
            textStick: true,
            fontWeight: 'bold',
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
          format: value => {
            return '$' + Number(value).toFixed(2);
          }
        },
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'blue';
            },
            fontWeight: 'normal',
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
          headerStyle: {
            textStick: true,
            color: 'blue',
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
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
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'white';
            },
            fontWeight: 'normal',
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (arg.dataValue < 0) return 'purple';
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
          headerStyle: {
            color: 'white',
            textStick: true,
            bgColor: arg => {
              const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                return '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                return '#ff9900';
              }
              return 'gray';
            }
          },
          format: value => {
            return '$' + Number(value).toFixed(2);
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true,
          bgColor: '#356b9c',
          color: '#00ffff'
        }
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
