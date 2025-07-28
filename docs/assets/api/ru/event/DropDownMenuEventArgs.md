{{ target: DropDownMenuEventArgs }}
Определение типа параметра функции обратного вызова события DropDownMenuEventArgs:

```
  {
    col: число;
    row: число;
    menuKey: строка;
    текст: строка;
    highlight: логический;
    field?: строка;
    /**отформатированное значение */
    значение?: строка;
    /**исходное значение */
    dataValue?: строка;
    subIndex?: число;

    dimensionKey?: строка | число;
    isPivotCorner?: логический;
    customInfo?: любой;

    cellHeaderPaths?: ICellHeaderPaths;
    cellLocation: CellLocation;
  }
```

В котором:
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}