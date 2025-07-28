---
заголовок: How к автоmatically calculate и display the aggregate values из the Vтаблица's сводный таблица?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Title

How к автоmatically calculate и display the aggregate values из the Vтаблица's сводный таблица?</br>
## Description

Why is the aggregate node данные не displayed after the сводный таблица is set к display в tree structure?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DhKzbArAKohl8lx6QwicFeRWnvb.gif' alt='' ширина='701' высота='639'>

## Solution 

Aggregation rules need к be configured so that данные can be автоmatically aggregated during данные analysis и the aggregated значение can be used as the display значение из the parent cell.</br>
## код пример

```
  данныеConfig: {
    totals: {
        row: {
          showSubTotals: true,
          subTotalsDimensions: ['Категория'],
          subTotalLabel: 'subtotal'
        }
      }
  },</br>
```
## Results

Online effect reference:https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-analysis-таблица-tree</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/TfUKbUwmVoaKt4xhLw3c4aONnxx.gif' alt='' ширина='1338' высота='416'>

## Related Documents

Tree таблица демонстрация：https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-analysis-таблица-tree</br>
Tutorial на сводный таблица данные analysis：https://visactor.io/vтаблица/guide/данные_analysis/сводный_таблица_данныеAnalysis</br>
Related апи：https://visactor.io/vтаблица/option/сводныйтаблица#данныеConfig.totals</br>
github：https://github.com/VisActor/Vтаблица</br>

