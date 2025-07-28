{{ target: DropDownMenuEventArgs }}
Определение типа параметра функции обратного вызова события DropDownMenuEventArgs:

```
  {
    col: number;
    row: number;
    menuKey: string;
    text: string;
    highlight: boolean;
    field?: string;
    /**отформатированное значение */
    value?: string;
    /**исходное значение */
    dataValue?: string;
    subIndex?: number;

    dimensionKey?: string | number;
    isPivotCorner?: boolean;
    customInfo?: any;

    cellHeaderPaths?: ICellHeaderPaths;
    cellLocation: CellLocation;
  }
```

В котором:
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}