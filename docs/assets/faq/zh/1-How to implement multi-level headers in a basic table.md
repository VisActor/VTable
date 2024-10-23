# 基本表格 ListTable 怎么实现多层表头？

## 问题描述

带有层级结构的表头如：部门（财务，技术），Name（FirstName, LastName），怎么构造这种结构显示在表头单元格中？

![图片](/vtable/faq/1-0.png)

## 解决方案

基本表格的配置项 columns 可以配置子项`columns`。

## 代码示例

```javascript
{
  field: 'full name',
  title: 'Full name',
  columns: [
    {
      field: 'name',
      title: 'First Name',
      width: 120
    },
    {
      field: 'lastName',
      title: 'Last Name',
      width: 100
    }
  ]
},
```

## 结果展示

- [在线效果参考](https://codesandbox.io/s/vtable-columns-nested-structure-4zwk43)

![result](/vtable/faq/1-1.png)

## 相关文档

- [基本表格 demo](https://visactor.io/vtable/demo/table-type/list-table)
- [基本表格教程](https://visactor.io/vtable/guide/table_type/List_table/list_table_define_and_generate)
- [相关 api](https://visactor.io/vtable/option/ListTable-columns-text#columns)
- [github](https://github.com/VisActor/VTable)
