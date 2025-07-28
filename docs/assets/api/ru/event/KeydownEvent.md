{{ target: KeydownEvent }}
Определение типа KeydownEvent:
```
{
  keyCode: number;
  code: string;
  event: KeyboardEvent;
  cells?: CellInfo[][];
  stopCellMoving?: () => void;
  scaleRatio?: number;
};
```
{{ use: CellInfo() }}
{{ use: ICellHeaderPaths() }}
{{ use: RectProps() }}
{{ use: CellLocation() }}