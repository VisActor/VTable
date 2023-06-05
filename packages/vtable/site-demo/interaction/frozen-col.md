---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 基本表格

选中单元格 配置选中效果

## 关键配置

 - `allowFrozenColCount`  可选做冻结的前几列 默认0
 - `frozenColCount`  初始冻结列数 默认0
 - `showPin` 是否显示冻结图标 默认true

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
  allowFrozenColCount: 3,
  frozenColCount: 1,
  showPin: true
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
