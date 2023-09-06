# Hover interaction

Hover interaction is a very useful feature when using VTable for data analytics. With hover interaction, we can highlight cells, entire rows, or entire columns of data when the mouse hovers, helping users better focus on specific information. This tutorial will describe how to use and customize hover interaction in VTable.

## Patterns of hover interaction

VTable supports four hover interaction modes: 'cross', 'column', 'row' and'cell '. By default, the hover interaction mode is'cross'. You can pass`hoverMode`Options to configure.

For example, set the hover interaction mode to line cross:

```javascript
const table = new VTable.ListTable({
  hover: {
    highlightMode: 'cross'
  }
});
```

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090a.png)

As shown in the image above, the row and column of the cell are highlighted when the mouse hovers.

## Hover interaction style

VTable allows to customize the style of hover interaction, through`theme.bodyStyle.hover`Configure.

For example, you can set the background color of a hovering cell:

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

As shown in the figure above, the background color of the cell when the mouse hovers is pink, the background color of the entire row where the mouse hovers is gold, and the background color of the entire column where the mouse hovers is green-yellow.

## Disable hover interaction

VTable allows disabling hover interaction, which is useful for some scenarios where visual interference needs to be reduced.

To disable hover interaction, you can`hover.disableHover`Options are set to`true`See also:

```javascript
const table = VTable.ListTable({
  hover: {
    disableHover: true
  }
});
```

Additionally, if you only want to disable hover interaction for header columns, you can set it as follows:

```javascript
const table = VTable.ListTable({
  hover: {
    disableHeaderHover: true
  }
});
```

In addition, there are special needs scenarios that only prohibit hover interaction for a certain column, you can use`columns.disableHeaderHover`and`columns.disableHeaderHover`Option:

    const table = new VTable.ListTable({
      columns: [
        {
        title·: 'ID',
        field:'ID',
          disableHover: true // 禁用某一列表头的hover交互
        }
      ]
    });

When hover interaction is disabled, there will be no highlighting when hovering.

So far, we have introduced the hover interaction in VTable, including interactive mode, custom style and disabling hover interaction. By mastering these functions, you can more flexibly customize the hover interaction of the table according to actual needs.
