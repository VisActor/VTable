---
category: examples
group: Component
title: tooltip
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/tooltip.png
link: components/tooltip
option: ListTable#tooltip.isShowOverflowTextTooltip
---

# tooltip

在该示例中，展示了四种场景的 tooltip 提示。

1. 配置了 `tooltip.isShowOverflowTextTooltip` 为 `true` 开启溢出文字提示，超长显示不了被省略的文字被 hover 时将提示出来。该示例 `Product Name`列中的单元格文本有被省略，可以 hover 到单元格上出现提示信息。

2. 表头的描述信息，通过配置 `description` 来显示提示信息。

3. 在该示例也展示了通过接口主动显示 tooltip 的用法。通过监听`mouseenter_cell`事件，鼠标移入第一列订单号的单元格时，调用接口 `showTooltip` 来显示提示信息。

4. 自定义 icon 的提示信息，`orderId` 列配置 `headerIcon` 为`order`, 图标`order`的配置中配置了 `tooltip` 来显示提示信息。

提示信息支持 hover 上去进行选中复制，当内容过多时可以配置最大宽高可进行滚动交互

## 关键配置

-`tooltip.isShowOverflowTextTooltip` 开启超长省略文字的提示

-`showTooltip` 显示 tooltip 的调用接口

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
