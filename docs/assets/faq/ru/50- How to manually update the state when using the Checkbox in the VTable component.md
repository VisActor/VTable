---
заголовок: 28. How к manually update the state when using the флажок в the Vтаблица компонент?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Problem Title

How к manually update the state when using the флажок в the Vтаблица компонент?</br>
## Problem Description

Is there a way к manually set the флажок из the списоктаблица в Vтаблица, и how к clear the selected state из все checkboxes?</br>
## Solution

### Call the интерфейс к update the state

Вы можете call the интерфейс `setCellCheckboxState`. This интерфейс can set the флажок state из a cell, и is defined as follows:</br>
```
setCellCheckboxState(col: число, row: число, checked: логический) => void</br>
```
параметр description:</br>
*  `col`: Column число</br>
*  `row`: Row число</br>
*  `checked`: Whether checked</br>
пример: `таблицаInstance.setCellCheckboxState(0, 3, true)` sets the флажок state из the cell в позиция (0, 3) к checked state. The демонстрация effect after modifying the official website is as follows: [https://visactor.io/vтаблица/демонстрация/cell-тип/флажок](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fcell-тип%2Fcheckbox)</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UDZAbjC4aoINf2x9yIhcrMatnRm.gif' alt='' ширина='2172' высота='702'>

### Batch update status

для the second question about batch update, currently, there is no dedicated интерфейс к reset the status из все checkboxes. However, Вы можете achieve the goal из updating все флажок statuses по resetting the данные using `setRecords` или updating the column configuration using `updateColumns`.</br>
1. Update through column configuration</br>
Add "checked" as true или false в the column configuration к set the status из the entire column. However, if there is a поле в the данные records indicating the status, the данные record will prevail.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/EbjcbvJ87ofOnVx0Dg8cKcKcnUK.gif' alt='' ширина='2256' высота='1302'>

1. к batch set the флажок status по updating the records данные source, it is обязательный к explicitly specify the флажок значение полеs в the records.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PLxkbNbCOoSbt8xFjG0cWQGrn6g.gif' alt='' ширина='3456' высота='882'>

## Related documents

Tutorial на флажок тип usвозраст: [https://visactor.io/vтаблица/guide/cell_type/флажок](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fcell_type%2Fcheckbox)</br>
флажок демонстрация: [https://visactor.io/vтаблица/демонстрация/cell-тип/флажок](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fcell-тип%2Fcheckbox)</br>
Related апи：https://visactor.io/vтаблица/option/списоктаблица-columns-флажок#cellType</br>
https://visactor.io/vтаблица/апи/методы#setCellCheckboxState</br>
github：https://github.com/VisActor/Vтаблица</br>

