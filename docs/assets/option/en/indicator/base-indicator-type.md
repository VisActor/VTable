{{ target: base-indicator-type }}

${prefix} indicatorKey(string)

**Required** The unique identifier of the indicator

${prefix} title(string)

Indicator name

${prefix} format(FieldFormat)

Indicator value formatting

```
type FieldFormat = (value: number|string, col:number, row:number, table:PivotTable) => any;
```

${prefix} headerFormat(FieldFormat)

indicator title format

```
type FieldFormat = (title: number|string, col:number, row:number, table:PivotTable) => any;
```

${prefix} width(number|string)

Width specification of the indicator column. If the indicator is displayed in rows, this configuration is not applied.
Width specification can be a specific value, 'auto', or a percentage such as '20%'.
If 'auto' is specified, the column width will be adjusted automatically based on the length of the text in the entire column;
If a percentage is specified, the current column width will be adjusted according to the total width of the table;

${prefix} maxWidth(number|string)

Maximum width of the indicator column

${prefix} minWidth(number|string)

Minimum width of the indicator column

${prefix} headerType(string) = 'text'

Specify the header type, options: `'text'|'link'|'image'|'video'`, default `'text'`.

${prefix} headerStyle(TODO)

Header cell style. Configuration items vary slightly depending on the headerType. Configurations for each headerStyle can be referred to as follows:

- For headerType 'text', see [headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- For headerType 'link', see [headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- For headerType 'image', see [headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)
- For headerType 'video', see [headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)

${prefix} style

Body cell style, type declaration:

```
style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

IStyleOption type structure is as follows:

{{ use: common-style(
  prefix = ${prefix},
  isImage = ${isImage},
  isProgressbar = ${isProgressbar},
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

ColumnIconOption can refer to [definition](/en/option.html#PivotTable-indicators-text.icon.ColumnIconOption_definition：)

${prefix} icon(string|Object|Array|Funciton)

Body cell icon configuration.

```
icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

#${prefix}ColumnIconOption

```
type ColumnIconOption = ImageIcon | SvgIcon | TextIcon;
```

#${prefix}ImageIcon(Object)
type is set to 'image'. The image address needs to be set in src
{{ use: image-icon(  prefix = '##' + ${prefix}) }}

#${prefix}SvgIcon(Object)
type is set to 'svg'. You need to configure the svg address or the complete svg file string in svg
{{ use: svg-icon(  prefix = '##' + ${prefix}) }}

#${prefix}TextIcon(Object)
type is set to 'text'. You need to configure the text content in content
{{ use: text-icon(  prefix = '##' + ${prefix}) }}

${prefix} headerCustomRender(Function|Object)
Custom rendering content definition for the indicator name header. For details, please refer to [Basic table custom rendering configuration](../option/ListTable-columns-text#headerCustomRender)

${prefix} headerCustomLayout(Function)

Custom layout elements for the indicator name header cell.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} customRender(Function|Object)

Custom rendering content definition for the indicator value body cell, either in function or object form. The type is `ICustomRenderFuc | ICustomRenderObj`.

The ICustomRenderFuc is defined as follows:

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '#' + ${prefix},
) }}

${prefix} customLayout(Function)

Custom layout elements for the indicator value body cell.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} dropDownMenu(MenuListItem[]|Function)
Dropdown menu item configuration. Dropdown menu items can be first-level menu items or second-level menu items, and only one configuration is required.

具体类型为 `MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[])`。

{{ use: common-menu-list-item() }}

${prefix} showSort(boolean|Function)
Whether to display the sorting icon, no data sorting logic

```
  showSort?: boolean | ((args: { row: number; col: number; table: BaseTableAPI }) => boolean);
```

${prefix} hide(boolean|Function)
hide indicator, default false

```
  hide?:  boolean | ((args: { dimensionPaths: IDimensionInfo[]; table: BaseTableAPI }) => boolean);
```

${prefix} disableColumnResize(boolean)
Whether to disable column width adjustment. If it is a transposed table or the indicator is specified in the row direction of the pivot table, this configuration does not take effect.

${prefix} editor (string|Object|Function)

Configure the indicator cell editor

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

Among them, IEditor is the editor interface defined in @visactor/vtable-editors. For details, please refer to the source code: https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts .
