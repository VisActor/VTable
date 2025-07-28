---
заголовок: How the Vтаблица компонент progressively loads sub-nodes в сводный таблицаs</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к progressively load sub-nodes в a сводный таблица using the Vтаблица компонент?</br>
## Problem description

Using the Vтаблица таблица компонент, how к gradually load sub-nodes в the сводный таблица, Нажать the развернуть Кнопка из the parent node, и then dynamically load the information из the sub-node</br>
## Solution

Vтаблица provides `setTreeNodeChildren `апи, which is used к update the sub-node status из a node в the сводный structure и can be used к implement progressive загрузка функция</br>
1. Dimension tree configuration</br>
Normally, в the dimension tree (columnTree/rowTree), the `children `attribute is an массив, which is the sub-node information из the node</br>
```
{
    dimensionKey: 'имя',
    значение: 'a',
    children: [
        {
            dimensionKey: 'имя-1',
            значение: 'a-1',
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
After the развернуть Кнопка is Нажатьed, the `Vтаблица. списоктаблица.событие_TYPE `событие will be triggered. You need к списокen к this событие и use the `setTreeNodeChildren `апи к update the sub-node information и the corresponding increased данные</br>
```
const { TREE_HIERARCHY_STATE_CHANGE } = Vтаблица.списоктаблица.событие_TYPE;
instance.на(TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.hierarchyState === Vтаблица.TYPES.HierarchyState.развернуть && !массив.isArray(args.originданные.children)) {
    setTimeout(() => {
      const newданные = [
        // ......
      ];
      const children = [
        {
          dimensionKey: 'имя-1',
          значение: 'a-1',
        },
        {
          dimensionKey: 'имя-1',
          значение: 'a-2'
        }
      ];
      instance.setTreeNodeChildren(children, newданные, args.col, args.row);
    }, 200);
  }
});</br>
```
## код пример

демонстрация：https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-таблица-tree-lazy-load</br>
## Related Documents

Related апи: https://visactor.io/vтаблица/option/сводныйтаблица#rowHierarchyType ('grid'% 20% 7C% 20'tree ')</br>
Tutorial: https://visactor.io/vтаблица/guide/таблица_type/сводный_таблица/пользовательский_header</br>
github：https://github.com/VisActor/Vтаблица</br>