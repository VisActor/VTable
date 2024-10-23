---
title: 6. VTable如何实现类似Excel填充柄能力来批量修改单元格？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 背景需求

用户对表格有**先筛选，再批量更新**的诉求。该操作对标Excel的拖拽填充能力，可以极大提高用户操作效率。</br>
效果预期：</br>
## **配置说明**

### **1. **`**fillHandle**`

`fillHandle` 是一个配置选项，允许用户通过拖拽单元格角落来填充或修改多个单元格。为了启用填充手柄，请确保在初始化表格时配置了此选项。</br>
```
const visactorOptions = {
  fillHandle: true, // 启用填充手柄
};</br>
```
## **事件处理**

### **1. **`**mousedown_fill_handle**`

当用户开始拖动填充手柄时，会触发 `mousedown_fill_handle` 事件。您可以在此事件中准备一些必要的数据。</br>


```
// 记录 拖拽填充柄之前的选中范围
    let beforeDragMaxCol: number;
    let beforeDragMinCol: number;
    let beforeDragMaxRow: number;
    let beforeDragMinRow: number;

vtableInstance.addEventListener('mousedown_fill_handle', function(event) {
    const startSelectCellRange = tableInstance.getSelectedCellRanges()[0];
      beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
      beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
      beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
      beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
});</br>
```
### **2. **`**drag_fill_handle_end**`

当填充手柄的拖动操作结束时，会触发 `drag_fill_handle_end` 事件</br>
```
vtableInstance.addEventListener('drag_fill_handle_end', function(event) {
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
});</br>
```
## **API 使用**

### **1. **`**changeCellValues**`

`changeCellValues` 允许程序化地修改表格中一个或多个单元格的值。</br>
```
  const changeTableValues = useCallback((startChangeCellCol: number, startChangeCellRow: number, endChangeCellCol: number, endChangeCellRow: number) => {
    const startCol = Math.min(startChangeCellCol, endChangeCellCol);
    const startRow = Math.min(startChangeCellRow, endChangeCellRow);
    const endCol = Math.max(startChangeCellCol, endChangeCellCol);
    const endRow = Math.max(startChangeCellRow, endChangeCellRow);
    const values = [];
    for (let row = startRow; row <= endRow; row++) {
      const rowValues = [];
      for (let col = startCol; col <= endCol; col++) {
        rowValues.push(clickedCellValue);
      }
      values.push(rowValues);
    }
     // values：[['第一行第一列的值', '第一行第二列的值'],['第二行第一列', '第二行第二列']]
    window['tableInstance'].changeCellValues(startCol, startRow, values); // 表格更新
    // toto: 在这里调用后端接口update

  }, [clickedCellValue]);</br>
```
## Related Documents

填充柄demo：https://visactor.io/vtable/demo/edit/fill-handle</br>
填充柄教程：https://visactor.io/vtable/guide/edit/fill_handle</br>
相关api：https://visactor.io/vtable/option/ListTable#excelOptions.fillHandle</br>
github：https://github.com/VisActor/VTable</br>

