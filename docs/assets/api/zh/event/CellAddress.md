{{ target: CellAddress }}
CellAddress的类型定义为：
```
interface CellAddress {
  col: number;
  row: number;
}
```

{{ target: CellAddressWithBound }}
CellAddressWithBound的类型定义为：
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