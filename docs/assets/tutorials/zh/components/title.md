# title 表格标题使用介绍
VTable表格库中的标题组件允许您配置表格的主标题和副标题，并为它们应用不同的样式。本教程将指导您如何有效地使用这一功能。

## 示例及配置介绍
以下是一个示例配置：

```
title: {
      text: 'North American supermarket sales analysis',
      subtext: `The data includes 15 to 18 years of retail transaction data for North American supermarket`,
      orient: 'top',
      padding:20,
      textStyle:{
        fontSize:30,
        fill: 'black'
      },
      subtextStyle:{
        fontSize:20,
        fill: 'blue'
      }
    },
```
在上面的示例中，我们将主标题设置为'North American supermarket sales analysis'，副标题设置为'The data includes 15 to 18 years of retail transaction data for North American supermarket'。现在让我们逐个介绍可供自定义的选项：

- text：主标题的文本内容。
- subtext：副标题的文本内容。
- orient：标题的方向。可以设置为'top'、'bottom'、'left'或'right'，表示标题位于表格的顶部、底部、左侧或右侧。在示例中，我们设置为'top'，表示标题位于表格的顶部。
- padding：标题的内边距。可以设置为一个数字，表示标题与表格边缘之间的间距。在示例中，我们将其设置为20。
- textStyle：主标题的样式设置。可以通过该选项设置字体大小、颜色等样式属性。在示例中，我们将字体大小设置为30，颜色设置为'black'。
- subtextStyle：副标题的样式设置。可以通过该选项设置字体大小、颜色等样式属性。在示例中，我们将字体大小设置为20，颜色设置为'blue'。
通过使用以上配置，您可以定制主副标题的内容和样式，使其更符合您的需求和设计风格。

请注意，以上示例仅展示了标题组件的一部分配置选项！更多配置可以转至[option说明](https://visactor.io/vtable/option/ListTable#title.visible)