---
категория: примеры
группа: компонент
заголовок: empty tip
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/empty-tip.png
ссылка: компонентs/empty-tip
опция: списоктаблица#emptyTip
---

# Empty Tip

When `emptyTip` is configured, when the таблица данные is empty, an empty данные prompt will be displayed. Вы можете configure the prompt текст, prompt иконка, prompt style, etc.

## Ключевые Конфигурации

- `emptyTip` Configure empty данные prompt. для details, please refer к: https://www.visactor.io/vтаблица/option/списоктаблица#emptyTip

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;

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
    ширина: '200'
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
  columns,
  ширинаMode: 'standard',
  Подсказка: {
    isShowOverflowTextПодсказка: true
  },
  emptyTip: {
    текст: 'no данные records'
  }
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
