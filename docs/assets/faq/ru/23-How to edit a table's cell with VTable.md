---
title: How to edit a table's cell with VTable?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---


## Title

Can an editable table enter the editing state directly when clicked, instead of double clicking a cell to make it editable?</br>


## Description

In the table editing scenario, double-clicking to enter the editing state would be cumbersome, and you need to enter the editing state directly.</br>


## Solution 

You can configure editCellTrigger to click in the table initialization option. The configuration item is defined as follows:</br>
```
/** Edit triggering time: double click event | single click event | api to manually start editing. Default is double click 'doubleclick' */
editCellTrigger?: 'doubleclick' | 'click' | 'api';</br>
```


## Code Example

```
  const option = {
    records,
    columns,
    autoWrapText: true,
    limitMaxAutoWidth: 600,
    heightMode: 'autoHeight',
    editCellTrigger: 'click' // Set the edit trigger timing
  };
  const tableInstance = new VTable.ListTable(container, option);</br>
```


## Results

Online effect reference: https://visactor.io/vtable/demo/edit/edit-cell</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VaIKbqfnBo2cUDx8AVVcstO6nxb.gif' alt='' width='2136' height='970'>



## Related Documents

Edit table demo: https://visactor.io/vtable/demo/edit/edit-cell</br>
Edit table tutorial: https://visactor.io/vtable/guide/edit/edit_cell</br>
Related API: https://visactor.io/vtable/option/ListTable#editCellTrigger</br>
github: https://github.com/VisActor/VTable</br>