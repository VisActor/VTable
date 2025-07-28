{{ target: MousePointerCellEvent }}
Определение типа параметра функции обратного вызова события MousePointerCellEvent:

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
  title?: string;
  /**Имя измерения */
  field?: string;
  /**Пути заголовков строк ячеек */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Позиция ячейки */
  cellRange?: RectProps;
  /**Данные всей строки - исходные данные */
  originData?: any;
  /**Отформатированное значение */
  value?: string|number;
  /**Исходное значение */
  dataValue?: string|number;
  cellLocation?: CellLocation;
  cellType?: string;
  related?: CellAddress;
  scaleRatio?: number;
  targetIcon?: { name: string; position: RectProps; funcType: string };
  event?: MouseEvent | PointerEvent | TouchEvent;
}

```

Включает:
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}