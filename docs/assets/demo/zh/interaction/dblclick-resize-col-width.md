---
category: examples
group: Interaction
title: 双击列宽自动适应内容
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/dblclick-resize-col-width.gif
link: '/interaction/resize_column_width'
option: ListTable#columnResizeMode
---

# 双击列宽自动适应内容

在列间隔线上双击，按当前单元格内容自动计算列宽。

## 关键配置

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
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
          indicatorKey: 'Profit',
          title: 'Profit',
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
      widthMode: 'standard',
      defaultColWidth: 120
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
