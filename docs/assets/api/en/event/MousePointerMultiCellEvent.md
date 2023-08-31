{{ target: MousePointerMultiCellEvent }}
Event callback function corresponding parameter type MousePointerMultiCellEvent definition:

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
  title?: string;
  /**Dimension name */
  field?: string;
  /**Cell row header paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Cell position */
  cellRange?: RectProps;
  /**Entire data - original data */
  originData?: any;
  /**Formatted value */
  value?: string|number;
  /**Original value */
  dataValue?: string|number;
  cellLocation?: CellLocation;
  cellType?: string;
  related?: CellAddress;
  scaleRatio?: number;
  targetIcon?: { name: string; position: RectProps; funcType: string };
  cells: CellInfo[][];
  event?: MouseEvent | PointerEvent | TouchEvent;
}

```

Among them:
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}
{{ use: CellInfo() }}