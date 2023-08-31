{{ target: CellInfo }}
CellInfo类型定义为：
```
{
  col: number;
  row: number;
  title?: string;
  /**维度名称 */
  field?: string;
  /**单元格行列表头paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /**单元格的位置 */
  cellRange?: RectProps;
  /**整条数据-原始数据 */
  originData?: any;
  /**format之后的值 */
  value?: string|number;
  /**原始值 */
  dataValue?: string|number;
  cellLocation?: CellLocation;
  cellType?: string;
};
```