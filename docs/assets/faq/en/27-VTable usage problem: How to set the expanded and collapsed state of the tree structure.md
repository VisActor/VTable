---
title: VTable usage problem: How to set the expanded and collapsed state of the tree structure</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to set the expanded and collapsed state of the tree structure in a tree-structured table.</br>


## Problem Description

Through configuration, set the expanded and collapsed state of the tree structure table and customize the display style of the tree structure.</br>


## Solution

1. 1. `hierarchyExpandLevel` can be configured in the `option` of table initialization. This configuration item is defined as follows: When displayed as a tree structure, the number of levels is expanded by default. The default setting is 1 to display only the root node, and the configuration of `Infinity` will expand all nodes.</br>
1. You can also obtain the expanded and collapsed status of a certain cell through the API after the table is initialized, and set the expanded and collapsed status of a certain cell through the API.</br>
```
// Get the tree-shaped expanded or collapsed state of a certain cell
getHierarchyState(col: number, row: number) : HierarchyState | null;
enum HierarchyState {
  expand = 'expand',
  collapse = 'collapse',
  none = 'none'
}

// Header switch level status
toggleHierarchyState(col: number, row: number): viod;</br>
```
## Code example 

```
const option = {
  records:data,
  columns,
  widthMode:'standard',
  hierarchyExpandLevel: 2,
};
const tableInstance = new VTable.ListTable(container, option);

const state = tableInstance.getHierarchyState(0,1);
if (state === 'expand') {
    tableInstance.toggleHierarchyState(0,1);
}</br>
```
## Results display 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XBKlb2ZSXo9AfZxd762ccFDenoc.gif' alt='' width='1662' height='1044'>

Complete sample code (you can paste it into the [editor](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree) to try it out):</br>
```
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/company_struct.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "group",
        "title": "department",
        "width": "auto",
         tree: true,
         fieldFormat(rec){
            return rec['department']??rec['group']??rec['name'];
         }
    },
    {
        "field": "total_children",
        "title": "memebers count",
        "width": "auto",
        fieldFormat(rec){
          if(rec?.['position']){
            return `position:  ${rec['position']}`
          }else
          return rec?.['total_children'];
        }
    },
    {
        "field": "monthly_expense",
        "title": "monthly expense",
        "width": "auto",
        fieldFormat(rec){
          if(rec?.['salary']){
            return `salary:  ${rec['salary']}`
          }else
          return rec?.['monthly_expense'];
        }
    },
    {
        "field": "new_hires_this_month",
        "title": "new hires this month",
        "width": "auto"
    },
    {
        "field": "resignations_this_month",
        "title": "resignations this month",
        "width": "auto"
    },
    {
        "field": "complaints_and_suggestions",
        "title": "recived complaints counts",
        "width": "auto"
    },
   
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  hierarchyExpandLevel: 2,
};

tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;

const state = tableInstance.getHierarchyState(0,1);
if (state === 'expand') {
    tableInstance.toggleHierarchyState(0,1);
}
    })</br>
```
## Related documents

Tree mode demo：https://www.visactor.io/vtable/demo/table-type/list-table-tree</br>
Related api：https://www.visactor.io/vtable/option/ListTable#hierarchyExpandLevel</br>
github：https://github.com/VisActor/VTable</br>



