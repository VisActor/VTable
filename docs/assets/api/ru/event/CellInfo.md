{{ target: CellInfo }}
Тип CellInfo определен как:
```
{
  col: number;
  row: number;
  title?: string;
  /**Имя измерения */
  field?: string;
  /**Пути заголовков ячеек строк */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Позиция ячейки */
  cellRange?: RectProps;
  /**Полные данные - исходные данные */
  originData?: any;
  /**Значение после форматирования */
  value?: string|number;
  /**Исходное значение */
  dataValue?: string|number;
  cellLocation?: CellLocation;
  cellType?: string;
};
```