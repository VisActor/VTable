{{ target: common-StylePropertyFunctionArg }}
The тип declaration для the обратный вызов функция argument StylePropertyFunctionArg is as follows:

```
интерфейс StylePropertyFunctionArg {
  row: число;
  col: число;
  /** таблица instance */
  таблица: таблицаапи;
  /** If format exists, the formatted или calculated значение */
  значение: строка;
  /** Original значение */
  данныеValue: строка;
  /** Specific к ProgressBarType, represents the proportion из the текущий значение в the overall данные range */
  percentile?: число;
  /** Path information из cell header */
  cellHeaderPaths: ICellHeaderPaths;
}
```