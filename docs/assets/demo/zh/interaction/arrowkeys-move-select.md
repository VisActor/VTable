---
category: examples
group: Interaction
title: 方向键切换选中单元格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/arrowkeys-move-select.gif
link: interaction/keyboard
option: ListTable#keyboardOptions.selectAllOnCtrlA
---

# 方向键切换选中单元格

该示例快捷键能力，选中单元格通过方向键切换选中，按 enter 进入编辑。当然，除了方向键还有其他快捷键可以参考[教程](../../guide/interaction/keyboard)

## 关键配置

- keyboardOptions

## 代码演示

```javascript livedemo template=vtable
// 使用时需要引入插件包@visactor/vtable-editors
// import * as VTable_editors from '@visactor/vtable-editors';
// 正常使用方式 const input_editor = new VTable.editors.InputEditor();
// 官网编辑器中将 VTable.editors重命名成了VTable_editors
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input-editor', input_editor);
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
        moveEditCellOnArrowKeys: true
      },
      editor: 'input-editor'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
