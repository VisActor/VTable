{{ target: common-StylePropertyFunctionArg }}
The type declaration for the callback function argument StylePropertyFunctionArg is as follows:

```
interface StylePropertyFunctionArg {
  row: number;
  col: number;
  /** Table instance */
  table: TableAPI;
  /** If format exists, the formatted or calculated value */
  value: string;
  /** Original value */
  dataValue: string;
  /** Specific to ProgressBarType, represents the proportion of the current value in the overall data range */
  percentile?: number;
  /** Path information of cell header */
  cellHeaderPaths: ICellHeaderPaths;
}
```