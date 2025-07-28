---
категория: примеры
группа: Interaction
заголовок: выбрать Highlight Effect
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/выбрать-highlight.png
ссылка: interaction/выбрать
опция: списоктаблица#выбрать
---

# выбрать the cell row к highlight the effect

Нажать на the cell, the entire row или column will be highlighted when the cell is selected. If more than one cell is selected, the highlight effect will disappear.

The highlighted style can be configured в the style. Global configuration: `тема.selectionStyle`, или it can be configured separately для the header и body. для specific configuration методы, please refer к the tutorial.

## Ключевые Конфигурации

- `выбрать: {
  highlightMode: 'cross'
}`

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
      выбрать: {
        highlightMode: 'cross'
      },
      тема: Vтаблица.темаs.ARCO.extends({
        selectionStyle: {
          cellBgColor: 'rgba(130, 178, 245, 0.2)',
          cellBorderLineширина: 2,
          inlineRowBgColor: 'rgb(160,207,245)',
          inlineColumnBgColor: 'rgb(160,207,245)'
        },
        headerStyle: {
          выбрать: {
            inlineRowBgColor: 'rgb(0,207,245)',
            inlineColumnBgColor: 'rgb(0,207,245)'
          }
        }
      })
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
