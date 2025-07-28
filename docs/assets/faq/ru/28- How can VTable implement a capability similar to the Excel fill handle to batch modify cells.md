---
заголовок: 6. How can Vтаблица implement a capability similar к the Excel fill handle к batch modify cells?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## фон Feature

Users have the requirement к filter таблицаs первый и then update them в batches. This operation is similar к Excel's перетаскивание-и-отпускание fill capability, which can greatly improve user operation efficiency.</br>
Expected results:</br>


## Configuration instructions

1. fillHandle</br>
fillHandle is a configuration option that allows the user к fill или modify multiple cells по dragging the cell corners. к включить the fill handle, make sure this option is configured when initializing the таблица.</br>
```
const visactorOptions = {
  fillHandle: true, // 启用填充手柄
};</br>
```
## событие Handling

1. mousedown_fill_handle</br>
When the user starts dragging the fill handle, the `mousedown_fill_handle` событие is triggered. Вы можете prepare некоторые necessary данные в this событие.</br>
```
// 记录 拖拽填充柄之前的选中范围
    let beforeDragMaxCol: число;
    let beforeDragMinCol: число;
    let beforeDragMaxRow: число;
    let beforeDragMinRow: число;

vтаблицаInstance.addсобытиесписокener('mousedown_fill_handle', функция(событие) {
    const startSelectCellRange = таблицаInstance.getSelectedCellRanges()[0];
      beforeDragMaxCol = Math.max(startSelectCellRange.начало.col, startSelectCellRange.конец.col);
      beforeDragMinCol = Math.min(startSelectCellRange.начало.col, startSelectCellRange.конец.col);
      beforeDragMaxRow = Math.max(startSelectCellRange.начало.row, startSelectCellRange.конец.row);
      beforeDragMinRow = Math.min(startSelectCellRange.начало.row, startSelectCellRange.конец.row);
});</br>
```
### 2. drag_fill_handle_end

When the dragging operation из the fill handle ends, the `drag_fill_handle_end` событие is triggered</br>
```
vтаблицаInstance.addсобытиесписокener('drag_fill_handle_end', функция(событие) {
   const direciton = arg.direction;
      let startChangeCellCol;
      let startChangeCellRow;
      let endChangeCellCol;
      let endChangeCellRow;
      const endSelectCellRange = таблицаInstance.getSelectedCellRanges()[0];
      //根据填充方向 确定需要填充值的范围
      if (direciton === 'низ') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMaxRow + 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.конец.row;
      } else if (direciton === 'право') {
        startChangeCellCol = beforeDragMaxCol + 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.конец.col;
        endChangeCellRow = beforeDragMaxRow;
      } else if (direciton === 'верх') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMinRow - 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.конец.row;
      } else if (direciton === 'лево') {
        startChangeCellCol = beforeDragMinCol - 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.конец.col;
        endChangeCellRow = beforeDragMaxRow;
      }
      changeтаблицаValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow);
});</br>
```
## апи Usвозраст

1. changeCellValues</br>
`changeCellValues` allows programmatic modification из the values из one или more cells в a таблица.</br>
```
  const changeтаблицаValues = useCallback((startChangeCellCol: число, startChangeCellRow: число, endChangeCellCol: число, endChangeCellRow: число) => {
    const startCol = Math.min(startChangeCellCol, endChangeCellCol);
    const startRow = Math.min(startChangeCellRow, endChangeCellRow);
    const endCol = Math.max(startChangeCellCol, endChangeCellCol);
    const endRow = Math.max(startChangeCellRow, endChangeCellRow);
    const values = [];
    для (let row = startRow; row <= endRow; row++) {
      const rowValues = [];
      для (let col = startCol; col <= endCol; col++) {
        rowValues.push(НажатьedCellValue);
      }
      values.push(rowValues);
    }
     // values：[['第一行第一列的值', '第一行第二列的值'],['第二行第一列', '第二行第二列']]
    window['таблицаInstance'].changeCellValues(startCol, startRow, values); // 表格更新
    // toto: 在这里调用后端接口update

  }, [НажатьedCellValue]);</br>
```
## Related Documents

fillHandle демонстрация：https://visactor.io/vтаблица/демонстрация/edit/fill-handle</br>
fillHandle tutorial：https://visactor.io/vтаблица/guide/edit/fill_handle</br>
Related pi：https://visactor.io/vтаблица/option/списоктаблица#excelOptions.fillHandle</br>
github：https://github.com/VisActor/Vтаблица</br>

