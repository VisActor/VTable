{{ target: DropDownMenuEventArgs }}
事件回调函数相应参数类型DropDownMenuEventArgs定义：

```
  {
    col: number;
    row: number;
    menuKey: string;
    text: string;
    highlight: boolean;
    field?: string;
    /**format之后的值 */
    value?: string;
    /**原始值 */
    dataValue?: string;
    subIndex?: number;

    dimensionKey?: string | number;
    isPivotCorner?: boolean;
    customInfo?: any;

    cellHeaderPaths?: ICellHeaderPaths;
    cellLocation: CellLocation;
  }
```

其中：
{{ use: ICellHeaderPaths() }}
{{ use: CellLocation() }}