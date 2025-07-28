---
title: 6. How can VTable implement a capability similar to the Excel fill handle to batch modify cells?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Background Feature

Users have the requirement to filter tables first and then update them in batches. This operation is similar to Excel's drag-and-drop fill capability, which can greatly improve user operation efficiency.</br>
Expected results:</br>


## Configuration instructions

1. fillHandle</br>
fillHandle is a configuration option that allows the user to fill or modify multiple cells by dragging the cell corners. To enable the fill handle, make sure this option is configured when initializing the table.</br>
```
const visactorOptions = {
  fillHandle: true, // 启用填充手柄
};</br>
```
## Event Handling

1. mousedown_fill_handle</br>
When the user starts dragging the fill handle, the `mousedown_fill_handle` event is triggered. You can prepare some necessary data in this event.</br>
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
### 2. drag_fill_handle_end

When the dragging operation of the fill handle ends, the `drag_fill_handle_end` event is triggered</br>
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
## API Usage

1. changeCellValues</br>
`changeCellValues` allows programmatic modification of the values of one or more cells in a table.</br>
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

fillHandle demo：https://visactor.io/vtable/demo/edit/fill-handle</br>
fillHandle tutorial：https://visactor.io/vtable/guide/edit/fill_handle</br>
Related pi：https://visactor.io/vtable/option/ListTable#excelOptions.fillHandle</br>
github：https://github.com/VisActor/VTable</br>

