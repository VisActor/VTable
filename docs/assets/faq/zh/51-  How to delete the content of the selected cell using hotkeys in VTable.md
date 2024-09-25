---
title: 29.  VTable怎么通过快捷键将选中单元格的内容删除掉？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable怎么通过快捷键将选中单元格的内容删除掉？</br>
## 问题描述

通过VTable提供的编辑能力，实现了可编辑表格的业务场景。不过目前有个需求：VTable是否可以实现当在键盘上按下delete键或者backspace时，将选中单元格内容给删除掉。</br>
## 解决方案 

目前VTable本身还不支持这个能力，可以通过监听键盘事件调用VTable的接口来自行实现该能力。</br>
首先监听事件`keydown`，在事件中调用更新单元格值的接口`changeCellValue`。</br>
实现逻辑参考demo：https://visactor.io/vtable/demo/interaction/context-menu。</br>
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
## 代码示例  

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


## 结果展示 

可以将代码复制到官网的代码编辑器中直接测试效果。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MUBWbAPIQog37oxDxbWc8BtLn3c.gif' alt='' width='2304' height='900'>

## 相关文档

删除数据demo：https://visactor.io/vtable/demo/interaction/context-menu</br>
数据更新教程：https://visactor.io/vtable/guide/data/data_format</br>
相关api：https://visactor.io/vtable/api/Methods#changeCellValue</br>
github：https://github.com/VisActor/VTable</br>



