{{ target: common-StylePropertyFunctionArg }}
回调函数参数StylePropertyFunctionArg的类型声明为：

```
interface StylePropertyFunctionArg {
  row: number;
  col: number;
  /** 表格实例 */
  table: TableAPI;
  /**有format的话 格式化后或者计算后的值 */
  value: string;
  /**原始值 */
  dataValue: string;
  /** progressbar类型特有，表示当前数值在总体数据范围的比例 */
  percentile?: number;
  /** 单元格的表头路径信息 */
  cellHeaderPaths: ICellHeaderPaths;
}
```