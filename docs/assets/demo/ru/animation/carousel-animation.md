---
категория: примеры
группа: Animation
заголовок: Carousel Animation
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/carousel-animation.gif
ссылка: animation/carousel_animation
---

# Carousel Animation

Table carousel animation display

## Key Configuration

- `TableCarouselAnimationPlugin` Carousel animation plugin
  - `rowCount` Number of rows scrolled in one animation
  - `colCount` Number of columns scrolled in one animation
  - `animationDuration` Duration of a single scroll animation
  - `animationDelay` Time interval between animations
  - `animationEasing` Animation easing function

## Демонстрация кода

```javascript livedemo template=vtable
// use this for project
// import * as VTable from '@visactor/vtable';
// import * as VTablePlugins from '@visactor/vtable-plugins';

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
  .then(res => res.json())
  .then(data => {

    const animationPlugin = new VTablePlugins.TableCarouselAnimationPlugin( {
      rowCount: 2,
      autoPlay: true,
      autoPlayDelay: 1000
    });
    const columns = [
      {
        field: 'Категория',
        title: 'Категория',
        width: 'auto'
      },
      {
        field: 'Подкатегория',
        title: 'Подкатегория',
        width: 'auto'
      },
      {
        field: 'ИД Заказа',
        title: 'ИД Заказа',
        width: 'auto'
      },
      {
        field: 'ИД Клиента',
        title: 'ИД Клиента',
        width: 'auto'
      },
      {
        field: 'Название Товара',
        title: 'Название Товара',
        width: 'auto'
      },
      {
        field: 'Регион',
        title: 'Регион',
        width: 'auto'
      },
      {
        field: 'Город',
        title: 'Город',
        width: 'auto'
      },
      {
        field: 'Дата Заказа',
        title: 'Дата Заказа',
        width: 'auto'
      },
      {
        field: 'Количество',
        title: 'Количество',
        width: 'auto'
      },
      {
        field: 'Продажи',
        title: 'Продажи',
        width: 'auto'
      },
      {
        field: 'Прибыль',
        title: 'Прибыль',
        width: 'auto'
      }
    ];

    const option = {
      records: data.slice(0, 20),
      columns,
      widthMode: 'standard',
      plugins: [animationPlugin]
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

    
  });
```
