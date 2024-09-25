---
title: 38. VTable表格组件如何在透视表中渐进加载子节点</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件如何在透视表中渐进加载子节点？</br>
## 问题描述

使用VTable表格组件，如何在透视表中渐进加载子节点，点击父节点的展开按钮后，再动态加载子节点的信息</br>
## 解决方案 

VTable提供`setTreeNodeChildren`API，用来更新透视结构某个节点的子节点状态，可以用来实现渐进加载功能</br>
1. 维度树配置</br>
正常情况下，维度树（columnTree/rowTree）中，`children`属性为一个数组，为该节点的子节点信息</br>
```
{
    dimensionKey: 'name',
    value: 'a',
    children: [
        {
            dimensionKey: 'name-1',
            value: 'a-1',
            children: [
                // ......
            ]
        },
        // ......
    ]
}</br>
```
如何需要动态加载子节点信息，可以配置`children`属性为`true`，此时该节点在表格中会作为父节点显示，但是点击单元格内的展开按钮，会触发相关事件，但是表格不会有任何主动变化。</br>
1. 监听事件</br>
展开按钮点击后，会触发`VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE`事件，需要监听这个事件，使用`setTreeNodeChildren`API更新子节点信息和对应增加的数据</br>
```
const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
instance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && !Array.isArray(args.originData.children)) {
    setTimeout(() => {
      const newData = [
        // ......
      ];
      const children = [
        {
          dimensionKey: 'name-1',
          value: 'a-1',
        },
        {
          dimensionKey: 'name-1',
          value: 'a-2'
        }
      ];
      instance.setTreeNodeChildren(children, newData, args.col, args.row);
    }, 200);
  }
});</br>
```
## 代码示例  

demo：https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load</br>
## 相关文档

相关api：https://visactor.io/vtable/option/PivotTable#rowHierarchyType('grid'%20%7C%20'tree')</br>
教程：https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_tree</br>
github：https://github.com/VisActor/VTable</br>