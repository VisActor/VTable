---
category: examples
group: edit
title: 填充柄
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/fill-handle.gif
link: edit/fill-handle
option: ListTable#excelOptions.fillHandle
---

# 填充柄

选中单元格后，填充柄会显示在单元格上方，可以拖动填充柄来编辑单元格的值。或者双击填充柄来改变需要编辑单元格的值（该示例未实现该逻辑）。

## 关键配置

-`ListTable.excelOptions.fillHandle` 配置开启填充柄

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
      excelOptions: {
        fillHandle: true
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
    // 记录 拖拽填充柄之前的选中范围
    let beforeDragMaxCol;
    let beforeDragMinCol;
    let beforeDragMaxRow;
    let beforeDragMinRow;
    tableInstance.on('mousedown_fill_handle', arg => {
      const startSelectCellRange = tableInstance.getSelectedCellRanges()[0];
      beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
      beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
      beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
      beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
      console.log('mousedown_fill_handle', beforeDragMinCol, beforeDragMinRow, beforeDragMaxCol, beforeDragMaxRow);
    });
    tableInstance.on('drag_fill_handle_end', arg => {
      console.log('drag_fill_handle_end', arg);

      const direciton = arg.direction;
      let startChangeCellCol;
      let startChangeCellRow;
      let endChangeCellCol;
      let endChangeCellRow;
      const endSelectCellRange = tableInstance.getSelectedCellRanges()[0];
      //根据填充方向 确定需要填充值的范围
      if (direciton === 'bottom') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMaxRow + 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direciton === 'right') {
        startChangeCellCol = beforeDragMaxCol + 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = beforeDragMaxRow;
      } else if (direciton === 'top') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMinRow - 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direciton === 'left') {
        startChangeCellCol = beforeDragMinCol - 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = beforeDragMaxRow;
      }
      changeTableValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow);
    });
    tableInstance.on('dblclick_fill_handle', arg => {
      console.log('dblclick_fill_handle');
    });

    function changeTableValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow) {
      const startCol = Math.min(startChangeCellCol, endChangeCellCol);
      const startRow = Math.min(startChangeCellRow, endChangeCellRow);
      const endCol = Math.max(startChangeCellCol, endChangeCellCol);
      const endRow = Math.max(startChangeCellRow, endChangeCellRow);
      const values = [];
      for (let row = startRow; row <= endRow; row++) {
        const rowValues = [];
        for (let col = startCol; col <= endCol; col++) {
          rowValues.push(`col-row:${col}-${row}`);
        }
        values.push(rowValues);
      }
      tableInstance.changeCellValues(startCol, startRow, values);
    }
  });
```
