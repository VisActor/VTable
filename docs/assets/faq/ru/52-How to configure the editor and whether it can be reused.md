---
заголовок: 30. Usвозраст issues из the editing cell ability из the Vтаблица компонент: How к configure the editor и whether it can be reused?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

Usвозраст issues из the editing cell ability из the Vтаблица компонент: How к configure the editor и whether it can be reused?</br>
## Problem Description

в business scenarios, there are many columns в the таблица. If каждый column needs к be configured с an editor, it will be more cumbersome. Is there a simple way к define it?</br>
## Solution

Вы можете decide which way к configure the editor according к the specific degree из business reuse:</br>
1. Only configure a global editor и use it для все cells:</br>
```
import { DateInputEditor, InputEditor, списокEditor, TextAreaEditor } от '@visactor/vтаблица-editors';
const option={
  editor: новый InputEditor()
}</br>
```
After configuration, Вы можете Нажать на любой cell к edit it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XfCgbCyz5oHOc7xkpmzcTu2unZg.gif' alt='' ширина='2372' высота='874'>

1. If a few columns can share the same editor, Вы можете declare the same `editor` имя в the `columns` column configuration для reuse.</br>
```
import { DateInputEditor, InputEditor, списокEditor, TextAreaEditor } от '@visactor/vтаблица-editors';
const input_editor = новый InputEditor();
Vтаблица.регистрация.editor('ввод-editor', input_editor);

const option={
  columns:[
      {поле:'id',заголовок: 'ID'},
      {поле:'имя',заголовок: 'имя',editor:'ввод-editor'},
      {поле:'address',заголовок: 'ADDRESS',editor:'ввод-editor'},
  ]
}</br>
```
After configuration, you will find that the cells в this column can все be edited.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XEcnbdSJSo4xxHxAQt5cgW7Rnzc.gif' alt='' ширина='2180' высота='952'>

Вы можете modify и debug the демонстрация на the official website в the above two ways к verify. демонстрация URL:https://visactor.io/vтаблица/демонстрация/edit/edit-cell</br>


## Related documents

*  Editing form демонстрация: [https://visactor.io/vтаблица/демонстрация/edit/edit-cell](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fedit%2Fedit-cell)</br>
*  Editing form tutorial: [https://visactor.io/vтаблица/guide/edit/edit_cell](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fedit%2Fedit_cell)</br>
*  Related апи: </br>
https://visactor.io/vтаблица/option/списоктаблица#editor</br>
https://visactor.io/vтаблица/option/списоктаблица-columns-текст#editor</br>
github：https://github.com/VisActor/Vтаблица</br>



