---
category: examples
group: Interaction
title: 选择单元格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/select.png
link: interaction/select
option: ListTable#keyboardOptions
---

# 选择单元格

点击单元格进行单选，拖拽进行刷选。

按住 ctrl 或者 shift 进行多选。

开启快捷键 selectAllOnCtrlA 配置进行全选。

点击表头单元格的行为默认会选中整行或者整列，如果只想选中当前单元格可以设置 `select.headerSelectMode` 为`'cell'`, 或者只想选中 body 主体中的单元格可以设置 `select.headerSelectMode` 为`'body'`。

## 关键配置

- `  keyboardOptions: {
    selectAllOnCtrlA: true,
    copySelected: true
}`
  开启 ctrl+A 可选功能，及快捷键复制选中内容。

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
      theme: VTable.themes.ARCO.extends({
        selectionStyle: {
          cellBorderLineWidth: 2,
          cellBorderColor: '#9900ff',
          cellBgColor: 'rgba(153,0,255,0.2)'
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
