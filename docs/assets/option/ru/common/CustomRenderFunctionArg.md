{{ target: common-CustomRenderFunctionArg }}
The type declaration for callback function argument CustomRenderFunctionArg is:
```
interface CustomRenderFunctionArg {
  row: number;
  col: number;
  table: TableAPI;
  /**Formatted value */
  value: string|number;
  /**Original value */
  dataValue: string|number;
  rect?: RectProps;
}
```