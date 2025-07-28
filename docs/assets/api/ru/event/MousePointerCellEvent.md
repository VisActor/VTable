{{ target: MousePointerCellEvent }}
Определение типа параметра функции обратного вызова события MousePointerCellEvent:

```
{
  col: число;
  row: число;
  rect?: RectProps;
  x?: число;
  y?: число;
  ranges: CellRange[];
  title?: строка;
  /**Имя измерения */
  field?: строка;
  /**Пути заголовков строк ячеек */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Позиция ячейки */
  cellRange?: RectProps;
  /**Данные всей строки - исходные данные */
  originData?: любой;
  /**Отформатированное значение */
  значение?: строка|число;
  /**Исходное значение */
  dataValue?: строка|число;
  cellLocation?: CellLocation;
  cellType?: строка;
  related?: CellAddress;
  scaleRatio?: число;
  targetIcon?: { name: строка; позиция: RectProps; funcType: строка };
  event?: MouseEvent | PointerEvent | TouchEvent;
}

```

Включает:
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}