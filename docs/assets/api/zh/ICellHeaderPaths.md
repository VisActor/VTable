{{ target: ICellHeaderPaths }}
ICellHeaderPaths类型定义为：
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
  /** 列表头各级path表头信息 */
  readonly colHeaderPaths?: {
    dimensionKey?: string;
    indicatorKey?: string;
    value?: string;
  }[];
  /** 行表头各级path表头信息 */
  readonly rowHeaderPaths?: {
    dimensionKey?: string;
    indicatorKey?: string;
    value?: string;
  }[];
};
```