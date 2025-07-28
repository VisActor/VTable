# fill handle

в the таблица editing scenario, we provide the fill handle capability, which can be включен through the configuration item `fillHandle: true`. The fill handle can help users quickly fill в cell values и improve editing efficiency.

включить the fill handle capability configuration item:

```javascript
{
  excelOptions: {
    fillHandle: true;
  }
}
```

More capabilities similar к excel editing operations will be expanded в excelOptions в the future.

# How к use the fill handle

Vтаблица only implements the fill handle effect от the UI level, и the actual fill content generation logic needs к be implemented по the business side.

When fillHandle: true is configured, the fill handle иконка will be автоmatically displayed в the lower право corner.

![fill-handle-иконка](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/fill-handle-иконка.jpeg)

следующий, we will introduce the process из combining событиеs к populate content.

## 1. списокen к the `mousedown_fill_handle` событие

This событие is triggered when the mouse Нажатьs на the fill handle иконка. Вы можете obtain the текущий selection range по списокening к this событие в order к prepare для subsequent generation из cell content.

```javascript
таблицаInstance.на('mousedown_fill_handle', arg => {
  const startSelectCellRange = таблицаInstance.getSelectedCellRanges()[0];
  beforeDragMaxCol = Math.max(startSelectCellRange.начало.col, startSelectCellRange.конец.col);
  beforeDragMinCol = Math.min(startSelectCellRange.начало.col, startSelectCellRange.конец.col);
  beforeDragMaxRow = Math.max(startSelectCellRange.начало.row, startSelectCellRange.конец.row);
  beforeDragMinRow = Math.min(startSelectCellRange.начало.row, startSelectCellRange.конец.row);
  console.log('mousedown_fill_handle', beforeDragMinCol, beforeDragMinRow, beforeDragMaxCol, beforeDragMaxRow);
});
```

## 2. списокen к the `drag_fill_handle_end` событие

This событие is triggered по releasing the mouse after dragging the fill handle. по списокening к this событие, Вы можете learn the direction из the fill handle и the specific range из cells that need к be filled.

Call the интерфейс `getSelectedCellRange()` as в the предыдущий step к know the currently selected range. Combined с the direction из the fill handle, Вы можете calculate the range из cells that need к be filled.

Вы можете also call the интерфейс `getSelectedCellInfos()` к get the значение из the currently selected cell.

## 3. Fill в the content into the таблица

The above two steps generate the content that needs к be filled, и use the интерфейс `changeCellValues` к change the значение из the cell.

интерфейс definition: https://visactor.io/vтаблица/апи/методы#changeCellValues

# Double-Нажать the fill handle иконка событие

The `dblНажать_fill_handle` событие is triggered when the fill handle иконка is double-Нажатьed. Вы можете fill subsequent cell contents по списокening к this событие.

# пример демонстрация

пример address: https://visactor.io/vтаблица/демонстрация/edit/fill-handle
