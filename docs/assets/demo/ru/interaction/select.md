---
категория: примеры
группа: Interaction
заголовок: Select cell
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/select.png
ссылка: interaction/select
опция: ListTable#keyboardOptions
---

# Select cell

Click on a cell to make a single selection, and drag to make a brush selection.

Hold down ctrl or shift to make multiple selections.

Turn on the shortcut key selectAllOnCtrlA configuration to select all.

Clicking on the header cell will select the entire row or column by default. If you only want to select the current cell, you can set `select.headerSelectMode` to `'cell'`, Or if you only want to select cells in the body, you can set `select.headerSelectMode` to `'body'`..

## Ключевые Конфигурации

- `keyboardOptions: {
    selectAllOnCtrlA: true,
    copySelected: true
}`
  Enable the ctrl + A опцияal function and shortcut to copy the selected content.

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
      keyboardOptions: {
        selectAllOnCtrlA: true,
        copySelected: true
      },
      theme: VTable.themes.ARCO.extends({
        selectionStyle: {
          cellBorderLineWidth: 2,
          cellBorderColor: '#9900ff',
          cellBgColor: 'rgba(153,0,255,0.2)'
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
