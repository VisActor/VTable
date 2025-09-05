---
категория: примеры
группа: Основные Функции
заголовок: Column Width Mode - Adapt to Content
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-autoWidth.png
порядок: 3-6
ссылка: basic_function/row_height_column_width
опция: ListTable#widthMode
---

# Column Width Mode - Adapt to Content

Specifies the width size of all columns by content width.

## Ключевые Конфигурации

- `widthMode: 'autoWidth'`

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
        width: 100
      },
      {
        field: 'ИД Клиента',
        title: 'ИД Клиента'
      },
      {
        field: 'Название Товара',
        title: 'Название Товара'
      },
      {
        field: 'Категория',
        title: 'Категория'
      },
      {
        field: 'Подкатегория',
        title: 'Подкатегория'
      },
      {
        field: 'Регион',
        title: 'Регион'
      },
      {
        field: 'Город',
        title: 'Город'
      },
      {
        field: 'Дата Заказа',
        title: 'Дата Заказа'
      },
      {
        field: 'Количество',
        title: 'Количество',
        width: 'auto'
      },
      {
        field: 'Продажи',
        title: 'Продажи',
        width: 'auto'
      },
      {
        field: 'Прибыль',
        title: 'Прибыль',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'autoWidth'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
