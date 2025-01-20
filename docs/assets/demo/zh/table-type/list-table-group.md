---
category: examples
group: table-type
title: 基本表格分组展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-group.jpeg
order: 1-2
link: table_type/List_table/group_list
option: ListTable#groupBy
---

# 基本表格分组展示

基本表格分组展示，用于展示数据中分组字段的层级结构

## 关键配置

- groupBy: 指定分组字段名称
- enableTreeStickCell: 开启分组标题吸附功能

## 代码演示

```javascript livedemo template=vtable
const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
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
      records: data.slice(0, 100),
      columns,
      widthMode: 'standard',
      groupBy: ['Category', 'Sub-Category'],
      groupTitleFieldFormat: (record, col, row, table) => {
        return record.vtableMergeName + '(' + record.children.length + ')';
      },
      theme: VTable.themes.DEFAULT.extends({
        groupTitleStyle: {
          fontWeight: 'bold',
          // bgColor: '#3370ff'
          bgColor: args => {
            const { col, row, table } = args;
            const index = table.getGroupTitleLevel(col, row);
            if (index !== undefined) {
              return titleColorPool[index % titleColorPool.length];
            }
          }
        }
      }),
      enableTreeStickCell: true
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
  })
  .catch(e => {
    console.error(e);
  });
```
