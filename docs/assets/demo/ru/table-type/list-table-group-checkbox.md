---
категория: примеры
группа: table-type
заголовок: Basic table группаing checkbox
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-группа-checkbox.gif
порядок: 1-2
ссылка: table_type/List_table/группа_list
опция: ListTable#группаBy
---

# Basic table группаing checkbox

Basic table группаing checkbox. If enabled, checkbox will be displayed in the left of группа заголовок, and it will be synced with the children checkbox.

## Key configuration

- enableTreeCheckbox: enable группа заголовок checkbox function

## Демонстрация кодаnstration

```javascript livedemo template=vtable
const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'ИД Заказа',
        title: 'ИД Заказа',
        width: 'auto'
      },
      {
        field: 'ИД Клиента',
        title: 'ИД Клиента',
        width: 'auto'
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
      records: data.slice(0, 100),
      columns,
      widthMode: 'standard',
      groupBy: ['Категория', 'Подкатегория', 'Регион'],
      rowSeriesNumber: {
        width: 50,
        format: () => {
          return '';
        },
        cellType: 'checkbox',
        enableTreeCheckbox: true
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
  })
  .catch(e => {
    console.error(e);
  });
```
