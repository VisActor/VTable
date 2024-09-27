---
title: How the VTable component progressively loads sub-nodes in a list</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to progressively load sub-nodes in a list with the VTable component?</br>
## Problem description

Using the VTable table component, how to gradually load sub-nodes in the list, click the expand button of the parent node, and then dynamically load the information of the sub-node</br>
## Solution

VTable provides `setRecordChildren `API to update the sub-node status of a node, which can be used to implement progressive loading function</br>
1. Data preparation</br>
Normally, in the data of the tree structure list, the `children `attribute is an array, which is the sub-node information of the node</br>
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
How to dynamically load sub-node information, you can configure the `children `property to `true `. At this time, the node will be displayed as the parent node in the table, but clicking the expand button in the cell will trigger relevant events, but the table will not have any active changes.</br>
1. Monitoring events</br>
After the expand button is clicked, the `VTable. ListTable.EVENT_TYPE `event will be triggered. You need to listen to this event and use the `setRecordChildren `API to update the sub-node information</br>
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
## Code example

demo：https://visactor.io/vtable/demo/table-type/list-table-tree-lazy-load</br>
## Related Documents

Related api: https://visactor.io/vtable/option/ListTable-columns-text#tree</br>
Tutorial: https://visactor.io/vtable/guide/table_type/List_table/tree_list</br>
github：https://github.com/VisActor/VTable</br>



