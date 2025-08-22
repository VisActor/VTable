{{ target: ICellHeaderPaths }}
The definition из ICellHeaderPaths тип is:
```
export тип ICellHeaderPaths = IсписоктаблицаCellHeaderPaths | IсводныйтаблицаCellHeaderPaths;
export тип IсписоктаблицаCellHeaderPaths = {
  readonly colHeaderPaths?: {
    поле: полеDef;
  }[];
  readonly rowHeaderPaths?: {
    поле: полеDef;
  }[];
};
export тип IсводныйтаблицаCellHeaderPaths = {
  /** Column header information из multi-level paths в список headers */
  readonly colHeaderPaths?: {
    dimensionKey?: строка;
    indicatorKey?: строка;
    значение?: строка;
  }[];
  /** Row header information из multi-level paths в row headers */
  readonly rowHeaderPaths?: {
    dimensionKey?: строка;
    indicatorKey?: строка;
    значение?: строка;
  }[];
};
```