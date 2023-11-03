# 怎么在数据分析报表类的表格中显示用户信息，如：“头像+姓名”组合效果？

## 问题描述

我希望用比较简单的方式在数据报表表格的一个单元格中同时绘制头像和姓名。如何在VTable中实现？

![](/vtable/faq/9-0.png)

## 解决方案

在 VTable 中可以通过两种方式实现：一种是借助 icon，也是最省事的一直，icon 的来源直接设置为资源 field，具体可以参考我给出的 demo。另外一种方式是通过自定义渲染，该方式需要熟悉这种写法，但能实现更复杂的效果。

## 代码示例

```javascript
const columns: VTable.ColumnsDefine = [
  {
    field: "name",
    title: "name",
    width: "auto",
    cellType: "link",
    templateLink: "https://www.google.com.hk/search?q={name}",
    linkJump: true,
    icon: {
      type: "image",
      src: "image1",
      name: "Avatar",
      shape: "circle",
      //定义文本内容行内图标，第一个字符展示
      width: 30, // Optional
      height: 30,
      positionType: VTable.TYPES.IconPosition.contentLeft,
      marginRight: 20,
      marginLeft: 0,
      cursor: "pointer"
    }
  },
  ...
  ]
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-photo-username-ypndvm?file=/src/index.ts)

![result](/vtable/faq/9-1.png)

## 相关文档

- [自定义 icon 教程](https://visactor.io/vtable/guide/custom_define/custom_icon)
- [相关 demo](https://visactor.io/vtable/demo/custom-render/custom-cell-layout)
- [相关 api](https://visactor.io/vtable/option/ListTable-columns-text#icon.ImageIcon.src)
- [github](https://github.com/VisActor/VTable)
