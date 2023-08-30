{{ target: MousePointerCellEvent }}
Definition of event callback function parameter type MousePointerCellEvent:

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
  caption?: string;
  /**Dimension name */
  field?: string;
  /**Cell row list header paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Cell position */
  cellRange?: RectProps;
  /**Entire row data - raw data */
  originData?: any;
  /**Formatted value */
  value?: string|number;
  /**Original value */
  dataValue?: string|number;
  cellType?: CellType;
  columnType?: string;
  related?: CellAddress;
  scaleRatio?: number;
  targetIcon?: { name: string; position: RectProps; funcType: string };
  event?: MouseEvent | PointerEvent | TouchEvent;
}

```

Including:
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellType() }}