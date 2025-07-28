---
категория: примеры
группа: Animation
заголовок: прокрутка Animation
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/прокрутка-animation.gif
ссылка: animation/scroll_animation
---

# прокрутка animation

прокрутка к the specified area из ​​the таблица through animation.

## Key configuration

- `animationOption` прокрутка animation configuration
  - `duration` animation duration, unit ms
  - `easing` animation easing функция, defalut `linear`, support `linear`, `quadIn`, `quadOut`, `quadInOut`, `quadInOut`, `cubicIn`, `cubicOut`, `cubicInOut`, `quartIn`, `quartOut`, `quartInOut`, `quintIn`, `quintOut`, `quintInOut`, `backIn`, `backOut`, `backInOut`, `circIn`, `circOut`, `circInOut`, `bounceOut`, `bounceIn`, `bounceInOut`, `elasticIn`, `elasticOut`, `elasticInOut`, `sineIn`, `sineOut`, `sineInOut`, `expoIn`, `expoOut`, `expoInOut`
- `scrollToCell({col, row}, animationOption)` прокрутка к specified cell
- `scrollToRow(row, animationOption)` прокрутка к specified row
- `scrollToCol(col, animationOption)` прокрутка к specified column

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные100.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
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
      records: данные.slice(0, 20),
      columns,
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

    setTimeout(() => {
      таблицаInstance.scrollToCell({ col: 4, row: 5 }, { duration: 500, easing: 'quadIn' });
    }, 2000);
  });
```
