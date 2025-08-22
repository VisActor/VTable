---
заголовок: How к set the текст style из the Vтаблица таблица компонент?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к set текст style для Vтаблица компонент?</br>
## Problem description

What текст styles are supported и how к configure them when using the Vтаблица таблица компонент?</br>
## Solution

Vтаблица supports Следующий текст styles:</br>
*  `fontSize `: The шрифт размер из the текст.</br>
*  `FontFamily `: шрифт used для текст. Multiple fonts can be specified, such as `Arial, sans-serif `, и the browser will search и use them в the specified order.</br>
*  `FontWeight `: Set шрифт thickness.</br>
*  `FontVariant `: Sets the шрифт variant.</br>
*  `fontStyle `: Set шрифт style.</br>
The places where Vтаблица supports setting текст styles are:</br>
*  `Column (row/indicator) `, configure the style corresponding к the column (row/indicator)</br>
*  `Style `: The style corresponding к the content cell</br>
*  `headerStyle `: the style corresponding к the header cell</br>
*  `в тема `, configure the тема style</br>
*  `defaultStyle `: по умолчанию style</br>
*  `bodyStyle `: таблица content area style</br>
*  `headerStyle `: header (список)/список header (сводный таблица) style</br>
*  `rowHeaderStyle `: Row header style</br>
*  `cornerHeaderStyle `: corner head style</br>
*  `bottomFrozenStyle `: низ frozen cell style</br>
*  `rightFrozenStyle `: Freeze cell style на the право</br>


## код пример

Вы можете paste it into the official website editor для testing: [https://visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица)</br>
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
        style: {
            fontSize: 14
        },
        headerStyle: {
            fontSize: 16,
            fontFamily: 'Verdana'
        }
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
    }
];

const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  тема: Vтаблица.темаs.по умолчанию.extends({
    bodyStyle: {
        fontSize: 12
    },
    headerStyle: {
        fontSize: 18
    }
  })
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
    })</br>
```
## Related Documents

Related апи: https://visactor.io/vтаблица/option/списоктаблица-columns-текст#style.fontSize</br>
github：https://github.com/VisActor/Vтаблица</br>



