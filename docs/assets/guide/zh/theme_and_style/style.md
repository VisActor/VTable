# 样式 Style 介绍

表格样式配置提供了灵活性和自定义性，使用户能够根据每一列的业务数据类型来设计和美化表格展现形式，如果需要从表格整体考虑样式可以使用[theme](../../guide/theme_and_style/theme)。

本文档将介绍如何使用 style、headerStyle 来配置表格样式，以帮助用户更好地理解和使用这些功能。

## 简单介绍

VTable 中单元格的 style 细化配置，包括单元格样式、表头单元格样式等，样式的配置以列为一组分别配置（如果是转置表格的话，以行为一组配置 style）。

## 表头单元格样式配置

在 columns 的每一项中配置 headerStyle，如果是在透视表则对应的是 columns 和 rows。示例代码：

     import * as vTable from '@visactor/vtable';

     const option: vTable.ListTableConstructorOptions = {
     columns: [
      {
        field: 'id',
        title: 'ID',
        headerStyle: {
          bgColor: 'red',
          autoWrapText: true,
          lineHeight: 20,
          lineClamp: 'auto',
          textBaseline: "top",
          color:"yellow"
        },
      }
      ...
    ];

    const tableInstance = new VTable.ListTable(option);

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0b.png)

## body 单元格样式配置

在 columns 的每一项中配置 style，如果是在透视表则对应的是 columns 和 rows。示例代码：

     import * as vTable from '@visactor/vtable';

     const option: vTable.ListTableConstructorOptions = {
     columns: [
      {
        field: 'id',
        title: 'ID',
        style: {
          bgColor: 'green',
          autoWrapText: true,
          lineHeight: 20,
          lineClamp: 'auto',
          textBaseline: "top",
          color:"yellow"
        },
      }
      ...
    ];

    const tableInstance = new VTable.ListTable(option);

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270908.png)

style 提供了一系列的单元格配置式，简要介绍如下。

## 具体介绍

### 单元格背景色

`bgColor`：定义单元格的背景色。使用字符串或者函数参数形式进行颜色设置。

### 文字样式

- `textAlign`：定义单元格内文字的水平对齐方式
- `textBaseline`：定义单元格内文字的垂直对齐方式
- `color`：定义单元格的文字颜色
- `fontSize`：定义单元格文字大小
- `fontFamily`：定义单元格的文字字体
- `fontWeight`：定义单元的文字字体粗细
- `fontVariant`：定义单元格的文字字粗细
- `fontStyle`：定义单元格的文字字体样式

这些设置可以方便调整单元格中的文本呈现效果。

### 边框

包含如下配置项：

- `borderColor`为单元格设置边框的颜色
- `borderLineWidth`：单元格设置边框的宽度
- `borderLineDash`：为单元设置边框的线条虚线样式

### 行高、换行设置

- `lineHeight`：为单格内容设置文字行高
- `textOverflow`：设置文本的省略形式。如果 autoWrapText 设置自动换行，该配置无效

### 下划线、划线设置

- `underline`：为单格设置下划线
- `underlineDash`：下划线的虚线样式。
- `underlineOffset`：下划线与文字的间隔距离。
- `lineThrough`：为单元格文字中划线

### 链接文本颜色

`linkColor`：设置 link 类型的文本色。

### 鼠标悬停样式

`cursor`：鼠标 hover 到单元格的鼠标样式

### 文本吸附效果

`textStick`：设置元格的文本是否带有吸附果【当滚动时可动态调整单元格内容位置】，可以设置为 true 开启， 或者设置 'horizontal' 或 'vertical' 指定仅在哪个方向吸附。
`textStickBaseOnAlign`：当单元格的文本有吸附效果【当滚动时文本可动态调整位置】时，吸附的基准是单元格的水平对齐方式。例如当`textStickBaseOnAlign`为`true`时，`textAlign`为`'center'`时，文本会吸附在单元格的水平中心位置；否则就会吸附在单元格左边缘或右边缘（依据滚动位置决定）

### 单元格标记

`marked`：设置单元格是否有记样式

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/cell-marked.jpeg)

### 自动换行

`autoWrapText`：设置单元格自动换行

### 最大行数设置

- `lineClamp`：设置单元的最大行数, 可设置 number 或者 'auto'，设置为 'auto'，则会自动计算

### 单元格内边距

- `padding`：定义单元格的内边距

单元格的宽高是包括了两部分，padding 内边距和内容

通过以上介绍，您已经掌握了 VTable 中样式 Style 的使用方法，接来就可以根据需求创建具有个性化风格的表格。

## 自定义样式

如果有不同单元格不同样式的需求，可以使用 style 的函数写法：

```
style: (args)=>{
  if(args.value>10)
    return {color: 'red'};
  return {color: 'green'};
}

```

或者 style 中某个样式设置成函数

```
style: {
  color(args){
    if(args.value>10)
      return 'red';
    return 'green';
  }
}

```

或者使用样式注册，通过接口调用来变更样式，具体可参考教程：https://visactor.io/vtable/guide/custom_define/custom_style
