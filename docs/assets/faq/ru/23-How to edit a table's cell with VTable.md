---
заголовок: How к edit a таблица's cell с Vтаблица?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---


## Title

Can an ediтаблица таблица enter the editing state directly when Нажатьed, instead из double Нажатьing a cell к make it ediтаблица?</br>


## Description

в the таблица editing scenario, double-Нажатьing к enter the editing state would be cumbersome, и you need к enter the editing state directly.</br>


## Solution 

Вы можете configure editCellTrigger к Нажать в the таблица initialization option. The configuration item is defined as follows:</br>
```
/** Edit triggering time: double Нажать событие | single Нажать событие | апи к manually начало editing. по умолчанию is double Нажать 'doubleНажать' */
editCellTrigger?: 'doubleНажать' | 'Нажать' | 'апи';</br>
```


## код пример

```
  const option = {
    records,
    columns,
    автоWrapText: true,
    limitMaxавтоширина: 600,
    высотаMode: 'автовысота',
    editCellTrigger: 'Нажать' // Set the edit trigger timing
  };
  const таблицаInstance = новый Vтаблица.списоктаблица(container, option);</br>
```


## Results

Online effect reference: https://visactor.io/vтаблица/демонстрация/edit/edit-cell</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VaIKbqfnBo2cUDx8AVVcstO6nxb.gif' alt='' ширина='2136' высота='970'>



## Related Documents

Edit таблица демонстрация: https://visactor.io/vтаблица/демонстрация/edit/edit-cell</br>
Edit таблица tutorial: https://visactor.io/vтаблица/guide/edit/edit_cell</br>
Related апи: https://visactor.io/vтаблица/option/списоктаблица#editCellTrigger</br>
github: https://github.com/VisActor/Vтаблица</br>