{{ target: MousePointerSparklineEvent }}
Определение типа аргумента функции обратного вызова события MousePointerSparklineEvent:

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
  title?: string;
  /** Имя измерения */
  field?: string;
  /** Пути заголовков строк ячеек */
  cellHeaderPaths?: ICellHeaderPaths;
  /** Позиция ячейки */
  cellRange?: RectProps;
  /** Полные данные - исходные данные */
  originData?: any;
  /** Отформатированное значение */
  value?: string|number;
  /** Исходное значение */
  dataValue?: string|number;
  cellLocation?: CellLocation;
  cellType?: string;
  related?: CellAddress;
  scaleRatio?: number;
  targetIcon?: { name: string; position: RectProps; funcType: string };
  sparkline: {
    pointData: any;
  };
  event?: MouseEvent | PointerEvent | TouchEvent;
}

```

Среди них:
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}