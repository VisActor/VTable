# 拖拽表头换位

在复杂数据表格中，列的顺序可能会影响我们对数据的分析和理解。有时我们需要在列之间进行对比，而这些列在初始表格中可能相距较远，拖拽表头换位功能就能够让我们快速调列顺序，提高数据分析效率。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20e.gif)

## 开启换位功能

默认情况下，VTable 的拖拽表头换位功能处于关闭状态。要启用此功能，需要将 `dragHeaderMode` 设置为 `'all'`、`'column'` 或 `'row'`。其中：

*   `'all'` 表示所有表头均可换位
*   `'none'` 表示不可换位
*   `'column'` 表示只有列表头可换位
*   `'row'` 表示只有行表头换位

```javascript
const table = new VTable.ListTable({
  dragHeaderMode: 'all'
});
```

配置好 `dragHeaderMode` 之后，您就可以拖拽表头进行换位了。

## 换位标记线样式配置

我们可以为换位标记线配置样式，以便更好地呈现表格的外观。通过设置 `theme.dragHeaderSplitLine`，可以实现这一功能，具体配置项有：

*   `'lineColor'` 拖拽标记线的颜色
*   `'lineWidth'` 拖拽标记线的线宽
*   `'shadowBlockColor'` 拖拽时阴影区域的颜色

以下是一个配置示例：

```javascript
const table = new VTable.ListTable({
  theme: {
    dragHeaderSplitLine: {
      lineColor: 'red',
      lineWidth: 2,
      shadowBlockColor: 'rgba(255,0,0,0.3)'
    }
  }
});
```

在这个示例中，我们将拖拽表头换位的标记线颜色设置为红色，并设置了边框线宽为 2，以及透明度为0.3的红色阴影。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090c.png)

## 禁止某一列换位

有时候，我们不希望某些列参与拖拽换位。针对这种需求，VTable 提供了针对列的配置项 columns.dragHeader。通过为某一列配置 `columns.dragHeader: false`，可以禁止该列拖拽换位。

    const table = new VTable.ListTable({
      columns: [
        { title: '日期', cellType: 'text', dragHeader: true },
        { title: '销量', cellType: 'text', dragHeader: false },
        { title: '销售额', cellType: 'text', dragHeader: true }
      ]
    });

如上述代码，“销量”列不可拖拽换位。

至此，我们已经介绍了 VTable 的拖拽表头换位功能，括拖拽表头换位功能的开启、拖拽表头换位标记线的样式配置以及某一列是否可以拖拽。通过掌握这些功能，您可以更便捷地在 VTable 中进行数据分析与处理。
