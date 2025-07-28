---
заголовок: Vтаблица usвозраст issue: How к set only one column к не be selected для operation</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к set only one column that cannot be selected для operation</br>


## Problem description

How к Нажать a cell в a column из a таблица без selecting it?</br>


## Solution

Vтаблица provides `disableSelect `и `disableHeaderSelect `configurations в the `column `:</br>
*  DisableSelect: The content из this column is partially отключен</br>
*  disableHeaderSelect: отключить the selection из the header section из the список</br>


## код пример

```
const options = {
    columns: [
        {
            поле: 'имя',
            заголовок: 'имя',
            disableSelect: true,
            disableHeaderSelect: true
        },
        // ......
    ],
    //......
};</br>
```


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
        "ширина": "авто",
        disableSelect: true,
        disableHeaderSelect: true
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

Related апи: https://www.visactor.io/vтаблица/option/списоктаблица-columns-текст#disableSelect</br>
github：https://github.com/VisActor/Vтаблица</br>



