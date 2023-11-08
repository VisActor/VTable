# 表格组件中如何实现指定一列的宽度，内容自动换行？

## 问题描述

表格中指定一列的宽度，内容按照宽度限制自动换行，单元格的高度由实际内容行数决定。如何实现这个效果？

![](/vtable/faq/2-0.png)

## 解决方案

表格配置中加入以下配置：

```javascript
heightMode: 'autoHeight', // 高度模式：自动高度（每一行的高度由内容撑开）
autoWrapText: true, // 打开自动折行配置
```

## 代码示例

```javascript
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns,
  heightMode: 'autoHeight',
  autoWrapText: true
};
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-autoheight-dktrk4)

![result](/vtable/faq/2-1.gif)

## 相关文档

- [github](https://github.com/VisActor/VTable)
