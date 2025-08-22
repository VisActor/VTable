---
категория: примеры
группа: Animation
заголовок: Appear Animation
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/appear-animation.gif
опция: ListTable-columns-text#animationAppear
---

# Entry animation

Initialize the table with an entrance animation.

## Key configuration

- `animationAppear` Entry animation configuration
  - `type` Entry animation type, currently supports `all` and `one-by-one`
  - `direction` Entry animation direction, currently supports `row` and `column`
  - `duration` The duration of a single animation, in milliseconds, `one-by-one`, the duration of one animation
  - `delay` Animation delay, in milliseconds; `one-by-one` is the time difference between two animations, `all` is the delay of all animations

## Демонстрация кодаnstration

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Категория",
        "title": "Категория",
        "width": "auto",
    },
    {
        "field": "Sub-Категория",
        "title": "Sub-Категория",
        "width": "auto",
    },
    {
        "field": "ИД Заказа",
        "title": "ИД Заказа",
        "width": "auto"
    },
    {
        "field": "ИД Клиента",
        "title": "ИД Клиента",
        "width": "auto"
    },
    {
        "field": "Название Товара",
        "title": "Название Товара",
        "width": "auto",
    },
    {
        "field": "Регион",
        "title": "Регион",
        "width": "auto"
    },
    {
        "field": "Город",
        "title": "Город",
        "width": "auto"
    },
    {
        "field": "Дата Заказа",
        "title": "Дата Заказа",
        "width": "auto"
    },
    {
        "field": "Количество",
        "title": "Количество",
        "width": "auto"
    },
    {
        "field": "Продажи",
        "title": "Продажи",
        "width": "auto"
    },
    {
        "field": "Прибыль",
        "title": "Прибыль",
        "width": "auto"
    }
];

const option = {
  records:data.slice(0,20),
  columns,
  widthMode:'standard',
  animationAppear: {
      duration: 300,
      delay: 100,
      type: 'one-by-one', // all
      direction: 'row' // colunm
    }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
