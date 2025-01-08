---
category: examples
group: Theme
title: 表格主题-register
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/register.png
order: 6-7
link: theme_and_style/theme
option: ListTable#theme.bodyStyle.bgColor
---

# 表格主题-register

全局注册一个自定义主题

## 关键配置

- `VTable.register.theme` 全局注册 theme
- `theme: xxx` 指定注册 theme 的名称

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
VTable.register.theme('themeRegisterOne', {
  defaultStyle: {
    borderLineWidth: 0
  },
  headerStyle: {
    bgColor: '#a881e1',
    borderColor: 'white',
    fontWeight: 'normal',
    color: 'white'
  },
  rowHeaderStyle: {
    bgColor: '#eae1fa',
    borderColor: 'white',
    borderLineWidth: 1,
    fontWeight: 'normal'
  },
  cornerHeaderStyle: {
    bgColor: '#a881e1',
    fontWeight: 'normal',
    color: 'white'
  },
  bodyStyle: {
    borderColor: '#f1e8fe',
    borderLineWidth: 1,
    bgColor: args => {
      if (args.row & 1) {
        return '#f8f5fe';
      }
      return '#FDFDFD';
    }
  }
});
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
      theme: 'themeRegisterOne'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
