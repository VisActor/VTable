---
категория: примеры
группа: Interaction
заголовок: Copy and paste cell value
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/copy-paste-cell-value.gif
ссылка: interaction/keyboard
опция: ListTable#keyboardOptions.pasteValueToCell
---

# Copy and paste cell value

Use shortcut keys to copy the contents of the selected cell and paste the contents of the clipboard into the cell.

Please configure the following two configuration items to be true!
- keyboardOptions.pasteValueToCell
- keyboardOptions.copySelected

Note: VTable has been verified internally, and only editable cells are allowed to be pasted. Therefore, in the business scenario where pasting is required, please ensure that an editor is configured. The editor supports configuring empty strings (that is, non-existent editors).

Other shortcut keys refer to [Tutorial](../../guide/shortcut).

## Ключевые Конфигурации

- keyboardOptions.pasteValueToCell
- keyboardOptions.copySelected

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
      frozenColCount: 1,
      overscrollBehavior: 'none',
      keyboardOptions: {
        moveEditCellOnArrowKeys: true,
        copySelected: true,
        pasteValueToCell: true
      },
      editor: '' // Configure an empty editor that can be pasted into cells everywhere
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
