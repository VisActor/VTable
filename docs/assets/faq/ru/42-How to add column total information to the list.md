---
заголовок: Vтаблица usвозраст issue: How к add column total information к the список</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к add column total information к the список</br>


## Problem description

в the список, you hope к display the total information из a column, such as sum, averвозраст, etc.</br>


## Solution

Vтаблица provides `aggregation `configuration для configuring данные aggregation rules и display positions в the таблица. Вы можете configure `aggregation `к specify global rules для aggregation в options, или configure `aggregation `к specify aggregation rules для каждый column. Следующий свойства need к be configured в `aggregation `:</br>
*  aggregationType: </br>
*  Sum, set `aggregationType `к `AggregationType. SUM`</br>
*  Averвозраст, set `aggregationType `к `AggregationType. AVG`</br>
*  Maximum значение, set `aggregationType `к `AggregationType. MAX`</br>
*  Minimum, set `aggregationType `к `AggregationType. MIN`</br>
*  Count, set `aggregationType `к `AggregationType. COUNT`</br>
*  пользовательский функция, set `aggregationType `к `AggregationType. пользовательский `, set пользовательский aggregation logic through `aggregationFun `</br>
*  aggregationFun: пользовательский aggregation logic when `aggregationType is AggregationType. пользовательский `</br>
*  showOnTop: Controls the display позиция из the aggregated results. The по умолчанию is `false `, which means the aggregated results are displayed в the низ из the body. If set к `true `, the aggregated results are displayed в the верх из the body.</br>
*  FormatFun: Set the formatting функция из aggregate values, и пользовательскийize the display format из aggregate values.</br>


## код пример

```
const options = {
    //......
    columns: [
      {
        aggregation: [
          {
            aggregationType: Vтаблица.TYPES.AggregationType.MAX,
            // showOnTop: true,
            formatFun(значение) {
              возврат '最高薪资:' + Math.round(значение) + '元';
            }
          }
        ]
      },
      // ......
    ]
};</br>
```


## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VN6mb0xWNoVFvMxpCSPcjpBhndf.gif' alt='' ширина='1690' высота='1064'>

пример код: https://www.visactor.io/vтаблица/демонстрация/список-таблица-данные-analysis/список-таблица-aggregation-multiple</br>
## Related Documents

базовый таблица данные Analysis Tutorial: https://www.visactor.io/vтаблица/guide/данные_analysis/список_таблица_данныеAnalysis</br>
Related апи: https://www.visactor.io/vтаблица/option/списоктаблица#aggregation</br>
github：https://github.com/VisActor/Vтаблица</br>



