{{ target: base-dimension-type }}

${prefix} dimensionKey(string)

**Required** Unique identifier of the dimension, corresponding to the field name of the dataset

${prefix} title(string)

**Required** Dimension name, the angle header can be configured to display the dimension name

${prefix} headerFormat(FieldFormat)

Format of the dimension value

```
type FieldFormat = (title: number|string, col:number, row:number, table:PivotTable) => any;
```

${prefix} width(number|string)

This property takes effect when the dimension serves as a row header and represents the width of the dimension cell.
The column width can be specified as a specific number, 'auto', or a percentage like '20%'.
If 'auto' is specified, the column width will be adjusted automatically according to the length of the whole column text;
If a percentage is specified, the current column width will be adjusted according to the total width of the table;

${prefix} maxWidth(number|string)

This property takes effect when the dimension serves as a row header and represents the maximum width of the dimension cell

${prefix} minWidth(number|string)

This property takes effect when the dimension serves as a row header and represents the minimum width of the dimension cell

${prefix} headerStyle(IStyleOption|Function)

Header cell style, type declaration:

```
headerStyle?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

IStyleOption type structure is as follows:

{{ use: common-style(
  prefix = ${prefix},
  isImage = ${isImage},
) }}

${prefix} headerIcon(string|Object|Array|Function)

Header cell icon configuration

```
  headerIcon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

ColumnIconOption specific configuration: https://visactor.io/vtable/option/ListTable-columns-text#icon

${prefix} description(string|Function)
Description information for header hover, displayed as a tooltip

```
 description?: string | ((args: CellInfo) => string);
```

${prefix} cornerDescription(string)

Description information for hover, displayed as a tooltip

${prefix} headerCustomRender(Function|Object)

Custom rendering function for header cells, you can specify the rendering method for headers. For details, please refer to [Basic table custom rendering configuration](../option/ListTable-columns-text#headerCustomRender)

${prefix} headerCustomLayout(Function)

Custom layout element definition for header cells, this customization is suitable for cells with complex content layouts.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} dropDownMenu(MenuListItem[]|Function)
Dropdown menu item configuration. Dropdown menu items can be top-level menu items or second-level menu items, and only one configuration is required.

具体类型为 `MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[])`。

{{ use: common-menu-list-item() }}

${prefix} cornerDropDownMenu(Array)
Angle header cell display drop-down button and drop-down menu item configuration. Dropdown menu items can be top-level menu items or second-level menu items, and only one configuration is required. The specific type is MenuListItem[].

${prefix} cornerHeaderIcon(string|Object|Array|Function)

Pivot table corner cell icon configuration

```
cornerHeaderIcon?:
| string
| ColumnIconOption
| (string | ColumnIconOption)[]
| ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

For the specific configuration of ColumnIconOption, please refer to: https://visactor.io/vtable/option/ListTable-columns-text#icon

${prefix} dragHeader(boolean)
Whether the header can be dragged

${prefix} drillDown(boolean)
Display drill-down icon, clicking it will trigger a corresponding event

${prefix} drillUp(boolean)
Display drill-up icon, clicking it will trigger a corresponding event

${prefix} showSort(boolean|Function)
Whether the dimension value cell displays the sort icon. Clicking it does not have data sorting logic.

```
  showSort?: boolean | ((args: { row: number; col: number; table: BaseTableAPI }) => boolean);
```

${prefix} sort(boolean)
Whether the corresponding dimension header cell displays the sort icon.

Sorting rules:

If the sorting rules for this dimension are configured in dataConfig.sortRules, the data is sorted according to the rules in dataConfig.sortRules.

If the sorting rules for the dimension are not configured in dataConfig.sortRules, the default is to use the natural sorting of the dimension value string.

${prefix} showSortInCorner(boolean)

Whether to display sorting in the dimension name cell in the corner header. Clicking it does not have data sorting logic
