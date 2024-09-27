---
title: 29.  How to delete the content of the selected cell using hotkeys in VTable?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

How to delete the content of the selected cell using hotkeys in VTable?</br>
## Question Description

We have implemented the editable table business scenario using the editing capabilities provided by VTable. However, there is a requirement to delete the content of the selected cell when the delete key or backspace key is pressed on the keyboard.</br>
## Solution

Currently, VTable itself does not support this feature. You can implement it yourself by listening for keyboard events and calling the VTable interface to update cell values.</br>
First, listen for the `keydown` event and call the `changeCellValue` interface to update cell values in the event.</br>
See the demo for implementation logic: [https://visactor.io/vtable/demo/interaction/context-menu](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Finteraction%2Fcontext-menu).</br>
```
    // 监听键盘事件
    document.addEventListener('keydown', (e) => {
       if (e.key === 'Delete'||e.key === 'Backspace') {
         let selectCells = tableInstance.getSelectedCellInfos();
        if (selectCells?.length > 0) {
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
    }</br>
```
## Code Examples

```
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

    // 监听键盘事件
    document.addEventListener('keydown', (e) => {
      debugger
       if (e.key === 'Delete'||e.key === 'Backspace') {
         let selectCells = tableInstance.getSelectedCellInfos();
        if (selectCells?.length > 0 ) {
          // 如果选中的是范围，则删除范围内的所有单元格
          deleteSelectRange(selectCells);
        } else {
          // 否则只删除单个单元格
          tableInstance.changeCellValue(args.col, args.row, '');
        }
      }
    });
  });

      //将选中单元格的值设置为空
    function deleteSelectRange(selectCells) {
      for (let i = 0; i < selectCells.length; i++) {
        for (let j = 0; j < selectCells[i].length; j++) {
          tableInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '');
        }
      }
    }
</br>
```


## Result Display

You can copy the code to the official website's code editor and test the effect directly.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WUYfbtUTgozP9bxfjTMc8Zn4npf.gif' alt='' width='2304' height='900'>

## Related documents

Demo of deleting data: [https://visactor.io/vtable/demo/interaction/context-menu](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Finteraction%2Fcontext-menu)</br>
Tutorial of data update: [https://visactor.io/vtable/guide/data/data_format](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fdata%2Fdata_format)</br>
Related API:</br>
https://visactor.io/vtable/api/Methods#changeCellValue</br>
github：https://github.com/VisActor/VTable</br>



