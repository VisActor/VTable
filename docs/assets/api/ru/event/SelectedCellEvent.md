{{ target: SelectedCellEvent }}
Definition of the event callback function corresponding parameter type SelectedCellEvent:

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
Where:
{{ use: CellRange() }}