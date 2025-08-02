---
категория: примеры
группа: Основные Функции
заголовок: Сортировка
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/Сортировка.gif
порядок: 3-2
ссылка: basic_function/Сортировка/list_Сортировка
опция: ListTable-columns-text#Сортировка
---

# Сортировка

В этом примере столбцы ["ИД Заказа", "ИД Клиента", "Количество", "Продажи", "Прибыль"] все отсортированы, нажмите кнопку сортировки, чтобы переключить правила сортировки, и результаты сортировки кэшируются внутренне. В случае большого количества данных результаты сортировки могут быть быстро представлены.

## Ключевые Конфигурации

- `columns[x].sort` Установите в true для сортировки по правилам по умолчанию, или установите в форме функции для указания правил сортировки
  sort: (v1: any, v2: any, order: 'desc'|'asc'|'normal') => {
  if (order === 'desc') {
  return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
  }
  return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
  }

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'ИД Заказа',
        title: 'ИД Заказа',
        width: 'auto',
        sort: true
      },
      {
        field: 'ИД Клиента',
        title: 'ИД Клиента',
        width: 'auto',
        sort: true
      },
      {
        field: 'Название Товара',
        title: 'Название Товара',
        width: 'auto'
      },
      {
        field: 'Категория',
        title: 'Категория',
        width: 'auto'
      },
      {
        field: 'Подкатегория',
        title: 'Подкатегория',
        width: 'auto'
      },
      {
        field: 'Регион',
        title: 'Регион',
        width: 'auto'
      },
      {
        field: 'Город',
        title: 'Город',
        width: 'auto'
      },
      {
        field: 'Дата Заказа',
        title: 'Дата Заказа',
        width: 'auto'
      },
      {
        field: 'Количество',
        title: 'Количество',
        width: 'auto',
        sort: true
      },
      {
        field: 'Продажи',
        title: 'Продажи',
        width: 'auto',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return Number(v1) === Number(v2) ? 0 : Number(v1) > Number(v2) ? -1 : 1;
          }
          return Number(v1) === Number(v2) ? 0 : Number(v1) > Number(v2) ? 1 : -1;
        }
      },
      {
        field: 'Прибыль',
        title: 'Прибыль',
        width: 'auto',
        sort: true
      }
    ];

    const option = {
      records: data,
      columns,
      sortState: {
        field: 'Продажи',
        order: 'asc'
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
