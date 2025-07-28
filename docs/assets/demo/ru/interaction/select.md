---
категория: примеры
группа: Interaction
заголовок: выбрать cell
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/выбрать.png
ссылка: interaction/выбрать
опция: списоктаблица#keyboardOptions
---

# выбрать cell

Нажать на a cell к make a single selection, и перетаскивание к make a brush selection.

Hold down ctrl или shift к make multiple selections.

Turn на the shortcut key selectAllOnCtrlA configuration к выбрать все.

Нажатьing на the header cell will выбрать the entire row или column по по умолчанию. If you only want к выбрать the текущий cell, Вы можете set `выбрать.headerSelectMode` к `'cell'`, или if you only want к выбрать cells в the body, Вы можете set `выбрать.headerSelectMode` к `'body'`..

## Ключевые Конфигурации

- `keyboardOptions: {
    selectAllOnCtrlA: true,
    copySelected: true
}`
  включить the ctrl + A необязательный функция и shortcut к copy the selected content.

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
      keyboardOptions: {
        selectAllOnCtrlA: true,
        copySelected: true
      },
      тема: Vтаблица.темаs.ARCO.extends({
        selectionStyle: {
          cellBorderLineширина: 2,
          cellBorderColor: '#9900ff',
          cellBgColor: 'rgba(153,0,255,0.2)'
        }
      })
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
