---
заголовок: How the Vтаблица компонент progressively loads sub-nodes в a список</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к progressively load sub-nodes в a список с the Vтаблица компонент?</br>
## Problem description

Using the Vтаблица таблица компонент, how к gradually load sub-nodes в the список, Нажать the развернуть Кнопка из the parent node, и then dynamically load the information из the sub-node</br>
## Solution

Vтаблица provides `setRecordChildren `апи к update the sub-node status из a node, which can be used к implement progressive загрузка функция</br>
1. данные preparation</br>
Normally, в the данные из the tree structure список, the `children `attribute is an массив, which is the sub-node information из the node</br>
```
{
    имя: 'a',
    значение: 10,
    children: [
        {
            имя: 'a-1',
            значение: 5,
            children: [
                // ......
            ]
        },
        // ......
    ]
}</br>
```
How к dynamically load sub-node information, Вы можете configure the `children `property к `true `. в this time, the node will be displayed as the parent node в the таблица, but Нажатьing the развернуть Кнопка в the cell will trigger relevant событиеs, but the таблица will не have любой активный changes.</br>
1. Monitoring событиеs</br>
After the развернуть Кнопка is Нажатьed, the `Vтаблица. списоктаблица.событие_TYPE `событие will be triggered. You need к списокen к this событие и use the `setRecordChildren `апи к update the sub-node information</br>
```
const { TREE_HIERARCHY_STATE_CHANGE } = Vтаблица.списоктаблица.событие_TYPE;
instance.на(TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.hierarchyState === Vтаблица.TYPES.HierarchyState.развернуть && !массив.isArray(args.originданные.children)) {
    setTimeout(() => {
      const children = [
        {
          имя: 'a-1',
          значение: 5,
        },
        {
          имя: 'a-2',
          значение: 5
        }
      ];
      instance.setRecordChildren(children, args.col, args.row);
    }, 200);
  }
});</br>
```
## код пример

демонстрация：https://visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица-tree-lazy-load</br>
## Related Documents

Related апи: https://visactor.io/vтаблица/option/списоктаблица-columns-текст#tree</br>
Tutorial: https://visactor.io/vтаблица/guide/таблица_type/список_таблица/tree_список</br>
github：https://github.com/VisActor/Vтаблица</br>



