{{ target: CellAddress }}
The type definition for CellAddress is:
```
interface CellAddress {
  col: number;
  row: number;
}
```

{{ target: CellAddressWithBound }}
The type definition for CellAddressWithBound is:
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