---
category: examples
group: Interaction
title: Right click menu
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/context-menu.gif
order: 4-6
link: components/dropdown
option: ListTable#menu.contextMenuItems
---

# Right click menu

Right-click pop-up menu, if you need to click on the drop-down menu to continue the operation, you can listen to the event dropdownmenu_click.

In this example, after clicking the right mouse button, a copy, paste, delete and other functions will appear in the drop-down menu. After clicking the copy, the selected cell content will be copied to the clipboard, after clicking paste, the content in the clipboard will be pasted to the selected cell, and after clicking delete, the content of the selected cell will be set to empty.

## Key Configurations

- `menu.contextMenuItems` Configure the relevant function drop-down menu that appears after right-clicking

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      menu: {
        contextMenuItems: ['copy', 'paste', 'delete', '...']
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

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
  });
```
