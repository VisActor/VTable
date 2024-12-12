---
category: examples
group: Component
title: legend
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/legend.png
link: components/legend
option: ListTable-legends-discrete#type
---

# legend

在该示例中，按类别维度值对单元格的背景色进行映射生成图例项，并且监听了图例项的点击事件来对单元格内容进行高亮。

## 关键配置

- `legend` 配置表格图例，具体可参考：https://www.visactor.io/vtable/option/ListTable#legend

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const categorys = ['Office Supplies', 'Technology', 'Furniture'];
    const colorToCategory = ['rgba(255, 127, 14,1)', 'rgba(227, 119, 194, 1)', 'rgba(44, 160, 44, 1)'];
    const colorToCategoryUnactive = ['rgba(255, 127, 14, .2)', 'rgba(227, 119, 194, .2)', 'rgba(44, 160, 44, .2)'];

    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: '200'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto',
        style: {
          // bgColor(args) {
          //   const index = categorys.indexOf(args.value);
          //   return colorToCategory[index];
          // }
        }
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      tooltip: {
        isShowOverflowTextTooltip: true
      },
      theme: VTable.themes.DEFAULT.extends({
        bodyStyle: {
          bgColor(args) {
            const { row, col } = args;
            const record = args.table.getCellOriginRecord(col, row);
            return colorToCategory[categorys.indexOf(record.Category)];
          }
        }
      }),
      legends: {
        data: [
          {
            label: 'Office Supplies',
            shape: {
              fill: '#ff7f0e',
              symbolType: 'circle'
            }
          },
          {
            label: 'Technology',
            shape: {
              fill: '#e377c2',
              symbolType: 'square'
            }
          },
          {
            label: 'Furniture',
            shape: {
              fill: '#2ca02c',
              symbolType: 'circle'
            }
          }
        ],
        orient: 'top',
        position: 'start',
        maxRow: 1,
        padding: 10
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
    const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
    tableInstance.on(LEGEND_ITEM_CLICK, args => {
      const highlightCategorys = args.value;
      tableInstance.updateTheme(
        VTable.themes.DEFAULT.extends({
          bodyStyle: {
            color(args) {
              const { row, col } = args;
              const record = tableInstance.getCellOriginRecord(col, row);
              if (highlightCategorys.indexOf(record.Category) >= 0) {
                return 'black';
              }
              return '#e5dada';
            },
            bgColor(args) {
              const { row, col } = args;
              const record = tableInstance.getCellOriginRecord(col, row);
              if (highlightCategorys.indexOf(record.Category) >= 0) {
                return colorToCategory[categorys.indexOf(record.Category)];
              }
              return colorToCategoryUnactive[categorys.indexOf(record.Category)];
            }
          }
        })
      );
      console.log(tableInstance.stateManager?.select);
    });
  });
```
