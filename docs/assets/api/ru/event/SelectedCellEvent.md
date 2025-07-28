{{ target: SelectedCellEvent }}
Определение типа параметра функции обратного вызова события SelectedCellEvent:

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
Где:
{{ use: CellRange() }}