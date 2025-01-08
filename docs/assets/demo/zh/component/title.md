---
category: examples
group: Component
title: title
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/title.png
link: components/title
option: ListTable#title.visible
---

# title

在该示例中，配置了表格的主副标题，并分别设置了不同的样式。

## 关键配置

- `title` 配置表格标题 具体可参考：https://www.visactor.io/vtable/option/ListTable#title

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
        width: '200'
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
      tooltip: {
        isShowOverflowTextTooltip: true
      },
      title: {
        text: 'North American supermarket sales analysis',
        subtext: `The data includes 15 to 18 years of retail transaction data for North American supermarket`,
        orient: 'top',
        padding: 20,
        textStyle: {
          fontSize: 30,
          fill: 'black'
        },
        subtextStyle: {
          fontSize: 20,
          fill: 'blue'
        }
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
