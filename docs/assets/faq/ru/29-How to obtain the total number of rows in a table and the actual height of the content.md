---
заголовок: 7. Vтаблица usвозраст issue: How к obtain the total число из rows в a таблица и the actual высота из the content</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к get the total число из rows в the таблица и the actual высота из the content</br>


## Problem Description

How к obtain the total число из rows в the текущий таблица и the actual высота из the content от the таблица instance through the апи</br>


## Solution 

1. 1. The `colCount` и `rowCount` attributes в the таблица instance can obtain the число из rows и columns из the текущий таблица.</br>
1. The таблица пример provides методы `getAllRowsвысота` и `getAllColsширина`, which can obtain the total column ширина и total row высота из the текущий таблица content.</br>


## код пример

```
const таблицаInstance = новый Vтаблица.списоктаблица(container, option);

console.log(таблицаInstance.colCount);
console.log(таблицаInstance.rowCount);
console.log(таблицаInstance.getAllRowsвысота());
console.log(таблицаInstance.getAllColsширина());</br>
```
## Results display 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BkY5bNB5IoJy9fxfzXrcR2CRnud.gif' alt='' ширина='1662' высота='1044'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MS4wbCflioPjNBxiGoMcHeGQnng.gif' alt='' ширина='246' высота='152'>

Complete sample код (Вы можете paste it into the [editor](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree) к try it out):</br>
```
let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
    .then((res) => res.json())
    .then((данные) => {

const columns =[
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
        "ширина": "авто"
    },
    {
        "поле": "Категория",
        "title": "Категория",
        "ширина": "авто"
    },
    {
        "поле": "Sub-Категория",
        "title": "Sub-Категория",
        "ширина": "авто"
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
  records:данные,
  columns,
  ширинаMode:'standard'
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;

console.log(таблицаInstance.colCount);
console.log(таблицаInstance.rowCount);
console.log(таблицаInstance.getAllRowsвысота());
console.log(таблицаInstance.getAllColsширина());
    })</br>
```
## Related documents

Related апи：</br>
https://www.visactor.io/vтаблица/апи/свойства#rowCount</br>
https://www.visactor.io/vтаблица/апи/свойства#colCount</br>
https://www.visactor.io/vтаблица/апи/методы#getAllColsширина</br>
https://www.visactor.io/vтаблица/апи/методы#getAllRowsвысота</br>
github：https://github.com/VisActor/Vтаблица</br>



