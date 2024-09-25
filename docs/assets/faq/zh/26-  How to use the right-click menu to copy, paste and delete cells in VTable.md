---
title: 4.  VTable怎么通过右键菜单来实现复制粘贴删除单元格能力？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable怎么通过右键菜单来实现复制粘贴删除单元格能力？</br>
## 问题描述

目前支持ctrl+c复制，ctrl+v粘贴。而在我们的项目需求中期望通过右键菜单然后复制或粘贴以及删除单元格的值，不知道怎么去实现这个能力。</br>
## 解决方案 

监听事件`dropdown_menu_click`来判断点击的菜单项。</br>
通过vtable的接口`getCopyValue` 获取需要复制的内容，粘贴到表格时调研接口`changeCellValues` 将值设置到单元格中。</br>
删除所选内容需要通过接口`getSelectedCellInfos`来获取选中的单元格，然后逐个单元格单元接口`changeCellValue`来赋值为空。</br>
相关接口地址：</br>
[https://visactor.io/vtable/api/Methods#getSelectedCellInfos](https%3A%2F%2Fvisactor.io%2Fvtable%2Fapi%2FMethods%23getSelectedCellInfos)
[https://visactor.io/vtable/api/Methods#changeCellValue](https%3A%2F%2Fvisactor.io%2Fvtable%2Fapi%2FMethods%23changeCellValue)</br>
## 代码示例  

```
const option = {
  menu: {
    contextMenuItems: ['复制单元格内容', '粘贴', '删除', '...']
  }
  ...
}

const tableInstance = new VTable.ListTable(container, option);

    let copyData;
    tableInstance.on('dropdown_menu_click', args => {
      console.log('dropdown_menu_click', args);
      if (args.menuKey === '复制单元格内容') {
        copyData = tableInstance.getCopyValue();
      } else if (args.menuKey === '粘贴') {
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
      } else if (args.menuKey === '删除') {
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
## 结果展示 

在线效果参考：https://visactor.io/vtable/demo/interaction/context-menu</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Q40XbCJV8oDUljxFatZcv6ppnEr.gif' alt='' width='680' height='406'>

## 相关文档

右键菜单复制粘贴删除demo：https://visactor.io/vtable/demo/interaction/context-menu</br>
下拉菜单教程：https://visactor.io/vtable/guide/components/dropdown</br>
相关api：https://visactor.io/vtable/option/ListTable#menu.contextMenuItems</br>
github：https://github.com/VisActor/VTable</br>



