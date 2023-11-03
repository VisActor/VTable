# 表格怎么展示树形结构的数据？

## 问题描述

怎么在前端页面表格组件中实现如图这样一个层级结构的数据展示呢？
![image](/vtable/faq/15-0.png)

## 解决方案

VTable 的两种表格形态基本表格 ListTable 和透视表格 PivotTable 都可以实现这种树形展示，而且用法挺简单的。
给你举一个基本表格展示为树形结构的例子，主要有两处配置：
(1) 需要在列 column 上配置 tree 位 true
(2) 需要是有 children 层级结构的数据
可以参考官网的两个示例：

1. 基本表格树形：https://visactor.io/vtable/demo/table-type/list-table-tree
2. 透视表格树形：https://visactor.io/vtable/demo/table-type/pivot-table-tree

## 代码示例

```javascript
const option = {
  records:
  [
    {
    "department": "Human Resources Department",
    "children": [
      {
        "group": "Recruiting Group",
        "children": [
          {
            "name": "John Smith",
            "position": "Recruiting Manager",
            "salary": "$8000"
          },
          {
            "name": "Emily Johnson",
            "position": "Recruiting Supervisor",
            "salary": "$6000"
          },
          {
            "name": "Michael Davis",
            "position": "Recruiting Specialist",
            "salary": "$4000"
          }
        ],
      },
      ...
  ],
  columns: [
    {
        "field": "group",
        "title": "department",
        "width": "auto",
         tree: true,
      },
      ...
    ]
};
```

## 结果展示

[在线效果参考](https://visactor.io/vtable/demo/table-type/list-table-tree)

![result](/vtable/faq/15-1.png)

## 相关文档

- [树形结构相关教程](https://visactor.io/vtable/guide/table_type/List_table/tree_list)
- [相关 api](https://visactor.io/vtable/option/ListTable-columns-text#tree)
- [github](https://github.com/VisActor/VTable)
