# hover交互

在使用VTable进行数据分析时，hover交互是一个非常实用的功能。通过hover交互，我们可以在鼠标悬停时高亮显示单元格、整行或整列数据，从而帮助用户更好地关注特定信息。本教程将介绍如何在VTable中使用和定制hover交互。

## hover交互的模式

VTable支持四种hover交互模式，分别为：十字交叉（'cross'）、整列（'column'）、整行（'row'）和单个单元格（'cell'）。默认情况下，hover交互模式为十字交叉（'cross'）。可以通过`hoverMode`选项进行配置。

例如，将hover交互模式设置为行列交叉：

```javascript
const table = new VTable.ListTable({
  hover: {
    highlightMode: 'cross'
  }
});
```

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090a.png)

如上图所示，鼠标悬停时单元格所在行列都被高亮显示。

## hover交互的样式

VTable允许自定义hover交互的样式，通过`theme.bodyStyle.hover`配置。

例如，可以设置悬停单元格的背景颜色：

```javascript
const table = new VTable.ListTable({
  theme:
    VTable.themes.ARCO.extends({
      bodyStyle: {
        hover:{
          cellBgColor:'#FFC0CB',
          inlineRowBgColor: '#FFD700', // 金色
          inlineColumnBgColor: '#ADFF2F' // 绿黄色
        }
      }
    })
});
```

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0c.png)

如上图所示，鼠标悬停时单元格背景颜色为粉红色，鼠标悬停时所在整行背景颜色为金色，所在整列背景颜色为绿黄色。

## 禁用hover交互

VTable允许禁用hover交互，这对于某些需要降低视觉干扰的场景非常有用。

要禁用hover交互，可以将`hover.disableHover`选项设置为`true`：

```javascript
const table = VTable.ListTable({
  hover: {
    disableHover: true
  }
});
```

此外，如果只希望禁用表头列的hover交互，可以设置如下：

```javascript
const table = VTable.ListTable({
  hover: {
    disableHeaderHover: true
  }
});
```

另外有特殊需求场景只针对某一列设置禁止hover交互，可以使用`columns.disableHeaderHover`及`columns.disableHeaderHover`选项：

    const table = new VTable.ListTable({
      columns: [
        {
        title·: 'ID',
        field:'ID',
          disableHover: true // 禁用某一列表头的hover交互
        }
      ]
    });

禁用hover交互后，鼠标悬停时将不会出现高亮效果。

至此，我们已经介绍了VTable中的hover交互，包括交互模式、自定义样式及禁用hover交互等功能。通过对些功能的掌握，您可以根据实际需求更灵活地定制表格的hover交互。
