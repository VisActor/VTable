---
title: 4.  How to use the right-click menu to copy, paste and delete cells in VTable?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Title

How to use the right-click menu to copy, paste and delete cells in VTable?</br>
## Description

Currently, ctrl+c is supported for copying and ctrl+v for pasting. However, in our project requirements, we expect to use the right-click menu to copy, paste, and delete cell values, but we don't know how to implement this capability.</br>
## Solution

Listen to the event `dropdown_menu_click` to determine the clicked menu item.</br>
Get the content to be copied through the vtable interface `getCopyValue`, and when pasting it into the table, investigate the interface `changeCellValues` to set the value to the cell.</br>
To delete the selected content, you need to get the selected cells through the `getSelectedCellInfos` interface, and then assign the value to empty for each cell through the `changeCellValue` interface.</br>
Related interface addresses:</br>
[https://visactor.io/vtable/api/Methods#getSelectedCellInfos](https%3A%2F%2Fvisactor.io%2Fvtable%2Fapi%2FMethods%23getSelectedCellInfos)
[https://visactor.io/vtable/api/Methods#changeCellValue](https%3A%2F%2Fvisactor.io%2Fvtable%2Fapi%2FMethods%23changeCellValue)</br>
## Code Example

```
const option = {
  menu: {
    contextMenuItems: ['copy', 'paste', 'delete', '...']
  }
  ...
}

const tableInstance = new VTable.ListTable(container, option);

    let copyData;
    tableInstance.on('dropdown_menu_click', args => {
      console.log('dropdown_menu_click', args);
      if (args.menuKey === 'copy') {
        copyData = tableInstance.getCopyValue();
      } else if (args.menuKey === 'paste') {
        const rows = copyData.split('\n'); // 将数据拆分为行
        const values = [];
        rows.forEach(function (rowCells, rowIndex) {
          const cells = rowCells.split('\t'); // 将行数据拆分为单元格
          const rowValues = [];
          values.push(rowValues);
          cells.forEach(function (cell, cellIndex) {
            // 去掉单元格数据末尾的 '\r'
            if (cellIndex === cells.length - 1) {
              cell = cell.trim();
            }
            rowValues.push(cell);
          });
        });
        tableInstance.changeCellValues(args.col, args.row, values);
      } else if (args.menuKey === 'delete') {
        let selectCells = tableInstance.getSelectedCellInfos();
        if (selectCells?.length > 0 && cellIsSelectRange(args.col, args.row, selectCells)) {
          // 如果选中的是范围，则删除范围内的所有单元格
          deleteSelectRange(selectCells);
        } else {
          // 否则只删除单个单元格
          tableInstance.changeCellValue(args.col, args.row, '');
        }
      }
    });
    //将选中单元格的值设置为空
    function deleteSelectRange(selectCells) {
      for (let i = 0; i < selectCells.length; i++) {
        for (let j = 0; j < selectCells[i].length; j++) {
          tableInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '');
        }
      }
    }
    // 判断单元格col,row是否在选中范围中
    function cellIsSelectRange(col, row, selectCells) {
      for (let i = 0; i < selectCells.length; i++) {
        for (let j = 0; j < selectCells[i].length; j++) {
          if (selectCells[i][j].col === col && selectCells[i][j].row === row) {
            return true;
          }
        }
      }
      return false;
    }
  });</br>
```
## Results

Online effect reference: https://visactor.io/vtable/demo/interaction/context-menu</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/SOk8bkNyLo4CLCx0PcvcvQEfnSh.gif' alt='' width='680' height='406'>

## Related Documents

Right-click menu Copy Paste Delete demo：https://visactor.io/vtable/demo/interaction/context-menu</br>
Dropdown menu tutorial：https://visactor.io/vtable/guide/components/dropdown</br>
Related api：https://visactor.io/vtable/option/ListTable#menu.contextMenuItems</br>
github：https://github.com/VisActor/VTable</br>



