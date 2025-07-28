---
категория: примеры
группа: базовый возможности
заголовок: Column ширина Mode - Adapt к Content
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/ширина-mode-автоширина.png
порядок: 3-6
ссылка: базовый_function/row_высота_column_ширина
опция: списоктаблица#ширинаMode
---

# Column ширина Mode - Adapt к Content

Specifies the ширина размер из все columns по content ширина.

## Ключевые Конфигурации

- `ширинаMode: 'автоширина'`

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
        ширина: 100
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
      ширинаMode: 'автоширина'
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
