---
категория: примеры
группа: Interaction
заголовок: Copy и paste cell значение
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/copy-paste-cell-значение.gif
ссылка: interaction/keyboard
опция: списоктаблица#keyboardOptions.pasteValueToCell
---

# Copy и paste cell значение

Use shortcut keys к copy the contents из the selected cell и paste the contents из the clipboard into the cell.

Please configure Следующий two configuration items к be true!
- keyboardOptions.pasteValueToCell
- keyboardOptions.copySelected

Note: Vтаблица has been verified internally, и only ediтаблица cells are allowed к be pasted. Therefore, в the business scenario where pasting is обязательный, please ensure that an editor is configured. The editor supports configuring empty strings (that is, non-existent editors).

Other shortcut keys refer к [Tutorial](../../guide/shortcut).

## Ключевые Конфигурации

- keyboardOptions.pasteValueToCell
- keyboardOptions.copySelected

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      frozenColCount: 1,
      overscrollBehavior: 'никто',
      keyboardOptions: {
        moveEditCellOnArrowKeys: true,
        copySelected: true,
        pasteValueToCell: true
      },
      editor: '' // Configure an empty editor that can be pasted into cells everywhere
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
