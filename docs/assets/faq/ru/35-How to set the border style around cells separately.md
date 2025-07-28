---
заголовок: Vтаблица usвозраст issue: How к set the граница style around cells separately</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к set the граница style around cells separately</br>


## Problem description

How к set the граница styles around cells separately к achieve a граница с only upper и lower cell borders, без лево и право borders.</br>


## Solution

The cell styles в the таблица, whether в the column style или тема, support configuring the cell граница-related configurations as arrays, representing the граница styles в the верх, право, низ, и лево directions, respectively</br>


## код пример

```
const option = {
  columns: [
    {
      // ...
      style: {
        cellBorderLineширина: [1, 0, 1, 0]
        // ...
      }
    }
  ]
  // ...
}</br>
```
## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KH5zbH7raowoagxDdRscq9R6nNd.gif' alt='' ширина='1698' высота='1082'>



Complete sample код (Вы можете try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree)):</br>
```
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
      тема: {
        headerStyle: {
          borderLineширина: [1, 0, 1, 0]
        },
        bodyStyle: {
          borderLineширина: [1, 0, 1, 0]
        }
      }
      // тема: Vтаблица.темаs.SIMPLIFY
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });</br>
```
## Related Documents

Related апи: https://www.visactor.io/vтаблица/option/списоктаблица#тема.bodyStyle.borderColor</br>
github：https://github.com/VisActor/Vтаблица</br>



