---
title: VTable usage issue: How to set multi-level table headers</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to set up multi-level headers</br>


## Problem description

How to configure headers to achieve multi-level header grouping effect</br>


## Solution

In the `column `configuration in VTable, it supports specifying the subordinate table header of the column through the `columns `configuration, and this rule can be used for multi-level nesting</br>


## Code example

```
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 100
  },
  {
    title: 'Name',
    columns: [
      {
        field: 'name1',
        title: 'name1',
        width: 100
      },
      {
        title: 'name-level-2',
        width: 150,
        columns: [
          {
            field: 'name2',
            title: 'name2',
            width: 100
          },
          {
            title: 'name3',
            field: 'name3',
            width: 150
          }
        ]
      }
    ]
  }
];

const option = {
  records,
  columns,
  // ......
};</br>
```


## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/T2Qlb7bjrop6MoxoEYRcXDT2nuc.gif' alt='' width='936' height='680'>

Complete example: https://www.visactor.io/vtable/demo/basic-functionality/list-table-header-group</br>
## Related Documents

Related api: https://www.visactor.io/vtable/option/ListTable-columns-text#columns</br>
github：https://github.com/VisActor/VTable</br>



