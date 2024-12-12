---
category: examples
group: Basic Features
title: 排序
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/sort.gif
order: 3-2
link: basic_function/sort/list_sort
option: ListTable-columns-text#sort
---

# 排序

该示例中在，列【"Order ID"，"Customer ID"， "Quantity"，"Sales"，"Profit"】都开启了排序，点击排序按钮切换排序规则，内部缓存了排序结果在大数量的情况下可快速呈现排序结果。

## 关键配置

- `columns[x].sort` 设置为 true 按默认规则排序，或者设置函数形式指定排序规则
  ```
  sort: (v1: any, v2: any, order: 'desc'|'asc'|'normal') => {
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
  ```

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
        width: 'auto',
        sort: true
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto',
        sort: true
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
        width: 'auto',
        sort: true
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return Number(v1) === Number(v2) ? 0 : Number(v1) > Number(v2) ? -1 : 1;
          }
          return Number(v1) === Number(v2) ? 0 : Number(v1) > Number(v2) ? 1 : -1;
        }
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto',
        sort: true
      }
    ];

    const option = {
      records: data,
      columns,
      sortState: {
        field: 'Sales',
        order: 'asc'
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
