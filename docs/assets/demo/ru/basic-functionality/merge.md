---
категория: примеры
группа: Основные Функции
заголовок: Merge Cells
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/merge.png
опция: ListTable-columns-text#mergeCell
---

# Merge cells

Automatically merge cells with the same content through configuration

## Ключевые Конфигурации

*   `mergeCell`  Merge adjacent cells with the same content in the same column

## Демонстрация кода

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Категория",
        "title": "Категория",
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
        "field": "Sub-Категория",
        "title": "Sub-Категория",
        "width": "auto",
        sort:true,
        "mergeCell": true,
    },
    {
        "field": "ИД Заказа",
        "title": "ИД Заказа",
        "width": "auto"
    },
    {
        "field": "ИД Клиента",
        "title": "ИД Клиента",
        "width": "auto"
    },
    {
        "field": "Название Товара",
        "title": "Название Товара",
        "width": "auto",
        headerStyle:{
          "textStick":true,
        }
    },
    {
        "field": "Регион",
        "title": "Регион",
        "width": "auto"
    },
    {
        "field": "Город",
        "title": "Город",
        "width": "auto"
    },
    {
        "field": "Дата Заказа",
        "title": "Дата Заказа",
        "width": "auto"
    },
    {
        "field": "Количество",
        "title": "Количество",
        "width": "auto"
    },
    {
        "field": "Продажи",
        "title": "Продажи",
        "width": "auto"
    },
    {
        "field": "Прибыль",
        "title": "Прибыль",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  hover:{
    highlightMode:'row'
  },
  sortState:{
    field:'Категория',
    order:'asc'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    })
```
