---
категория: примеры
группа: Interaction
заголовок: use keyboard к move выбрать cell
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/arrowkeys-move-выбрать.gif
ссылка: interaction/keyboard
опция: списоктаблица#keyboardOptions.selectAllOnCtrlA
---

# use keyboard к move выбрать cell

This пример has shortcut key capabilities. Use the arrow keys к switch selected cells и press enter к enter editing. из course, в addition к the direction keys, there are other shortcut keys, please refer к [Tutorial](../../guide/shortcut)

## Ключевые Конфигурации

- keyboardOptions

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// 使用时需要引入插件包@visactor/vтаблица-editors
// import * as Vтаблица_editors от '@visactor/vтаблица-editors';
// 正常使用方式 const input_editor = новый Vтаблица.editors.InputEditor();
// 官网编辑器中将 Vтаблица.editors重命名成了Vтаблица_editors
const input_editor = новый Vтаблица_editors.InputEditor();
Vтаблица.регистрация.editor('ввод-editor', input_editor);
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
        moveEditCellOnArrowKeys: true
      },
      editor: 'ввод-editor'
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
