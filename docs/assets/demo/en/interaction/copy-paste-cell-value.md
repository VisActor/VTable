---
category: examples
group: Interaction
title: Copy and paste cell value
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/copy-paste-cell-value.gif
link: interaction/keyboard
option: ListTable#keyboardOptions.pasteValueToCell
---

# Copy and paste cell value

Use shortcut keys to copy the contents of the selected cell and paste the contents of the clipboard into the cell.

Of course, in addition to the arrow keys, there are other shortcut keys, please refer to [Tutorial](../../guide/interaction/keyboard).

Note: VTable has been verified internally, and only editable cells are allowed to be pasted. Therefore, in the business scenario where pasting is required, please ensure that an editor is configured. The editor supports configuring empty strings (that is, non-existent editors).

## Key Configurations

- keyboardOptions.pasteValueToCell
- keyboardOptions.copySelected

## Code demo

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
      editor: '' // Configure an empty editor that can be pasted into cells everywhere
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
