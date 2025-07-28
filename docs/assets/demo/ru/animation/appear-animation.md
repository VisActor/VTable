---
категория: примеры
группа: Animation
заголовок: Appear Animation
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/appear-animation.gif
опция: списоктаблица-columns-текст#animationAppear
---

# Entry animation

Initialize the таблица с an entrance animation.

## Key configuration

- `animationAppear` Entry animation configuration
  - `тип` Entry animation тип, currently supports `все` и `one-по-one`
  - `direction` Entry animation direction, currently supports `row` и `column`
  - `duration` The duration из a single animation, в milliseconds, `one-по-one`, the duration из one animation
  - `delay` Animation delay, в milliseconds; `one-по-one` is the time difference between two animations, `все` is the delay из все animations

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица

let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные100.json')
    .then((res) => res.json())
    .then((данные) => {

const columns =[
  {
        "поле": "Категория",
        "title": "Категория",
        "ширина": "авто",
    },
    {
        "поле": "Sub-Категория",
        "title": "Sub-Категория",
        "ширина": "авто",
    },
    {
        "поле": "ID Заказа",
        "title": "ID Заказа",
        "ширина": "авто"
    },
    {
        "поле": "пользовательскийer ID",
        "title": "пользовательскийer ID",
        "ширина": "авто"
    },
    {
        "поле": "Product имя",
        "title": "Product имя",
        "ширина": "авто",
    },
    {
        "поле": "Регион",
        "title": "Регион",
        "ширина": "авто"
    },
    {
        "поле": "Город",
        "title": "Город",
        "ширина": "авто"
    },
    {
        "поле": "Дата Заказа",
        "title": "Дата Заказа",
        "ширина": "авто"
    },
    {
        "поле": "Количество",
        "title": "Количество",
        "ширина": "авто"
    },
    {
        "поле": "Продажи",
        "title": "Продажи",
        "ширина": "авто"
    },
    {
        "поле": "Прибыль",
        "title": "Прибыль",
        "ширина": "авто"
    }
];

const option = {
  records:данные.slice(0,20),
  columns,
  ширинаMode:'standard',
  animationAppear: {
      duration: 300,
      delay: 100,
      тип: 'one-по-one', // все
      direction: 'row' // colunm
    }
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
    })
```
