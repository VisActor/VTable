---
category: examples
group: Interaction
title: 选择单元格整行高亮
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/select-highlight.png
link: interaction/select
option: ListTable#select
---

# 选择单元格整行高亮效果

点击单元格，选中单元格的同时会高亮整行或者整列，如果非单个单元格被选中则高亮效果会消失。

高亮的样式可在样式中配置。全局配置：`theme.selectionStyle`中，也可以按表头及 body 分别配置，具体配置方式可查看教程。

## 关键配置

- `select: {
  highlightMode: 'cross'
}`

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
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
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
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
      keyboardOptions: {
        selectAllOnCtrlA: true,
        copySelected: true
      },
      select: {
        highlightMode: 'cross'
      },
      theme: VTable.themes.ARCO.extends({
        selectionStyle: {
          cellBgColor: 'rgba(130, 178, 245, 0.2)',
          cellBorderLineWidth: 2,
          inlineRowBgColor: 'rgb(160,207,245)',
          inlineColumnBgColor: 'rgb(160,207,245)'
        },
        headerStyle: {
          select: {
            inlineRowBgColor: 'rgb(0,207,245)',
            inlineColumnBgColor: 'rgb(0,207,245)'
          }
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
