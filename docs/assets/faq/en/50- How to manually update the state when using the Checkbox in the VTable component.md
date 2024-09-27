---
title: 28. How to manually update the state when using the Checkbox in the VTable component?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Problem Title

How to manually update the state when using the Checkbox in the VTable component?</br>
## Problem Description

Is there a way to manually set the checkbox of the ListTable in VTable, and how to clear the selected state of all checkboxes?</br>
## Solution

### Call the interface to update the state

You can call the interface `setCellCheckboxState`. This interface can set the checkbox state of a cell, and is defined as follows:</br>
```
setCellCheckboxState(col: number, row: number, checked: boolean) => void</br>
```
Parameter description:</br>
*  `col`: Column number</br>
*  `row`: Row number</br>
*  `checked`: Whether checked</br>
Example: `tableInstance.setCellCheckboxState(0, 3, true)` sets the Checkbox state of the cell at position (0, 3) to checked state. The demo effect after modifying the official website is as follows: [https://visactor.io/vtable/demo/cell-type/checkbox](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fcell-type%2Fcheckbox)</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UDZAbjC4aoINf2x9yIhcrMatnRm.gif' alt='' width='2172' height='702'>

### Batch update status

For the second question about batch update, currently, there is no dedicated interface to reset the status of all checkboxes. However, you can achieve the goal of updating all checkbox statuses by resetting the data using `setRecords` or updating the column configuration using `updateColumns`.</br>
1. Update through column configuration</br>
Add "checked" as true or false in the column configuration to set the status of the entire column. However, if there is a field in the data records indicating the status, the data record will prevail.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/EbjcbvJ87ofOnVx0Dg8cKcKcnUK.gif' alt='' width='2256' height='1302'>

1. To batch set the checkbox status by updating the records data source, it is required to explicitly specify the checkbox value fields in the records.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PLxkbNbCOoSbt8xFjG0cWQGrn6g.gif' alt='' width='3456' height='882'>

## Related documents

Tutorial on checkbox type usage: [https://visactor.io/vtable/guide/cell_type/checkbox](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fcell_type%2Fcheckbox)</br>
Checkbox demo: [https://visactor.io/vtable/demo/cell-type/checkbox](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fcell-type%2Fcheckbox)</br>
Related API：https://visactor.io/vtable/option/ListTable-columns-checkbox#cellType</br>
https://visactor.io/vtable/api/Methods#setCellCheckboxState</br>
github：https://github.com/VisActor/VTable</br>

