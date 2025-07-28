{{ target: common-пользовательскийRenderFunctionArg }}
The тип declaration для обратный вызов функция argument пользовательскийRenderFunctionArg is:
```
интерфейс пользовательскийRenderFunctionArg {
  row: число;
  col: число;
  таблица: таблицаапи;
  /**Formatted значение */
  значение: строка|число;
  /**Original значение */
  данныеValue: строка|число;
  rect?: RectProps;
}
```