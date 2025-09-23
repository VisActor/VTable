---
заголовок: Vтаблица usвозраст issue: How к implement перетаскивание-и-отпускание adjustment из line-высота</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к implement перетаскивание-и-отпускание adjustment из line-высота</br>


## Problem description

перетаскивание the низ граница из the cell к adjust the line-высота из the row.</br>


## Solution

`Option `в the `rowResizeMode `configuration can включить или отключить the line-высота adjustment функция:</br>
*  `все `: The entire column, including the cells в the head и body, can adjust the column ширина/line-высота</br>
*  `никто `: Cannot adjust column ширина/line-высота</br>
*  `Header `: Column ширина/line-высота can only be adjusted в the header unit</br>
*  `Body `: Column ширина/line-высота can only be adjusted в body cells</br>
`rowResizeType `configuration controls the scope из adjustment:</br>
*  `Column `/ `row `: по умолчанию значение, only adjust the ширина из the текущий column/row;</br>
*  `Indicator `: Adjust the column ширина/line-высота из the same indicator column together;</br>
*  `все `: Adjust the column ширина/line-высота из все columns together;</br>
*  `Indicator Group `: The indicator column из the same group is adjusted together. для пример, there are two indicators under the northeast dimension значение: Продажи и Прибыль. When adjusting the column ширина из Продажи, the Прибыль column will also be adjusted.</br>


## код пример

```
const option = {
  rowResizeType: 'row',
  rowResizeMode: 'все',
  // ......
};
таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID),option);</br>
```
## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XboMbfwN7ouBLKxxgJdc833pn1c.gif' alt='' ширина='1336' высота='792'>

Complete пример: https://www.visactor.io/vтаблица/демонстрация/interaction/изменение размера-row-высота</br>


## Related Documents

Line-высота column ширина adjustment: https://www.visactor.io/vтаблица/guide/interaction/resize_column_ширина</br>
Related апи: https://www.visactor.io/vтаблица/option/списоктаблица#rowResizeMode</br>
github：https://github.com/VisActor/Vтаблица</br>



