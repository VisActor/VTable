---
заголовок: Vтаблица usвозраст issue: How к списокen к таблица area selection и отменаlation событиеs</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к списокen к the таблица area selection отменаlation событие</br>


## Problem description

Hope к be able к выбрать и отмена событиеs through событиеs (Нажать other areas из the таблица или Нажать outside the таблица).</br>


## Solution

Vтаблица provides `**SELECTED_CLEAR **`событиеs that are triggered after an operation is deselected (и there are no selected areas в the текущий график area)</br>


## код пример

```
const таблицаInstance = новый Vтаблица.списоктаблица(option);
таблицаInstance.на(Vтаблица.списоктаблица.событие_TYPE.SELECTED_CLEAR, () => {
    console.log("selected clear!");
});</br>
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
  columns
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;

таблицаInstance.на(Vтаблица.списоктаблица.событие_TYPE.SELECTED_CLEAR, () => {
    console.log("selected clear!");
});
    })</br>
```
## Related Documents

Related апи: https://www.visactor.io/vтаблица/апи/событиеs#SELECTED_CLEAR</br>
github：https://github.com/VisActor/Vтаблица</br>



