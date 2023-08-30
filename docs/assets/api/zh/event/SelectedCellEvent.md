{{ target: SelectedCellEvent }}
事件回调函数相应参数类型SelectedCellEvent定义：

```
{
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
  ranges: CellRange[];
}
```
其中：
{{ use: CellRange() }}