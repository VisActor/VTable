---
category: examples
group: Основные функции
title: Объединение ячеек
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/merge.png
option: ListTable-columns-текст#mergeCell
---

# Объединение ячеек

Автоматическое объединение ячеек с одинаковым содержимым через конфигурацию

## Ключевые конфигурации

*   `mergeCell`  Объединить соседние ячейки с одинаковым содержимым в одном столбце

## Демонстрация кода

```javascript livedemo template=VTable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Category",
        "title": "Category",
        "ширина": "auto",
        sort:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'право'
          // textBaseline:"низ"
        }
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "ширина": "auto",
        sort:true,
        "mergeCell": true,
    },
    {
        "field": "Order ID",
        "title": "Order ID",
        "ширина": "auto"
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "ширина": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "ширина": "auto",
        headerStyle:{
          "textStick":true,
        }
    },
    {
        "field": "Region",
        "title": "Region",
        "ширина": "auto"
    },
    {
        "field": "City",
        "title": "City",
        "ширина": "auto"
    },
    {
        "field": "Order Date",
        "title": "Order Date",
        "ширина": "auto"
    },
    {
        "field": "Quantity",
        "title": "Quantity",
        "ширина": "auto"
    },
    {
        "field": "Sales",
        "title": "Sales",
        "ширина": "auto"
    },
    {
        "field": "Profit",
        "title": "Profit",
        "ширина": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  навести:{
    highlightMode:'row'
  },
  sortState:{
    field:'Category',
    order:'asc'
  }
};
tableInstance = новый VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    })
```
