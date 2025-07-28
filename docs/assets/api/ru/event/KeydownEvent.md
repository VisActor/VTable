{{ target: KeydownEvent }}
The definition of KeydownEvent type is:
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