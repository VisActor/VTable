---
категория: примеры
группа: Основные Функции
заголовок: Line Wrapping
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/auto-wrap-text.gif
порядок: 3-1
ссылка: basic_function/auto_wrap_text
опция: ListTable#autoWrapText
---

# line wrapping

Auto-wrap is turned on. When the column width changes, the text will automatically calculate the display content according to the width. When using this function, you need to set `heightMode: 'autoHeight'` to display the wrapped text.

## Ключевые Конфигурации

- 'AutoWrapText: true 'Enable line wrapping

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'ИД Заказа',
        title: 'ИД Заказа'
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
        title: 'Количество'
      },
      {
        field: 'Продажи',
        title: 'Продажи'
      },
      {
        field: 'Прибыль',
        title: 'Прибыль'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      autoWrapText: true,
      heightMode: 'autoHeight',
      defaultColWidth: 150
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
