{{ target: CellAddress }}
Определение типа для CellAddress:
```
interface CellAddress {
  col: number;
  row: number;
}
```

{{ target: CellAddressWithBound }}
Определение типа для CellAddressWithBound:
```
interface CellAddressWithBound {
  col: number;
  row: number;
  rect?: RectProps;
  x?: number;
  y?: number;
}
```
{{ use: RectProps() }}