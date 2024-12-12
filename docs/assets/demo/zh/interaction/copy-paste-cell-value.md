---
category: examples
group: Interaction
title: 复制粘贴
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/copy-paste-cell-value.gif
link: interaction/keyboard
option: ListTable#keyboardOptions.pasteValueToCell
---

# 复制粘贴单元格内容

使用快捷键复制选中单元格内容，粘贴剪切板中内容到单元格。

当然，除了方向键还有其他快捷键可以参考[教程](../../guide/interaction/keyboard)。

注意：VTable 内部进行了校验，只有可编辑的单元格才允许进行粘贴，所以需要粘贴的业务场景请确保配置了 editor，editor 支持配置空字符串（即不存在的编辑器）。

## 关键配置

- keyboardOptions.pasteValueToCell
- keyboardOptions.copySelected

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
      frozenColCount: 1,
      overscrollBehavior: 'none',
      keyboardOptions: {
        moveEditCellOnArrowKeys: true,
        copySelected: true,
        pasteValueToCell: true
      },
      editor: '' // 配置一个空的编辑器，以遍能粘贴到单元格中
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
