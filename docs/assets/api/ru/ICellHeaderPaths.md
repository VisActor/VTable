{{ target: ICellHeaderPaths }}
The definition of ICellHeaderPaths type is:
```
export type ICellHeaderPaths = IListTableCellHeaderPaths | IPivotTableCellHeaderPaths;
export type IListTableCellHeaderPaths = {
  readonly colHeaderPaths?: {
    field: FieldDef;
  }[];
  readonly rowHeaderPaths?: {
    field: FieldDef;
  }[];
};
export type IPivotTableCellHeaderPaths = {
  /** Column header information of multi-level paths in list headers */
  readonly colHeaderPaths?: {
    dimensionKey?: string;
    indicatorKey?: string;
    value?: string;
  }[];
  /** Row header information of multi-level paths in row headers */
  readonly rowHeaderPaths?: {
    dimensionKey?: string;
    indicatorKey?: string;
    value?: string;
  }[];
};
```