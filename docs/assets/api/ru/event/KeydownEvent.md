{{ target: KeydownEvent }}
Определение типа KeydownEvent:
```
{
  keyCode: число;
  code: строка;
  event: KeyboardEvent;
  cells?: CellInfo[][];
  stopCellMoving?: () => void;
  scaleRatio?: число;
};
```
{{ use: CellInfo() }}
{{ use: ICellHeaderPaths() }}
{{ use: RectProps() }}
{{ use: CellLocation() }}