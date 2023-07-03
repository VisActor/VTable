---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 排序

该示例中在，列【"Order ID"，"Customer ID"， "Quantity"，"Sales"，"Profit"】都开启了排序，点击排序按钮切换排序规则，内部缓存了排序结果在大数量的情况下可快速呈现排序结果。

## 关键配置

- `columns[x].sort` 设置为true 按默认规则排序，或者设置函数形式指定排序规则
  ``` 
  sort: (v1: any, v2: any, order: 'desc'|'asc'|'normal') => {
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    ```

## 代码演示

```ts
// <script type='text/javascript' src='../sales.js'></script>
// import { menus } from './menu';
  fetch('../mock-data/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": "auto",
        "sort":true
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
        "width": "auto",
        "sort":true
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
        "width": "auto"
    },
    {
        "field": "230517143221023",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "230517143221034",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "230517143221037",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "230517143221024",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "230517143221029",
        "caption": "Order Date",
        "width": "auto"
    },
    {
        "field": "230517143221042",
        "caption": "Quantity",
        "width": "auto",
        "sort":true
    },
    {
        "field": "230517143221040",
        "caption": "Sales",
        "width": "auto",
        "sort":(v1, v2, order) => {
        if (order === 'desc') {
          return Number(v1) ===  Number(v2) ? 0 :  Number(v1) >  Number(v2) ? -1 : 1;
        }
        return  Number(v1) ===  Number(v2) ? 0 :  Number(v1) >  Number(v2) ? 1 : -1;
      },
    },
    {
        "field": "230517143221041",
        "caption": "Profit",
        "width": "auto",
        "sort":true
    }
];

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records:data,
  columns,
  sortState:{
    field:"230517143221040",
    order:'asc'
  },
  widthMode:'standard'
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
