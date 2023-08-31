{{ target: MousePointerSparklineEvent }}
Definition of the event callback function's corresponding argument type MousePointerSparklineEvent:

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
  title?: string;
  /** Dimension name */
  field?: string;
  /** Cell row header paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /** Position of the cell */
  cellRange?: RectProps;
  /** Entire data - Raw data */
  originData?: any;
  /** Formatted value */
  value?: string|number;
  /** Original value */
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

Among them:
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}