# VTable 使用问题：如何实现表格内容按数据记录排序？

## 问题描述

表格中数据按照某一列进行排序，这个需求使用 VTable 要怎么实现？

## 解决方案

在 VTable 中，可以通过三种方式来实现数据排序功能：

1. 通过表格内 ui 实现
   在 `columns` 中配置 `sort` 属性，支持配置 `true` 使用默认排序规则，也可以配置函数来自定义排序规则：

```javascript
// ......
columns: [
  {
    field: 'id',
    title: 'ID',
    width: 120,
    sort: true
  },
  {
    field: 'name',
    title: 'Name',
    width: 120,
    sort: (a, b) => {
      return a - b;
    }
  }
];
```

此时，对应列的表头上会显示排序按钮：
![](/vtable/faq/6-0.png)
点击排序按钮，就可以在无排序、升序排序和降序排序三种状态中切换。 2. 通过在初始化 `option` 中配置 `sortState` 实现
在 `columns` 中配置 `sort` 属性后，可以在 `option` 中配置 `sortState` 属性：

```javascript
sortState:{
    field: 'Category',
    order: 'asc'
}
```

其中，`field` `是排序对应的数据源；order` 是排序规则，支持 asc 升序、desc 降序 和 normal 不排序。 3. 通过 `updateSortStateapi` 配置 `sortState`
在 `columns` 中配置 `sort` 属性后，可以通过表格实例的 `updateSortState` 方法，随时配置 `sortState`，更新排序效果：

```javascript
instance.updateSortState({
  field: 'id',
  order: 'desc'
});
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-sort-w869fk)

![result](/vtable/faq/6-1.png)

## 相关文档

- [表格排序 demo](https://visactor.io/vtable/demo/basic-functionality/sort)
- [排序功能教程](https://visactor.io/vtable/guide/basic_function/sort/list_sort)
- [github](https://github.com/VisActor/VTable)
