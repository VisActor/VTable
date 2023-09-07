{{ target: common-CustomRenderFunctionArg }}
回调函数参数CustomRenderFunctionArg的类型声明为：
```
interface CustomRenderFunctionArg {
  row: number;
  col: number;
  table: TableAPI;
  /**format之后的值 */
  value: string|number;
  /**原始值 */
  dataValue: string|number;
  rect?: RectProps;
}
```