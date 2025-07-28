{{ target: SelectedCellEvent }}
Определение типа параметра функции обратного вызова события SelectedCellEvent:

```
{
  col: число;
  row: число;
  rect?: RectProps;
  x?: число;
  y?: число;
  ranges: CellRange[];
}
```
Где:
{{ use: CellRange() }}