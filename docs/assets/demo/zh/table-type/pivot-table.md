---
category: examples
group: table-type
title: 透视表格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table.png
link: table_type/Pivot_table/pivot_table_useage
option: PivotTable#columnTree
---

# 透视表格（自定义表头结构）

透视表格，该示例传入了自定义表头树结构 rowTree 和 columnTree

## 关键配置

- `PivotTable` 表格类型
- `columnTree` 自定义表头树结构
- `rowTree` 自定义表头树结构
- `columns` 可选 配置维度的样式等
- `rows` 可选 配置维度的样式等
- `indicators` 指标配置

## 代码演示

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
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
