{{ target: CellAddress }}
Определение типа для CellAddress:
```
интерфейс CellAddress {
  col: число;
  row: число;
}
```

{{ target: CellAddressWithBound }}
Определение типа для CellAddressWithBound:
```
интерфейс CellAddressWithBound {
  col: число;
  row: число;
  rect?: RectProps;
  x?: число;
  y?: число;
}
```
{{ use: RectProps() }}