# 如何在表格组件中合并相同内容的单元格？

## 问题描述

表格中某一列有多个连续的数据相同，自动合并这些单元格，内容居中显示。如何在VTable中实现这个效果？
![image](/vtable/faq/14-0.png)

## 解决方案

可以通过在 columns 中将 `mergeCell` 设置为 true，该列中前后内容相同的单元格会自动合并：

```javascript
const columns = [
  {
    // ......
    mergeCell: true
  }
];
```

## 代码示例

```javascript
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'value',
    title: 'number',
    width: 100,
    mergeCell: true
  }
];
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns
};
new ListTable(document.getElementById('container'), option);
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-merge-cell-23wwmk)

![result](/vtable/faq/14-1.png)

## 相关文档

- [合并单元格 demo](https://visactor.io/vtable/demo/basic-functionality/merge)
- [mergeCell api](https://visactor.io/vtable/option/ListTable-columns-text#mergeCell)
- [github](https://github.com/VisActor/VTable)
