---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 基本表格

基本表格

## 关键配置


## 代码演示

```ts
// <script type='text/javascript' src='../sales.js'></script>
// import { menus } from './menu';
  fetch('../mock-data/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "230517143221023",
        "caption": "Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'right'
          // textBaseline:"bottom"
        }
    },
    {
        "field": "230517143221034",
        "caption": "Sub-Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
    },
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": "auto"
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
        "width": "auto",
        headerStyle:{
          "textStick":true,
        }
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
        "width": "auto"
    },
    {
        "field": "230517143221040",
        "caption": "Sales",
        "width": "auto"
    },
    {
        "field": "230517143221041",
        "caption": "Profit",
        "width": "auto"
    }
];

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records:data,
  columns,
  widthMode:'standard',
  hover:{
    highlightMode:'row'
  },
  sortState:{
    field:'230517143221023',
    order:'asc'
  }
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
