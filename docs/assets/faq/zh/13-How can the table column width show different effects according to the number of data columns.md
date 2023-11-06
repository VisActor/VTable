# 表格列宽怎么可以根据数据列数来展示不同效果？

## 问题描述

在使用 VTable 表格库做报表数据展示时，如果列的总数不足以撑开整个容器的宽度，我想能自动拉宽来适应容器大小，但当列的数量较多总宽度大于容器宽度时，又可以正常出滚动条来横向滚动。这个效果怎么实现呢？

## 解决方案

根据你的问题，我的理解是你想要根据数据的总列宽来动态调整宽度模式，在 VTable 中宽度模式 widthMode 有:

- `standard` 按 with 设置来设置每列的宽度
- `autoWidth` 按单元格内容自动计算列宽
- `adaptive` 按容器宽度缩放，撑满容器的宽度。
  那就是如果列数较少不足以铺满容器的时候，你想要 adaptive 的效果，如果总列宽超过容器宽度，想要`standard`或者`autoWidth`的效果。有两种方式可以实现：

1. 可以已经 VTable 实例的接口，getAllColsWidth 来获取总列宽和容器的宽度做对比，然后根据情况来改变 widthMode。
2. 比较省事的一个方式，VTable 提供了一个很优化的配置项`autoFillWidth`，配置这个就能完美做到你想要的效果。另外也有相应的高度设置 `autoFillWidth`。

![](/vtable/faq/13-0.png)

## 代码示例

```javascript
const option = {
  records,
  columns,
  limitMaxAutoWidth: 800,
  autoFillWidth: true
  // widthMode: "autoWidth",
  // heightMode: "autoHeight"
};
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-autfillwidth-6kz69n)

![result](/vtable/faq/13-1.png)

## 相关文档

- [列宽相关教程](https://visactor.io/vtable/guide/basic_function/row_height_column_width)
- [相关 api](https://visactor.io/vtable/option/ListTable#autoFillWidth)
- [github](https://github.com/VisActor/VTable)
