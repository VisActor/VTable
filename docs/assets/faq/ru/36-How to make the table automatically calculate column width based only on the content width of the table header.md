---
заголовок: Vтаблица usвозраст issue: How к make the таблица автоmatically calculate column ширина based only на the content ширина из the таблица header</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к make the таблица автоmatically calculate column ширина based only на the content ширина из the таблица header</br>


## Problem description

в автоmatic ширина mode, you want the ширина из a column к be determined only по the content ширина из the header cell и не affected по the content cell.</br>


## Solution

Vтаблица provides `columnширинаComputeMode `configuration для specifying the bounded areas that are involved в content ширина calculations:</br>
*  'Only-header ': Only the header content is calculated.</br>
*  'Only-body ': Only calculate the content из the body cell.</br>
*  'Normal ': Calculate normally, that is, calculate the contents из the header и body cells.</br>


## код пример

```
const options = {
    //......
    columnширинаComputeMode: 'only-header'
};</br>
```


## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/LJk6bcmw3oJM5DxjJkHch69GnMd.gif' alt='' ширина='758' высота='1048'>

Full sample код (Вы можете try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree)):</br>
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
    }
];

const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  columnширинаComputeMode: 'only-header'
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
    })</br>
```
## Related Documents

Related апи: https://www.visactor.io/vтаблица/option/списоктаблица # columnширинаComputeMode</br>
github：https://github.com/VisActor/Vтаблица</br>



