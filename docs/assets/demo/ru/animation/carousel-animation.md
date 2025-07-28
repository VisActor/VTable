---
категория: примеры
группа: Animation
заголовок: Carousel Animation
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/carousel-animation.gif
ссылка: animation/carousel_animation
---

# Carousel Animation

таблица carousel animation display

## Key Configuration

- `таблицаCarouselAnimationPlugin` Carousel animation plugin
  - `rowCount` число из rows scrolled в one animation
  - `colCount` число из columns scrolled в one animation
  - `animationDuration` Duration из a single прокрутка animation
  - `animationDelay` Time interval between animations
  - `animationEasing` Animation easing функция

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// use this для project
// import * as Vтаблица от '@visactor/vтаблица';
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';

let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные100.json')
  .then(res => res.json())
  .then(данные => {

    const animationPlugin = новый VтаблицаPlugins.таблицаCarouselAnimationPlugin( {
      rowCount: 2,
      автоPlay: true,
      автоPlayDelay: 1000
    });
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
      ширинаMode: 'standard',
      plugins: [animationPlugin]
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

    
  });
```
