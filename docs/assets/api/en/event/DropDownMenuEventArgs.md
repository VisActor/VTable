{{ target: DropDownMenuEventArgs }}
Definition of event callback function parameter type DropDownMenuEventArgs:

```
  {
    col: number;
    row: number;
    menuKey: string;
    text: string;
    highlight: boolean;
    field?: string;
    /**formatted value */
    value?: string;
    /**original value */
    dataValue?: string;
    subIndex?: number;

    dimensionKey?: string | number;
    isPivotCorner?: boolean;
    customInfo?: any;

    cellHeaderPaths?: ICellHeaderPaths;
    cellLocation: CellLocation;
  }
```

In which:
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}