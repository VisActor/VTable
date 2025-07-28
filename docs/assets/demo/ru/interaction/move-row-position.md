---
категория: примеры
группа: Interaction
заголовок: move row position
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/row-series-number.gif
ссылка: table_type/List_table/list_table_define_and_generate
опция: ListTable#rowSeriesNumber.dragOrder
---

# Move Row Position

The row numbering capability refers to adding a unique serial number or identifier to each row of the table to mark, Сортировка or reference the rows in the table. This demo will demonstrate the VTable row numbering capabilities: row selection, row dragging position, and row numbering style configuration.

## Ключевые Конфигурации

-`ListTable.rowSeriesNumber`

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
      records: data,
      columns,
      widthMode: 'standard',
      rowSeriesNumber: {
        title: '序号',
        width: 'auto',
        dragOrder: true,
        headerStyle: {
          color: 'black',
          bgColor: 'pink'
        },
        style: {
          color: 'red'
        }
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
