---
title: How the VTable component progressively loads sub-nodes in pivot tables</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to progressively load sub-nodes in a pivot table using the VTable component?</br>
## Problem description

Using the VTable table component, how to gradually load sub-nodes in the pivot table, click the expand button of the parent node, and then dynamically load the information of the sub-node</br>
## Solution

VTable provides `setTreeNodeChildren `API, which is used to update the sub-node status of a node in the pivot structure and can be used to implement progressive loading function</br>
1. Dimension tree configuration</br>
Normally, in the dimension tree (columnTree/rowTree), the `children `attribute is an array, which is the sub-node information of the node</br>
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
How to dynamically load sub-node information, you can configure the `children `property to `true `. At this time, the node will be displayed as the parent node in the table, but clicking the expand button in the cell will trigger relevant events, but the table will not have any active changes.</br>
1. Monitoring events</br>
After the expand button is clicked, the `VTable. ListTable.EVENT_TYPE `event will be triggered. You need to listen to this event and use the `setTreeNodeChildren `API to update the sub-node information and the corresponding increased data</br>
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
## Code example

demo：https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load</br>
## Related Documents

Related api: https://visactor.io/vtable/option/PivotTable#rowHierarchyType ('grid'% 20% 7C% 20'tree ')</br>
Tutorial: https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_tree</br>
github：https://github.com/VisActor/VTable</br>