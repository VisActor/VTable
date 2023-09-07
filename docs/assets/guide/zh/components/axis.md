# title 表格坐标轴使用介绍
VTable表格库中的坐标轴组件允许您在透视图中配置单元格内的坐标轴。本教程将指导您如何有效地使用这一功能。

## 示例及配置介绍
以下是一个示例配置：

```
axes: [
  {
    type: 'band',
    visible: true,
    orient: 'bottom',
    domainLine: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: '#989999'
      }
    },
    title: {
      visible: false,
      text: '地区',
      style: {
        fontSize: 12,
        fill: '#363839',
        fontWeight: 'normal'
      }
    },
    label: {
      visible: true,
      space: 4,
      style: {
        fontSize: 12,
        fill: '#6F6F6F',
        angle: 0,
        fontWeight: 'normal'
      }
    }
  },
  {
    type: 'linear',
    orient: 'left',
    visible: true,
    domainLine: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: 'rgba(255, 255, 255, 0)'
      }
    },
    title: {
      visible: true,
      text: 'title',
      style: {
        fontSize: 12,
        fill: '#363839',
        fontWeight: 'normal'
      }
    },
    label: {
      visible: true,
      space: 8,
      style: {
        fontSize: 12,
        maxLineWidth: 174,
        fill: '#6F6F6F',
        angle: 0,
        fontWeight: 'normal'
      },
    },
  }
],
```
在上面的示例中，分别配置了下部横向的离散坐标轴和左侧纵向的连续坐标轴。现在让我们逐个介绍可供自定义的选项：

- type：坐标轴的类型，目前支持`band`和`linear`两种类型，分别对应离散和连续坐标轴。
- orient：坐标轴的位置，可以设置为`top`、`bottom`、`left`或`right`，表示坐标轴单元格位于透视图的顶部、底部、左侧或右侧。在示例中，我们设置离散坐标轴为`bottom`，相对于透视图的底部；连续坐标轴为`left`，相对于透视图的左侧。
- visible：坐标轴是否显示，支持`true`和`false`两个配置。
- domainLine：坐标轴的主轴线，支持以下配置：
  - visible：主轴线是否显示，支持`true`和`false`两个配置。
  - style：主轴线的样式，支持以下配置：
    - lineWidth：主轴线宽度。
    - stroke：主轴线颜色。
- title：坐标轴的标题，支持以下配置：
  - visible：标题是否显示，支持`true`和`false`两个配置。
  - text：标题的文本内容。
  - style：标题的样式，支持以下配置：
    - fontSize：文字大小。
    - fill：文字颜色。
    - fontWeight：文字粗细。
- laebl：坐标轴的标签，支持以下配置：
  - visible：标签是否显示，支持`true`和`false`两个配置。
  - space：标签与坐标轴的间距。
  - style：标签的样式，支持以下配置：
    - fontSize：文字大小。
    - maxLineWidth：文字显示最大宽度
    - fill：文字颜色。
    - angle：文字选择角度
    - fontWeight：文字粗细。


请注意，以上示例仅展示了轴组件的一部分配置选项！更多配置可以转至[option说明](https://visactor.io/vtable/option/PivotChart#axes)