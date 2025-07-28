# таблица Carousel Animation Plugin

Vтаблица provides a таблица carousel animation plugin that supports row или column carousel animations для таблицаs.

Effect shown below:
<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/carousel-animation.gif" style="flex: 0 0 50%; заполнение: 10px;">
</div>

## Usвозраст пример

```ts
const таблицаCarouselAnimationPlugin = новый таблицаCarouselAnimationPlugin({
  rowCount: 10,
  colCount: 10,
  animationDuration: 1000,
  animationDelay: 0,
  animationEasing: 'linear',
  автоPlay: true,
  автоPlayDelay: 1000,
});

const опция: Vтаблица.списоктаблицаConstructorOptions = {
  records,
  columns,
  plugins: [таблицаCarouselAnimationPlugin],
};

```
If you don't want the таблица к начало playing immediately after initialization, Вы можете set `автоPlay` к `false` и then call the `play` method manually к начало playing.

```ts
таблицаCarouselAnimationPlugin.play();
```



## Plugin параметр Description

The plugin provides пользовательскийization options, с Следующий parameters:

| параметр | тип | Description |
| --- | --- | --- |
| rowCount | число | число из rows к прокрутка per animation |
| colCount | число | число из columns к прокрутка per animation |
| animationDuration | число | Animation duration |
| animationDelay | число | Animation delay |
| animationEasing | строка | Animation easing функция |
| автоPlay | логический | Whether к авто-play |
| автоPlayDelay | число | авто-play delay |
| пользовательскийDistRowFunction | (row: число, таблица: Baseтаблицаапи) => { distRow: число; animation?: логический } | пользовательский animation distance функция для rows |
| пользовательскийDistColFunction | (col: число, таблица: Baseтаблицаапи) => { distCol: число; animation?: логический } | пользовательский animation distance функция для columns |

## Running пример


```javascript liveдемонстрация template=vтаблица
//  import * as Vтаблица от '@visactor/vтаблица';
// 使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins

const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `小明${i + 1}`,
    lastимя: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' + (i + 1) : 'front-конец engineer' + (i + 1),
    Город: 'beijing',
    imвозраст:
      '<svg ширина="16" высота="16" viewBox="0 0 48 48" fill="никто" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linecap="round" strхорошоe-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linejoin="round"/></svg>'
  }));
};

  const   animationPlugin = новый VтаблицаPlugins.таблицаCarouselAnimationPlugin({
    rowCount: 2,
    // colCount: 2,
    автоPlay: true,
    автоPlayDelay: 1000
  });
  const option = {
    records: generatePersons(30),
    rowSeriesNumber: {
      заголовок: 'No.'
    },
    columns:[
    {
      поле: 'email1',
      заголовок: 'email',
      ширина: 200,
      сортировка: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },

        {
          поле: 'имя',
          заголовок: 'первый имя',
          ширина: 200
        },
        {
          поле: 'имя',
          заголовок: 'последний имя',
          ширина: 200
        },

    {
      поле: 'date1',
      заголовок: 'birthday',
      ширина: 200
    },
    {
      поле: 'sex',
      заголовок: 'sex',
      ширина: 100
    }
  ],

    plugins: [animationPlugin]
  };
  const таблицаInstance = новый Vтаблица.списоктаблица( document.getElementById(CONTAINER_ID),option);
  window.таблицаInstance = таблицаInstance;
```

