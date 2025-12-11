---
заголовок: Vтаблица usвозраст problem: How к set the expanded и collapsed state из the tree structure</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к set the expanded и collapsed state из the tree structure в a tree-structured таблица.</br>


## Problem Description

Through configuration, set the expanded и collapsed state из the tree structure таблица и пользовательскийize the display style из the tree structure.</br>


## Solution

1. 1. `hierarchyExpandLevel` can be configured в the `option` из таблица initialization. This configuration item is defined as follows: When displayed as a tree structure, the число из levels is expanded по по умолчанию. The по умолчанию setting is 1 к display only the root node, и the configuration из `Infinity` will развернуть все nodes.</br>
1. Вы можете also obtain the expanded и collapsed status из a certain cell through the апи after the таблица is initialized, и set the expanded и collapsed status из a certain cell through the апи.</br>
```
// Get the tree-shaped expanded или collapsed state из a certain cell
getHierarchyState(col: число, row: число) : HierarchyState | null;
enum HierarchyState {
  развернуть = 'развернуть',
  свернуть = 'свернуть',
  никто = 'никто'
}

// Header switch level status
toggleHierarchyState(col: число, row: число): viod;</br>
```
## код пример 

```
const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  hierarchyExpandLevel: 2,
};
const таблицаInstance = новый Vтаблица.списоктаблица(container, option);

const state = таблицаInstance.getHierarchyState(0,1);
if (state === 'развернуть') {
    таблицаInstance.toggleHierarchyState(0,1);
}</br>
```
## Results display 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XBKlb2ZSXo9AfZxd762ccFDenoc.gif' alt='' ширина='1662' высота='1044'>

Complete sample код (Вы можете paste it into the [editor](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree) к try it out):</br>
```
let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/company_struct.json')
    .then((res) => res.json())
    .then((данные) => {

const columns =[
    {
        "поле": "group",
        "title": "department",
        "ширина": "авто",
         tree: true,
         полеFormat(rec){
            возврат rec['department']??rec['group']??rec['имя'];
         }
    },
    {
        "поле": "total_children",
        "title": "memebers count",
        "ширина": "авто",
        полеFormat(rec){
          if(rec?.['позиция']){
            возврат `позиция:  ${rec['позиция']}`
          }else
          возврат rec?.['total_children'];
        }
    },
    {
        "поле": "monthly_expense",
        "title": "monthly expense",
        "ширина": "авто",
        полеFormat(rec){
          if(rec?.['salary']){
            возврат `salary:  ${rec['salary']}`
          }else
          возврат rec?.['monthly_expense'];
        }
    },
    {
        "поле": "new_hires_this_month",
        "title": "новый hires this month",
        "ширина": "авто"
    },
    {
        "поле": "resignations_this_month",
        "title": "resignations this month",
        "ширина": "авто"
    },
    {
        "поле": "complaints_and_suggestions",
        "title": "recived complaints counts",
        "ширина": "авто"
    },
   
];

const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  hierarchyExpandLevel: 2,
};

таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;

const state = таблицаInstance.getHierarchyState(0,1);
if (state === 'развернуть') {
    таблицаInstance.toggleHierarchyState(0,1);
}
    })</br>
```
## Related documents

Tree mode демонстрация：https://www.visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица-tree</br>
Related апи：https://www.visactor.io/vтаблица/option/списоктаблица#hierarchyExpandLevel</br>
github：https://github.com/VisActor/Vтаблица</br>



