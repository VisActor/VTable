---
title: 37. VTable表格组件如何在列表中渐进加载子节点</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件如何在列表中渐进加载子节点？</br>
## 问题描述

使用VTable表格组件，如何在列表中渐进加载子节点，点击父节点的展开按钮后，再动态加载子节点的信息</br>
## 解决方案 

VTable提供`setRecordChildren`API，用来更新某个节点的子节点状态，可以用来实现渐进加载功能</br>
1. 数据准备</br>
正常情况下，树形结构列表的数据中，`children`属性为一个数组，为该节点的子节点信息</br>
```
{
    name: 'a',
    value: 10,
    children: [
        {
            name: 'a-1',
            value: 5,
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
展开按钮点击后，会触发`VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE`事件，需要监听这个事件，使用`setRecordChildren`API更新子节点信息</br>
```
const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
instance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && !Array.isArray(args.originData.children)) {
    setTimeout(() => {
      const children = [
        {
          name: 'a-1',
          value: 5,
        },
        {
          name: 'a-2',
          value: 5
        }
      ];
      instance.setRecordChildren(children, args.col, args.row);
    }, 200);
  }
});</br>
```
## 代码示例  

demo：https://visactor.io/vtable/demo/table-type/list-table-tree-lazy-load</br>
## 相关文档

相关api：https://visactor.io/vtable/option/ListTable-columns-text#tree</br>
教程：https://visactor.io/vtable/guide/table_type/List_table/tree_list</br>
github：https://github.com/VisActor/VTable</br>



