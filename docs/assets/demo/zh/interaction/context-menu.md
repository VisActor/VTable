---
category: examples
group: Interaction
title: 右键菜单
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/context-menu.gif
order: 4-6
link: components/dropdown
option: ListTable#menu.contextMenuItems
---

# 右键菜单

右键弹出菜单, 如需根据点击下拉菜单的项目来继续操作，可以监听事件 dropdownmenu_click。

本例中，点击右键后会出现复制、粘贴、删除等功能的下拉菜单，点击复制后，会将选中的单元格内容复制到剪贴板，点击粘贴后，会将剪贴板中的内容粘贴到选中的单元格中，点击删除后，会将选中的单元格内容设置为空。

## 关键配置

- `menu.contextMenuItems` 配置点击右键后出现的相关功能下拉菜单

## 代码演示

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
