# Select cell

## Mouse click selection

When using VTable for data analytics, individual cells can be selected with a mouse click. Once a cell is selected, you can manipulate the cell or get the corresponding data. By default, VTable allows click-to-select cells.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20d.png)

As shown above, after clicking on cell (2,3), the cell is selected.

Clicking on the header cell will select the entire row or column by default. If you only want to select the current cell, you can set `select.headerSelectMode` to `'cell'`, Or if you only want to select cells in the body, you can set `select.headerSelectMode` to `'body'`.

## Mouse box selection

In addition to clicking on a single cell, VTable also supports mouse box selection, which can select multiple cells by dragging the mouse. This feature allows the user to select multiple cells at once (Hold down ctrl or shift to make multiple selections). By default, VTable has mouse box selection turned on.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60f.png)

As shown in the image above, the user selects multiple cells by dragging the mouse.

## Call interface selection

A certain business scenario, such as linkage selection with other modules, is not a manual mouse-triggered selection. The selection can be completed with the help of the interface.

### Single cell selection

Usage is as follows:

```
// Select cells in 4 columns and 5 rows
tableInstance.selectCell(4,5);
```

### Cell range selected

Call the interface selectCells, the usage is as follows:

```
// Two ranges in the table: from column 1, row 2 to column 4, row 2 and from column 3, row 5 to column 7, row 8
tableInstance.selectCells([{start:{col:1,row:2},end:{col:4,row:2}},{start:{col:3,row:5},end:{col:7 ,row:8}}]);
```

### Clear current selection

call api `clearSelected`.

## Select style

When one or more cells are selected, VTable applies specific styles to enable the user to identify the selected cells. can be passed `theme.selectionStyle` Configure the selected style.

For example, to set the background color of the selected cell to purple, you can configure it like this:

```javascript
const = new VTable.ListTable({
  theme: {
    selectionStyle: {
        cellBorderLineWidth: 2,
        cellBorderColor: '#9900ff',
        cellBgColor: 'rgba(153,0,255,0.2)',
    }
  }
});
```

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270909.png)

As shown in the image above, the background color of the selected cell is purple.

## Select and highlight the entire row and column

Clicking a cell may require highlighting the entire row or column, which can be achieved through the following configuration:

```
  select: {
    highlightMode: 'cross' // can be configured as 'cross' or 'row' or 'column'
  }
```

Note: If you select multiple cells, the highlight effect will disappear.

The highlighting style can be configured in the style.

Global configuration: in `theme.selectionStyle`, the specific configuration method is:

```
theme:{
  selectionStyle:{
    inlineRowBgColor: 'rgb(160,207,245)',
    inlineColumnBgColor: 'rgb(160,207,245)'
  }
}
```

You can also configure headerStyle and bodyStyle separately. The specific configuration method is:

```
theme:{
  headerStyle: {
    select: {
      inlineRowBgColor: 'rgb(0,207,245)',
      inlineColumnBgColor: 'rgb(0,207,245)'
    }
  },
  bodyStyle: {
    select: {
      inlineRowBgColor: 'rgb(0,207,245)',
      inlineColumnBgColor: 'rgb(0,207,245)'
    }
  }
}
```

## Choose to copy cell contents

VTable provides a copy shortcut function, users can set `keyboardOptions.copySelected` for `true`, to enable the shortcut copy function:

```javascript
const table = new VTable.ListTable({
  keyboardOptions: {
    copySelected: true
  }
});
```

After enabling shortcut keys, users can use the browser's built-in copy shortcut keys (such as Ctrl+C, Cmd+C) to copy the selected cell content. VTable maintains two copy formats:

```
new ClipboardItem({
'text/html': new Blob([dataHTML], { type: 'text/html' }),
'text/plain': new Blob([data], { type: 'text/plain' })
})
```

For specific implementation logic, please refer to the code logic https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/event/listener/container-dom.ts

**Copy other related content:**

1. There is also an event called `copy_data` to match the copying of content. This event will be triggered when copying and return the content copied to the clipboard.

2. If you want to obtain the selected content as the copy content through the interface, you can call the interface `getCopyValue`.

3. In addition, we provide the configuration item `formatCopyValue` to format the copied content. For example, if you want to add a suffix `"Copy content from XXXX"` to the copied content

## Open Select All

When operating on table data, the user may want to shortcut all the contents of the table. The Open Select All function allows the user to select all the contents of the table at once by holding down the Ctrl key and pressing the A key. It should be noted that this function is turned off by default, and the Select All function is turned on with the following configuration:

```
    keyboardOptions: {
        selectAllOnCtrlA?: boolean | SelectAllOnCtrlAOption;
    }
```

If you do not want to select the table header or row number column at the same time, you can configure it according to `SelectAllOnCtrlAOption`.

## Disable Select Interaction

In some cases, you may not want the user to select a cell `select` Configuration disables selection interaction.

For example, to disable selection interactions for all cells, you can `select.disableSelect` Set to `true`:

```javascript
const table new VTable.ListTable({
  select: {
    disableSelect: true
  }
});
```

To disable the selection of header cells, you can `select.disableHeaderSelect` Set to `true`:

```javascript
const table = new VTable.ListTable({
  select: {
    disableHeaderSelect: true
  }
});
```

After disabling selection interaction, the user cannot select cells by clicking or dragging the mouse.

There are special needs that do not want users to be able to select certain columns in the table. For this requirement, VTable provides a configuration item column.disableSelect and disableHeaderSelect on the column, which allows us to prohibit the selection of a certain column \[PivotTable does not have this configuration].

So far, we have introduced the cell selection functions of VTable, including mouse click selection, mouse box selection, disabling interaction selection, selecting styles, and choosing to copy cell content. By mastering these functions, you can more easily perform data analytics and processing in VTable.
