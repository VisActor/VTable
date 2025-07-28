---
category: examples
group: Component
title: tooltip
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/tooltip.png
link: components/tooltip
option: ListTable#tooltip.isShowOverflowTextTooltip
---

# Tooltip

This example shows tooltips for four scenarios.

1. Set `tooltip.isShowOverflowTextTooltip` to `true` to enable overflow text prompts. When hovering over the text that is too long to be displayed, the text will be displayed. In this example, the text in the cells of the `Product Name` column is omitted, and you can hover over the cell to see the prompt information.

2. The description information of the table header is displayed by configuring `description`.

3. This example also shows how to actively display the tooltip through the interface. By listening to the `mouseenter_cell` event, when the mouse moves into the cell of the first column of order numbers, the interface `showTooltip` is called to display the prompt information.

4. Customize the prompt information of the icon, configure `headerIcon` in the `orderId` column to `order`, and configure `tooltip` in the configuration of the icon `order` to display the prompt information.

The prompt information supports hovering to select and copy. When there is too much content, the maximum width and height can be configured for scrolling interaction.

## Key Configurations

-`tooltip.isShowOverflowTextTooltip` Enable the prompt for long omitted text

-`showTooltip` Show the calling interface of tooltip

## Code demo

## 代码演示

```javascript livedemo template=vtable
VTable.register.icon('order', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: VTable.TYPES.IconPosition.right,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  tooltip: {
    // 气泡框，按钮的的解释信息
    title:
      'Order ID is the unique identifier for each order.\n It is a unique identifier for each order. \n It is a unique identifier for each order. \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique',
    style: { bgColor: 'black', arrowMark: true, color: 'white', maxHeight: 100, maxWidth: 200 },
    disappearDelay: 100
  },
  cursor: 'pointer'
});
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto',
        headerIcon: 'order',
        description: 'Order ID is the unique identifier for each order.\n It is a unique identifier for each order.'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto',
        description:
          'Customer ID is the unique identifier for each customer.\n It is a unique identifier for each customer.'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: '200',
        description: 'Product Name is the name of the product.'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto',
        description: 'Category is the category of the product.'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto',
        description: 'Sub-Category is the sub-category of the product.'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto',
        description: 'Region is the region of the order produced.'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto',
        description: 'City is the city of the order produced.'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto',
        description: 'Order Date is the date of the order produced.'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto',
        description: 'Quantity is the quantity of the order.'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto',
        description: 'Sales is the sales of the order.'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto',
        description: 'Profit is the profit of the order.'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      tooltip: {
        isShowOverflowTextTooltip: true
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
    tableInstance.on('mouseenter_cell', args => {
      const { col, row, targetIcon } = args;
      if (col === 0 && row >= 1) {
        const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
        tableInstance.showTooltip(col, row, {
          content: 'Order ID：' + tableInstance.getCellValue(col, row),
          referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
          className: 'defineTooltip',
          disappearDelay: 100,
          style: {
            bgColor: 'black',
            color: 'white',
            font: 'normal bold normal 14px/1 STKaiti',
            arrowMark: true
          }
        });
      }
    });
  });
```
