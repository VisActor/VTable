{{ target: CellInfo }}
CellInfo type is defined as:
```
{
  col: number;
  row: number;
  caption?: string;
  /**Dimension name */
  field?: string;
  /**Cell row header paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Cell position */
  cellRange?: RectProps;
  /**Entire data - original data */
  originData?: any;
  /**Value after format */
  value?: string|number;
  /**Original value */
  dataValue?: string|number;
  cellType?: CellType;
  columnType?: string;
};
```