---
категория: примеры
группа: Interaction
заголовок: Select Highlight Effect
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/select-highlight.png
ссылка: interaction/select
опция: ListTable#select
---

# Select the cell row to highlight the effect

Click on the cell, the entire row or column will be highlighted when the cell is selected. If more than one cell is selected, the highlight effect will disappear.

The highlighted style can be configured in the style. Global configuration: `theme.selectionStyle`, or it can be configured separately for the header and body. For specific configuration methods, please refer to the tutorial.

## Ключевые Конфигурации

- `select: {
  highlightMode: 'cross'
}`

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
      select: {
        highlightMode: 'cross'
      },
      theme: VTable.themes.ARCO.extends({
        selectionStyle: {
          cellBgColor: 'rgba(130, 178, 245, 0.2)',
          cellBorderLineWidth: 2,
          inlineRowBgColor: 'rgb(160,207,245)',
          inlineColumnBgColor: 'rgb(160,207,245)'
        },
        headerStyle: {
          select: {
            inlineRowBgColor: 'rgb(0,207,245)',
            inlineColumnBgColor: 'rgb(0,207,245)'
          }
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
