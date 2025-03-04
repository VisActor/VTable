{{ target: base-cell-type }}

${prefix} headerType(string) = 'text'

Specify header type, optional: `'text'|'link'|'image'|'video'|'checkbox'`, default `'text'`.

${prefix} field(string)

**Required** Specify the header field, corresponding to the data source attribute

${prefix} fieldFormat(FieldFormat)

Configure data formatting

```
type FieldFormat = (record: any) => any;
```

${prefix} width(number|string)

Specifies the column width, which can be a specific value, 'auto', or a percentage like '20%'.
If 'auto' is specified, the column width will be automatically adjusted according to the length of the entire column text;
If a percentage is specified, the current column width will be adjusted according to the total table width;

${prefix} maxWidth(number|string)

Limit the maximum column width of this column

${prefix} minWidth(number|string)

Limit the minimum column width of this column

${prefix} title(string)

Header name

${prefix} headerStyle(IStyleOption|Function)

Header cell style, configuration options are slightly different depending on the headerType. The configuration options for each headerStyle can be referred to:

- When headerType is 'text', it corresponds to [headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- When headerType is 'link', it corresponds to [headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- When headerType is 'image', it corresponds to [headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)
- When headerType is 'video', it corresponds to [headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)

${prefix} style

Body cell style, type declaration:

```
style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

The type structure of IStyleOption is as follows:

{{ use: common-style(
  prefix = ${prefix},
  isImage = ${isImage},
  isProgressbar = ${isProgressbar},
  isCheckbox = ${isCheckbox},
  isRadio = ${isRadio},
  isSwitch = ${isSwitch},
  isButton = ${isButton},
) }}

${prefix} headerIcon(string|Object|Array)

Header cell icon configuration. Available configuration types are:

```
string | ColumnIconOption | (string | ColumnIconOption)[];
```

For the specific configuration of ColumnIconOption, refer to the [definition](./ListTable-columns-text#icon.ColumnIconOption)

${prefix} icon(string|Object|Array|Funciton)

Body cell icon configuration.

```
icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

#${prefix} ColumnIconOption

```
type ColumnIconOption = ImageIcon | SvgIcon | TextIcon;
```

#${prefix} ImageIcon(Object)
type is set to 'image'. The image address needs to be set in src
{{ use: image-icon(  prefix = '##' + ${prefix}) }}

#${prefix} SvgIcon(Object)
type is set to 'svg'. You need to configure the svg address or the complete svg file string in svg
{{ use: svg-icon(  prefix = '##' + ${prefix}) }}

#${prefix} TextIcon(Object)
type is set to 'text'. You need to configure the text content in content
{{ use: text-icon(  prefix = '##' + ${prefix}) }}

${prefix} sort(boolean|Function)

Whether to support sorting, or define a function to specify sorting rules

${prefix} showSort(boolean)

Whether to display the sort icon, no real sorting logic. If the sort field is set, this can be omitted

${prefix} disableHover(boolean)
This column does not support hover interaction behavior

${prefix} disableSelect(boolean | ((col: number, row: number, table: BaseTableAPI) => boolean))
This column does not support selection

${prefix} disableHeaderHover(boolean)
This header column does not support hover interaction behavior

${prefix} disableHeaderSelect(boolean)
This header column does not support selection

${prefix} description(string)
The description of the header when hover, which will be displayed in the form of a tooltip

${prefix} dropDownMenu(MenuListItem[])
The drop-down menu item configuration. The drop-down menu item can be a first-level menu item or a second-level menu item, as long as there is a configuration.

具体类型为 `MenuListItem[]`。

{{ use: common-menu-list-item() }}

${prefix} headerCustomRender(Function|Object)

Custom rendering of header cell, in function or object form. The type is: `ICustomRenderFuc | ICustomRenderObj`.

[demo link](../demo/custom-render/custom-render) [tutorial link](../guide/custom_define/custom_render)

The definition of ICustomRenderFuc is:

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '#' + ${prefix},
) }}

${prefix} headerCustomLayout(Function)

Custom layout element definition for header cell, suitable for complex layout cell content.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} customRender(Function|Object)
Custom rendering for body cell header cell, in function or object form. The type is: `ICustomRenderFuc | ICustomRenderObj`.

[demo link](../demo/custom-render/custom-render) [tutorial link](../guide/custom_define/custom_render)

The definition of ICustomRenderFuc is:

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '#' + ${prefix},
) }}

${prefix} customLayout(Function)

Custom layout element definition for body cell, suitable for complex layout content.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} dragHeader(boolean)
Whether the header can be dragged

${prefix} columnWidthComputeMode(string)
Column width calculation mode: `'normal' | 'only-header' | 'only-body'`, only-header considers only the header content only-body considers only the body content normal can display all content

${prefix} disableColumnResize(boolean)
Whether to disable column width adjustment. If it is a transposed table or a pivot table with row-oriented indicators, this configuration does not take effect.

${prefix} tree (boolean)
Whether to display this column as a tree structure, which needs to be combined with the records data structure to be implemented, the nodes that need to be expanded are configured with `children` to accommodate sub-node data. For example:

```
{
    "department": "Human Resources Department",
    "monthly_expense": "$45000",
    "children": [
      {
        "group": "Recruiting Group",
        "monthly_expense": "$25000",
        "children": [
          {
            "name": "John Smith",
            "position": "Recruiting Manager",
            "salary": "$8000"
          },
      }
    ]
}
```

${prefix} editor (string|Object|Function)

Configure the column cell editor

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

Among them, IEditor is the editor interface defined in @visactor/vtable-editors. For details, please refer to the source code: https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts .

${prefix} headerEditor (string|Object|Function)

Configure the display title of this column header

```
headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

${prefix} columns (Array)
Configure arrays with upper columns, nesting structures to describe column grouping relationships.

${prefix} hideColumnsSubHeader(boolean) = false
Whether to hide the header title of the subtable header. The default value is not hidden.

${prefix} aggregation(Aggregation | CustomAggregation | Array)

Not required.

Data aggregation summary configuration to analyze the column data.

Global options can also be configured to configure aggregation rules for each column.

Please refer to [the tutorial document](https://visactor.io/vtable/guide/data_analysis/list_table_dataAnalysis)

${prefix} hide(boolean) = false
Not required.

Weather hide column.
