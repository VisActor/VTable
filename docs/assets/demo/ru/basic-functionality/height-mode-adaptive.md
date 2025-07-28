---
категория: примеры
группа: Основные Функции
заголовок: Row Height Mode - Fits Container Width
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-adaptive.png
порядок: 3-5
ссылка: basic_function/row_height_column_width
опция: ListTable#heightMode
---

# Row Height Mode - Fits to Container Height

Table row height fits container height

## Ключевые Конфигурации

- `heightMode: 'adaptive'`

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
  .then(res => res.json())
  .then(data => {
    data = data.slice(0, 10);
    const columns = [
      {
        field: '230517143221027',
        title: 'ИД Заказа',
        width: 'auto'
      },
      {
        field: '230517143221030',
        title: 'ИД Клиента',
        width: 'auto'
      },
      {
        field: '230517143221032',
        title: 'Название Товара',
        width: 'auto'
      },
      {
        field: '230517143221023',
        title: 'Категория',
        width: 'auto'
      },
      {
        field: '230517143221034',
        title: 'Подкатегория',
        width: 'auto'
      },
      {
        field: '230517143221037',
        title: 'Регион',
        width: 'auto'
      },
      {
        field: '230517143221024',
        title: 'Город',
        width: 'auto'
      },
      {
        field: '230517143221029',
        title: 'Дата Заказа',
        width: 'auto'
      },
      {
        field: '230517143221042',
        title: 'Количество',
        width: 'auto'
      },
      {
        field: '230517143221040',
        title: 'Продажи',
        width: 'auto'
      },
      {
        field: '230517143221041',
        title: 'Прибыль',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      heightMode: 'adaptive'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
