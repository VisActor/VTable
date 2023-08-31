{{ target: MousePointerCellEvent }}
事件回调函数相应参数类型MousePointerCellEvent定义：

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
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
  related?: CellAddress;
  scaleRatio?: number;
  targetIcon?: { name: string; position: RectProps; funcType: string };
  event?: MouseEvent | PointerEvent | TouchEvent;
}

```

其中：
{{ use: CellRange() }}
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}