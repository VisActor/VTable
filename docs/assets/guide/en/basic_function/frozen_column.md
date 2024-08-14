# Column Freeze

In data analytics applications, the amount of data in a table is usually very large, which leads to a table with many columns in the horizontal direction. When the user scrolls the table horizontally, the columns of key information may be "rolled out" of sight. In order to keep these key information columns visible during the horizontal scrolling process, we need to "freeze" these columns. Through the column freezing function, data analytics can be made easier and clearer.

Note: This feature is only supported for basic forms.

## Freeze column settings

VTable provides a flexible freezing column setting method, you can configure the number of frozen columns according to actual needs. for `ListTable` Type, the configuration items are as follows:

*   `frozenColCount`: Freeze the number of columns, default to 0.
*   `allowFrozenColCount`: Allow the number of operable frozen columns, that is, how many columns before the freeze operation button will appear, the default is 0.
*   `showFrozenIcon`: Whether to display the fixed column icon, the default is `true`.

Here is an example configuration:

```javascript
const listTable = new ListTable({
  // ...其他配置项
  frozenColCount: 2,
  allowFrozenColCount: 4,
  showFrozenIcon: true,
});
```

In this example, we set the number of frozen columns to 2, which means that the first two columns will be frozen. At the same time, the number of allowed frozen columns is set to 4, which means that the freeze operation button will appear in the first four columns, and the user can manually freeze as needed. Finally, set `showFrozenIcon` for `true`, causing the base table to display the fixed column icon.

## Freeze column interface use

In addition to freezing column settings through configuration items, VTable also provides corresponding interface methods to dynamically set the number of frozen columns, which can be adjusted at any time as needed during program running. you can use `ListTable` class `frozenColCount` Interface method to set the current number of frozen columns, an example is as follows:

```javascript
listTable.frozenColCount = 3;
```

In this example, we adjust the number of frozen columns in the current list to 3. At this point, the first three columns will be frozen.
