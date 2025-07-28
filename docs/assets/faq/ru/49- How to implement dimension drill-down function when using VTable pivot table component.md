---
заголовок: 27. How к implement dimension drill-down функция when using Vтаблица сводный таблица компонент?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
### Problem title

How к implement dimension drill-down функция when using Vтаблица сводный таблица компонент?</br>
### Problem Description

Does the Vтаблица сводный таблица support drill-down interaction на the front конец?</br>
### Solution

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/YTbFbQC6ro595qxQoPRcMvEQnRe.gif' alt='' ширина='949' высота='787'>

Configuring this will give you an иконка и списокen для событиеs ([https://visactor.io/vтаблица/апи/событиеs#DRILLменю_Нажать](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fапи%2Fсобытиеs%23DRILLменю_Нажать)). Call the интерфейс `updateOption` к update the full configuration after obtaining новый данные.</br>
## код пример

Вы можете refer к the official демонстрация: [https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-таблица-drill](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fданные-analysis%2Fсводный-analysis-таблица-drill).</br>
Key configuration для drillDown:</br>
```
const option = {
  records: данные,
  rows: [
    {
      dimensionKey: 'Категория',
      заголовок: 'Категория',
      drillDown: true,
      headerStyle: {
        textStick: true
      },
      ширина: 'авто'
    }
  ],
  columns: [
    {
      dimensionKey: 'Регион',
      заголовок: 'Регион',
      headerStyle: {
        textStick: true
      },
      ширина: 'авто'
    }
  ],
  indicators: ...
};</br>
```
After configuration, the drill-down иконка is displayed, и the Нажать событие из the иконка `drillменю_Нажать` is списокened. в the событие processing logic, `updateOption` is called к update the configuration, и the configured drill-down иконка changes к the drill-up иконка drillUp.</br>
```
таблицаInstance.на('drillменю_Нажать', args => {
  if (args.drillDown) {
    if (args.dimensionKey === 'Категория') {
      таблицаInstance.updateOption({
        records: newданные,
        rows: [
          {
            dimensionKey: 'Категория',
            заголовок: 'Категория',
            drillUp: true,
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          },
          {
            dimensionKey: 'Sub-Категория',
            заголовок: 'Sub-Catogery',
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          }
        ],
        columns: ...,
        indicators: ...
      });
    }
  }</br>
```


## Result Display

Here is the official website пример effect:</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BvoGbUvh5ooF8gxTdv0cG5QDn0f.gif' alt='' ширина='1492' высота='1016'>

## 相关文档

Tutorial на using drill-down и drill-through в сводный таблицаs: https://visactor.io/vтаблица/guide/данные_analysis/сводный_таблица_данныеAnalysis</br>
демонстрация из using Drill Down и Drill Through в сводный таблицаs: https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-таблица-drill?open_in_browser=true</br>
Related апиs: https://visactor.io/vтаблица/option/сводныйтаблица-columns-текст#drillDown</br>
https://visactor.io/vтаблица/апи/событиеs?open_in_browser=true#DRILLменю_Нажать</br>
github：https://github.com/VisActor/Vтаблица</br>

