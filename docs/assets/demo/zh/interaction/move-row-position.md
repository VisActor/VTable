---
category: examples
group: Interaction
title: 移动行
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/row-series-number.gif
link: table_type/List_table/list_table_define_and_generate
option: ListTable#rowSeriesNumber.dragOrder
---

# 移动行

行序号能力是指给表格的每一行添加一个唯一的序号或标识符，以便对表格中的行进行标记、排序或引用。该 demo 将展示 VTable 行序号能力：行选，行拖拽位置，以及行序号的样式配置。

## 关键配置

-`ListTable.rowSeriesNumber`

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
      rowSeriesNumber: {
        title: '序号',
        dragOrder: true,
        width: 'auto',
        headerStyle: {
          color: 'black',
          bgColor: 'pink'
        },
        style: {
          color: 'red'
        }
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
