# 在表格组件中超出宽度被省略的文字如何通过弹窗显示完整内容？

## 问题描述

在表格组件中，使用固定列宽限制单元格宽度后，部分超过宽度的文体会省略。如何实现单元格内容被省略时，hover 到相应位置，弹出提示框显示完整内容。

## 解决方案

可以通过配置`isShowOverflowTextTooltip`，来实现 hover 弹出 poptip 显示被省略的完整文字。

## 代码示例

```javascript
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns,
  tooltip: {
    isShowOverflowTextTooltip: true
  }
};

// 创建 VTable 实例
const vtableInstance = new VTable.ListTable(
  document.getElementById("container")!,
  option
);
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-showoverflowtexttooltip-qq597m)

![result](/vtable/faq/4-0.gif)

## 相关文档

- [Tooltip demo](https://visactor.io/vtable/demo/component/tooltip)
- [Tooltip 教程](https://visactor.io/vtable/guide/components/tooltip)
- [相关 api](https://visactor.io/vtable/option/ListTable#tooltip.isShowOverflowTextTooltip)
- [github](https://github.com/VisActor/VTable)
