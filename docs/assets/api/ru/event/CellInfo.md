{{ target: CellInfo }}
Тип CellInfo определен как:
```
{
  col: число;
  row: число;
  title?: строка;
  /**Имя измерения */
  field?: строка;
  /**Пути заголовков ячеек строк */
  cellHeaderPaths?: ICellHeaderPaths;
  /**Позиция ячейки */
  cellRange?: RectProps;
  /**Полные данные - исходные данные */
  originData?: любой;
  /**Значение после форматирования */
  значение?: строка|число;
  /**Исходное значение */
  dataValue?: строка|число;
  cellLocation?: CellLocation;
  cellType?: строка;
};
```