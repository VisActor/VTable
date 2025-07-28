---
заголовок: How к пользовательскийize highlighted cells в the Vтаблица компонент</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к пользовательскийize highlighted cells в the Vтаблица компонент?</br>
## Problem description

How к пользовательскийize highlighted cells и specify the highlighting style using the Vтаблица таблица компонент?</br>
## Solution

Vтаблица supports пользовательский cell styles, which can be used к implement пользовательский highlighting функция.</br>
### Registration style

первый, you need к регистрация a пользовательский style</br>
Need к define `id `и `style `two attributes:</br>
*  Id: the unique id из the пользовательский style</br>
*  Style: пользовательский cell style, the same as the `style `configuration в the `column `, the final presentation effect is the fusion из the original cell style и the пользовательский style</br>
пользовательский style registration is divided into two ways, `option `configuration и апи configuration:</br>
*  The пользовательскийCellStyle property в the option option receives an массив composed из multiple пользовательский style objects.</br>
```
// init option
const option = {
  // ......
  пользовательскийCellStyle: [
    {
      id: 'пользовательский-1',
      style: {
        bgColor: 'red'
      }
    }
  ]
}</br>
```
*  The апи can регистрация пользовательский styles through the `регистрацияпользовательскийCellStyle `методы provided по the Vтаблица instance:</br>
```
instance.регистрацияпользовательскийCellStyle(id, style)</br>
```
### Assignment style

к use a регистрацияed пользовательский style, you need к assign the пользовательский style к the cell. Assignment requires defining two свойства, `cellPosition `и `пользовательскийStyleId `:</br>
*  cellPosition: Cell позиция information, supports configuring individual cells и cell ranges.</br>
*  Single cell: `{row: число, col: число}`</br>
*  Cell range: `{range: {начало: {row: число, col: число}, конец: {row: число, col: число}}}`</br>
*  пользовательскийStyleId: пользовательский style id, the same as the id defined when регистрацияing пользовательский styles</br>
There are two ways к allocate, configure в `option `и configure using апи:</br>
*  The `пользовательскийCellStyleArrangement `property в option receives an массив из пользовательский assignment style objects:</br>
```
// init option
const option = {
  // ......
  пользовательскийCellStyleArrangement: [
    {
      cellPosition: {
        col: 3,
        row: 4
      },
      пользовательскийStyleId: 'пользовательский-1'
    },
    {
      cellPosition: {
        range: {
          начало: {
            col: 5,
            row: 5
          },
          конец: {
            col: 7,
            row: 7
          }
        }
      },
      пользовательскийStyleId: 'пользовательский-2'
    }
  ]
}</br>
```
*  The апи can assign пользовательский styles through the `arrangeпользовательскийCellStyle `методы provided по the Vтаблица instance:</br>
```
instance.arrangeпользовательскийCellStyle(cellPosition, пользовательскийStyleId)</br>
```
### Update и delete styles

пользовательский style After registration, Вы можете update the пользовательский style из the same id through `регистрацияпользовательскийCellStyle `method. After the update, the cell style из the assigned пользовательский style will be updated; if `newStyle `is `undefined `| `null `, it means к delete the пользовательский style. After deletion, the cell style из the assigned пользовательский style will restore the по умолчанию style</br>
```
instance.регистрацияпользовательскийCellStyle(id, newStyle)</br>
```
The assigned пользовательский style cell area can be updated по `arrangeпользовательскийCellStyle `method, и the style из the cell area will be updated after the update; if the `пользовательскийStyleId `is `undefined `| `null `, it means that the restored cell style is the по умолчанию style</br>
## код пример

демонстрация：https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-style</br>
## Related Documents

Related апи: https://visactor.io/vтаблица/option/списоктаблица-columns-текст#style.fontSize</br>
github：https://github.com/VisActor/Vтаблица</br>



