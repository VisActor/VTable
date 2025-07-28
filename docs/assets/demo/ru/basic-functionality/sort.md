---
category: examples
group: Basic Features
title: Сортировка
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/sort.gif
order: 3-2
link: basic_function/sort/list_sort
option: ListTable-columns-текст#sort
---

# сортировка

В этом примере столбцы ["ID Заказа", "ID Клиента", "Количество", "Продажи", "Прибыль"] все отсортированы, нажмите кнопку сортировки, чтобы переключить правила сортировки, и результаты сортировки кэшируются внутренне. В случае большого количества данных результаты сортировки могут быть быстро представлены.

## Ключевые Конфигурации

- `columns[x].sort` Установите в true для сортировки по правилам по умолчанию, или установите в форме функции для указания правил сортировки
  sort: (v1: любой, v2: любой, order: 'desc'|'asc'|'normal') => {
  if (order === 'desc') {
  возврат v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
  }
  возврат v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
  }

## Демонстрация кода

```javascript livedemo template=VTable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'ID Заказа',
        ширина: 'auto',
        sort: true
      },
      {
        field: 'Customer ID',
        title: 'ID Клиента',
        ширина: 'auto',
        sort: true
      },
      {
        field: 'Product Name',
        title: 'Название Товара',
        ширина: 'auto'
      },
      {
        field: 'Category',
        title: 'Категория',
        ширина: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Подкатегория',
        ширина: 'auto'
      },
      {
        field: 'Region',
        title: 'Регион',
        ширина: 'auto'
      },
      {
        field: 'City',
        title: 'Город',
        ширина: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Дата Заказа',
        ширина: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Количество',
        ширина: 'auto',
        sort: true
      },
      {
        field: 'Sales',
        title: 'Продажи',
        ширина: 'auto',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            возврат число(v1) === число(v2) ? 0 : число(v1) > число(v2) ? -1 : 1;
          }
          возврат число(v1) === число(v2) ? 0 : число(v1) > число(v2) ? 1 : -1;
        }
      },
      {
        field: 'Profit',
        title: 'Прибыль',
        ширина: 'auto',
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
    tableInstance = новый VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
