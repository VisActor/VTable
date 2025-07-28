---
категория: примеры
группа: базовый возможности
заголовок: Line Wrapping
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/авто-wrap-текст.gif
порядок: 3-1
ссылка: базовый_function/авто_wrap_text
опция: списоктаблица#автоWrapText
---

# line wrapping

авто-wrap is turned на. When the column ширина changes, the текст will автоmatically calculate the display content according к the ширина. When using this функция, you need к set `высотаMode: 'автовысота'` к display the wrapped текст.

## Ключевые Конфигурации

- 'автоWrapText: true 'включить line wrapping

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион'
      },
      {
        поле: 'Город',
        заголовок: 'Город'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      автоWrapText: true,
      высотаMode: 'автовысота',
      defaultColширина: 150
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
