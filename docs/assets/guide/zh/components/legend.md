# legend 表格图例组件使用介绍
VTable表格库中的图例组件允许您配置表格的配套图例，并为它们应用不同的类型。本教程将指导您如何有效地使用这一功能。

## 示例及配置介绍
以下是一个示例离散图例配置：

```
legends: {
  type: 'discrete',
  data: [
    {
      label: 'line_5',
      shape: {
        fill: '#1664FF',
        symbolType: 'circle'
      }
    },
    {
      label: 'bar_12',
      shape: {
        fill: '#1AC6FF',
        symbolType: 'square'
      }
    }
  ],
  orient: 'bottom',
  position: 'start'
}
```
在上面的示例中，我们为图表配置了一个离散图例。示例图例位于表格下方，靠左显示；图表中有两个项目，我们分别对每个图例项目配置了名称、形状和颜色。现在让我们逐个介绍示例中配置到的选项：

- type：图例的类型，目前支持`discrete` 离散图例、`color` 颜色图例和`size`形状图例三种图例类型。
- orient：图例相对于表格的位置。可以设置为`top`、`bottom`、`left`或`right`，表示标题位于表格的顶部、底部、左侧或右侧。在示例中，我们设置为`bottom`，表示图例位置相对于表格的底部。
- position：图例的对齐方式。可以设置为`start`、`middle`或`end`，表示图例内容的对齐方向。在示例中，我们设置为`start`，表示图例内容靠左对齐。
- data：图例中显示的项目。项目中配置的：
  - label：图例中显示的文字标签
  - shape：图例中显示的形状。shape中配置的：
    - fill：图例中显示的颜色
    - symbolType：图例中显示的形状

以下是一个示例颜色图例配置：
```
legends: {
  orient: 'bottom',
  type: 'color',
  colors: ['red', 'green'],
  value: [0, 100],
  max: 120,
  min: 0
}
```
颜色图例中使用到了以下配置：
- type：图例的类型，设置为`color`
- colors：颜色图例的颜色范围，是一组颜色字符串组成的数组。
- vlaue：颜色图例显示的数值范围，是由起始数据和终止数据两个数字组成的数组。
- max：颜色图例的最大值
- min：颜色图例的最小值

以下是一个示例形状图例配置：
```
legends: {
  orient: 'right',
  type: 'size',
  sizeRange: [10, 50],
  value: [0, 100],
  max: 120,
  min: 0
}
```
形状图例中使用到了以下配置：
- type：图例的类型，设置为`size`
- sizeRange：形状图例的形状范围，是由起始size和终止size两个数字组成的数组。
- vlaue：形状图例显示的数值范围，是由起始数据和终止数据两个数字组成的数组。
- max：形状图例的最大值
- min：形状图例的最小值

请注意，以上示例仅展示了图例组件的一部分配置选项！更多配置可以转至[option说明](https://visactor.io/vtable/option/PivotChart#legends-discrete.type)