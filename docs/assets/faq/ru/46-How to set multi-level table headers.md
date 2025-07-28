---
заголовок: Vтаблица usвозраст issue: How к set multi-level таблица headers</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к set up multi-level headers</br>


## Problem description

How к configure headers к achieve multi-level header grouping effect</br>


## Solution

в the `column `configuration в Vтаблица, it supports specifying the subordinate таблица header из the column through the `columns `configuration, и this rule can be used для multi-level nesting</br>


## код пример

```
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 100
  },
  {
    заголовок: 'имя',
    columns: [
      {
        поле: 'имя1',
        заголовок: 'имя1',
        ширина: 100
      },
      {
        заголовок: 'имя-level-2',
        ширина: 150,
        columns: [
          {
            поле: 'имя2',
            заголовок: 'имя2',
            ширина: 100
          },
          {
            заголовок: 'имя3',
            поле: 'имя3',
            ширина: 150
          }
        ]
      }
    ]
  }
];

const option = {
  records,
  columns,
  // ......
};</br>
```


## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/T2Qlb7bjrop6MoxoEYRcXDT2nuc.gif' alt='' ширина='936' высота='680'>

Complete пример: https://www.visactor.io/vтаблица/демонстрация/базовый-функциональность/список-таблица-header-group</br>
## Related Documents

Related апи: https://www.visactor.io/vтаблица/option/списоктаблица-columns-текст#columns</br>
github：https://github.com/VisActor/Vтаблица</br>



