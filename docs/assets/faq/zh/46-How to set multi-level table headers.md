---
title: 24. VTable使用问题：如何设置多级表头</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何设置多级表头</br>


## 问题描述

如何配置表头，实现多级表头分组效果</br>


## 解决方案 

VTable中的`column`配置中，支持通过`columns`配置来指定该列的下级表头，可以使用这个规则多级嵌套</br>


## 代码示例  

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


## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/YkOYbjyuyonEZxxggC9c6IFpnxj.gif' alt='' width='936' height='680'>

完整示例：https://www.visactor.io/vtable/demo/basic-functionality/list-table-header-group</br>
## 相关文档

相关api：https://www.visactor.io/vtable/option/ListTable-columns-text#columns</br>
github：https://github.com/VisActor/VTable</br>



