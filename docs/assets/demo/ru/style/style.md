---
категория: примеры
группа: Style
заголовок: Style
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/style.png
порядок: 5-1
ссылка: theme_and_style/style
опция: ListTable-columns-text#style.bgColor
---

# style

In this example, the styles of the header and body are configured by configuring headerStyle and style, respectively. All PivotTable columns with the same Dimension Category are set to the same background color, and Quantity, Sales and Profit in Metirc are set to different font colors.

## Ключевые Конфигурации

\-`headerStyle` Configure the header style of a Dimension

\-`style` Configure the style of a Dimension or Metirc body part

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: 'Город',
          value: 'Aberdeen'
        },
        {
          dimensionKey: 'Город',
          value: 'Abilene'
        },
        {
          dimensionKey: 'Город',
          value: 'Akron'
        },
        {
          dimensionKey: 'Город',
          value: 'Albuquerque'
        },
        {
          dimensionKey: 'Город',
          value: 'Alexandria'
        },
        {
          dimensionKey: 'Город',
          value: 'Allen'
        },
        {
          dimensionKey: 'Город',
          value: 'Allentown'
        },
        {
          dimensionKey: 'Город',
          value: 'Altoona'
        },
        {
          dimensionKey: 'Город',
          value: 'Amarillo'
        },
        {
          dimensionKey: 'Город',
          value: 'Anaheim'
        },
        {
          dimensionKey: 'Город',
          value: 'Andover'
        },
        {
          dimensionKey: 'Город',
          value: 'Ann Arbor'
        },
        {
          dimensionKey: 'Город',
          value: 'Antioch'
        },
        {
          dimensionKey: 'Город',
          value: 'Apopka'
        },
        {
          dimensionKey: 'Город',
          value: 'Apple Valley'
        },
        {
          dimensionKey: 'Город',
          value: 'Appleton'
        },
        {
          dimensionKey: 'Город',
          value: 'Arlington'
        },
        {
          dimensionKey: 'Город',
          value: 'Arlington Heights'
        },
        {
          dimensionKey: 'Город',
          value: 'Arvada'
        },
        {
          dimensionKey: 'Город',
          value: 'Asheville'
        },
        {
          dimensionKey: 'Город',
          value: 'Athens'
        },
        {
          dimensionKey: 'Город',
          value: 'Atlanta'
        },
        {
          dimensionKey: 'Город',
          value: 'Atlantic Город'
        },
        {
          dimensionKey: 'Город',
          value: 'Auburn'
        },
        {
          dimensionKey: 'Город',
          value: 'Aurora'
        },
        {
          dimensionKey: 'Город',
          value: 'Austin'
        },
        {
          dimensionKey: 'Город',
          value: 'Avondale'
        },
        {
          dimensionKey: 'Город',
          value: 'Bakersfield'
        },
        {
          dimensionKey: 'Город',
          value: 'Baltimore'
        },
        {
          dimensionKey: 'Город',
          value: 'Bangor'
        },
        {
          dimensionKey: 'Город',
          value: 'Bartlett'
        },
        {
          dimensionKey: 'Город',
          value: 'Bayonne'
        },
        {
          dimensionKey: 'Город',
          value: 'Baytown'
        },
        {
          dimensionKey: 'Город',
          value: 'Beaumont'
        },
        {
          dimensionKey: 'Город',
          value: 'Bedford'
        },
        {
          dimensionKey: 'Город',
          value: 'Belleville'
        },
        {
          dimensionKey: 'Город',
          value: 'Bellevue'
        },
        {
          dimensionKey: 'Город',
          value: 'Bellingham'
        },
        {
          dimensionKey: 'Город',
          value: 'Bethlehem'
        },
        {
          dimensionKey: 'Город',
          value: 'Beverly'
        },
        {
          dimensionKey: 'Город',
          value: 'Billings'
        },
        {
          dimensionKey: 'Город',
          value: 'Bloomington'
        },
        {
          dimensionKey: 'Город',
          value: 'Boca Raton'
        },
        {
          dimensionKey: 'Город',
          value: 'Boise'
        },
        {
          dimensionKey: 'Город',
          value: 'Bolingbrook'
        },
        {
          dimensionKey: 'Город',
          value: 'Bossier Город'
        },
        {
          dimensionKey: 'Город',
          value: 'Bowling Green'
        },
        {
          dimensionKey: 'Город',
          value: 'Boynton Beach'
        },
        {
          dimensionKey: 'Город',
          value: 'Bozeman'
        },
        {
          dimensionKey: 'Город',
          value: 'Brentwood'
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Категория',
          value: 'Office Supplies',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Technology',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Furniture',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Город',
          title: 'Город',
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
          dimensionKey: 'Категория',
          title: 'Категория',
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
          dimensionKey: 'Категория',
          title: 'Категория',
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
          indicatorKey: 'Количество',
          title: 'Количество',
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
          indicatorKey: 'Продажи',
          title: 'Продажи',
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
          indicatorKey: 'Прибыль',
          title: 'Прибыль',
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
