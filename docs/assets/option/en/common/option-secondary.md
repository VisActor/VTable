{{ target: common-option-secondary }}

#${prefix} widthMode('standard' | 'adaptive' | 'autoWidth') = 'standard'

Table column width calculation mode, can be 'standard' (standard mode), 'adaptive' (container width adaptive mode) or 'autoWidth' (automatic width mode), default is 'standard'.

- 'standard': Use the width specified by the width property as the column width.
- 'adaptive': Use the width of the table container to allocate column width.
- 'autoWidth': Calculate column width automatically based on the width of the column header and body cells content, ignoring the width property settings.

#${prefix} heightMode('standard' | 'adaptive' | 'autoHeight') = 'standard'

The calculation mode of table row height, which can be 'standard' (standard mode), 'adaptive' (adaptive container height mode) or 'autoHeight' (automatic row height mode), the default is 'standard'.

- 'standard': use `defaultRowHeight` and `defaultHeaderRowHeight` as row height.
- 'adaptive': Use the height of the container to assign the height of each row.
- 'autoHeight': Automatically calculate line height based on content, based on fontSize and lineHeight(font height)，include padding. The related collocation setting item `autoWrapText` automatically wraps the line, and the line height can be calculated according to the content of the multi-line text after the line wrap.

#${prefix} widthAdaptiveMode('only-body' | 'all') = 'only-body'

The width adaptation strategy in adaptive mode, the default is 'only-body'.

- 'only-body': Only the columns in the body part participate in the width adaptation calculation, and the width of the header part remains unchanged.
- 'all': All columns participate in width adaptation calculation.

#${prefix} heightAdaptiveMode('only-body' | 'all') = 'only-body'

The height adaptable strategy in adaptive mode, default is 'only-body'.

- 'only-body': Only the rows in the body part participate in the height adaptation calculation, and the height of the header part remains unchanged.
- 'all': All columns participate in the height adaptation calculation.

#${prefix} autoHeightInAdaptiveMode(boolean) = true

When the adaptive mode is configured, the default value is true, that is, the length of the container is equal to the height of the stretched row based on the calculation of the height of each row. If you do not need to calculate the row height, set it to false if the default row height is used

#${prefix} columnWidthComputeMode('normal' | 'only-header' | 'only-body') = 'normal'

When calculating the content width, the limited area participates in the calculation:

- 'only-header': Only the header content is calculated.
- 'only-body': Only the body cell content is calculated.
- 'normal': Normal calculation, that is, calculating the header and body cell contents.

#${prefix} autoWrapText(boolean) = false

Whether to automatically wrap text

#${prefix} autoFillWidth(boolean) = false
The configuration item autoFillWidth is used to control whether to automatically fill the container width. Different from the effect of `adaptive` adaptive container of width mode `widthMode`, autoFillWidth controls that only when the number of columns is small, the table can automatically fill the width of the container, but when the number of columns exceeds the container, according to the actual situation A scroll bar can appear to set the column width.

#${prefix} autoFillHeight(boolean) = false
The configuration item autoFillHeight is used to control whether to automatically fill the container height. Different from the effect of `adaptive` adaptive container of height mode `heightMode`, autoFillHeight controls that only when the number of rows is small, the table can automatically fill the height of the container, but when the number of rows exceeds the container, according to the actual situation A scroll bar can appear to set the row height.

#${prefix} maxCharactersNumber(number) = 200

The maximum number of characters that can be displayed in a cell, default is 200

#${prefix} maxOperatableRecordCount(number)

Maximum number of operable records, such as the maximum number of data entries that can be copied in a copy operation

#${prefix} limitMaxAutoWidth(boolean|number) = 450

Specify the maximum column width when calculating column width, which can be boolean or a specific value. Default is 450.

#${prefix} limitMinWidth(boolean|number) = 10

Minimum column width limit. If set to true, the column width will be limited to a minimum of 10px when dragging to change the column width. If set to false, there will be no limit. Or set it directly to some numeric value. Default is 10px.

#${prefix} frozenColCount(number) = 0

The number of frozen columns

#${prefix} frozenRowCount(number) = 0

The number of frozen columns(including the header)

#${prefix} rightFrozenColCount(number) = 0

Freeze Columns Right

#${prefix} bottomFrozenRowCount(number) = 0

number of frozen rows at the bottom

#${prefix} maxFrozenWidth(number | string) = '80%'

Maximum freezing width, fixed value or percentage. Default is '80%'

#${prefix} unfreezeAllOnExceedsMaxWidth(boolean) = true

Whether to defrost after the maximum freezing width is exceeded. The default value is true

#${prefix} allowFrozenColCount(number) = 0

Allow the number of frozen columns, indicating how many columns will show the frozen operation button (effective for basic tables)

#${prefix} showFrozenIcon(boolean) = true

Whether to show the fixed column pin icon, effective for basic tables

#${prefix} defaultRowHeight(number|'auto') = 40

Default row height.

- 'auto': The default row height calculated based on the row height. Combined with defaultHeaderRowHeight, it can achieve the effect of automatic row height calculation for the header or body part.
- Specific value: Set a specific row height.

#${prefix} defaultHeaderRowHeight(Array|number)

The default row height of the column header can be set row by row. If not set, the defaultRowHeight value will be used as the row height of the table header.

Specific definition:

```
defaultHeaderRowHeight?: (number | 'auto') | (number | 'auto')[];
```

#${prefix} defaultColWidth(number) = 80

Column width default value

#${prefix} defaultHeaderColWidth(Array|number)

The default column width of the row header can be set column by column. If not set, the value of defaultColWidth will be used as the column width and height of the header.

Specific definition:

```
/** The default column width of the row header can be set column by column. If not, defaultColWidth is used */
defaultHeaderColWidth?: (number | 'auto') | (number | 'auto')[];
```

#${prefix} keyboardOptions(Object)

Shortcut key function settings, specific configuration items:

##${prefix} selectAllOnCtrlA(boolean) = false
Enable the shortcut key Select All.
Supports `boolean` or specific configuration type `SelectAllOnCtrlAOption`.

```
export interface SelectAllOnCtrlAOption {
disableHeaderSelect?: boolean; //Whether to disable header selection when the shortcut key is used to select all.
disableRowSeriesNumberSelect?: boolean; //Whether to disable the selection of row sequence numbers when the shortcut key is used to select all.
}
```

##${prefix} copySelected(boolean) = false

Enable shortcut key to copy, consistent with the browser's shortcut key.

##${prefix} pasteValueToCell(boolean) = false

Enable shortcut key to paste, consistent with the browser's shortcut key.Paste takes effect only for cells with an editor configured

##${prefix} moveFocusCellOnTab(boolean) = true
Enable tab key interaction. The default is true. Turn on the tab key to move the selected cell. If you are currently editing a cell, moving to the next cell is also in the editing state.

##${prefix} moveFocusCellOnEnter(boolean) = false
Enable enter key interaction. Default is false. Press enter key to select next cell. Mutually exclusive with editCellOnEnter. If set to true at the same time, it takes precedence over editCellOnEnter.

##${prefix} editCellOnEnter(boolean) = true
Enable enter key interaction. Default is true. If the selected cell is editable, enter cell editing.

##${prefix} moveEditCellOnArrowKeys(boolean) = false
By default, it is not enabled, that is, false. If this configuration is enabled, if the cell is currently being edited, the arrow keys can move to the next cell and enter the editing state, instead of moving the cursor of the string in the edit text. The up, down, left, and right arrow keys to switch the selected cell are not affected by this configuration.

##${prefix} moveEditCellOnArrowKeys(boolean) = false

The default is not enabled, which is false.

If this configuration is turned on, if you are currently editing a cell, the arrow keys can move to the next cell and enter the editing state, instead of moving the cursor to edit the string within the text.

Switching the selected cells with the up, down, left and right arrow keys is not affected by this configuration.

##${prefix} ctrlMultiSelect(boolean) = true

Whether to enable ctrl multi-select. Default is true.

#${prefix} eventOptions(Object)

Issue settings related to event triggering, specific configuration items:

##${prefix} preventDefaultContextMenu(boolean) = true
prevent the default behavior of the right mouse button

#${prefix} excelOptions(Object)

Align excel advanced capabilities

##${prefix} fillHandle(boolean) = false

Fill handle, when set to true, when a cell is selected, the fill handle will be displayed on the lower right side of the cell. You can drag the fill handle to edit the value of the cell. Or double-click the fill handle to change the value of the cell you want to edit.

#${prefix} dragHeaderMode(string) = 'none'

The switch of dragging the header to move the position. After selecting a cell, drag the cell to trigger the move. The range of replaceable cells is limited:

- 'all' All headers can be swapped
- 'none' Cannot be swapped
- 'column' Only the column header can be swapped
- 'row' Only the row header can be swapped

#${prefix} hover(Object)

Hover interaction configuration, specific configuration items as follows:

##${prefix} highlightMode('cross'|'column'|'row'|'cell') = 'cross'

Hover interaction response mode: cross, entire column, entire row, or single cell.

##${prefix} disableHover(boolean) = false

Do not respond to mouse hover interaction.

##${prefix} disableHeaderHover(boolean) = false

Separately set the header not to respond to mouse hover interaction.

#${prefix} select(Object)

Cell selection interaction configuration, specific configuration items as follows:

##${prefix} highlightMode ('cross' | 'column' | 'row' | 'cell') = 'cell'

Highlight range mode: cross, whole column, whole row or single cell. Default is `cell`

##${prefix} headerSelectMode ('inline' | 'cell' | 'body') = 'inline'

When clicking on a header cell, whether the entire row or column needs to be selected along with the body.

Possible values:

'inline': Clicking a row header selects the entire row, and selecting a column header selects the entire column;

'cell': select only the currently clicked header cell;

'body': Do not select the table header. Clicking a row header selects all body cells in the row. Clicking a column header selects all body cells in the column.

##${prefix} disableSelect (boolean | ((col: number, row: number, table: BaseTableAPI) => boolean)) = false

Do not respond to mouse select interaction.

##${prefix} disableHeaderSelect (boolean) = false

Separately set the header not to respond to mouse select interaction.

##${prefix} blankAreaClickDeselect(boolean) = false

Whether to cancel the selection when clicking the blank area.

##${prefix} outsideClickDeselect(boolean) = true

Whether to cancel the selection when clicking outside the table.

##${prefix} disableDragSelect(boolean) = true

Whether to disable dragging selection.

##${prefix} highlightInRange(boolean) = false

Will the entire row or column be highlighted when select in multiple rows or columns.

##${prefix} makeSelectCellVisible(boolean) = true

Whether to make the selected cell visible, default is true.

#${prefix} theme(Object)

{{ use: common-theme(
  prefix = '#' + ${prefix},
) }}

#${prefix} menu(Object)

Configuration related to the drop-down menu. Disappearance timing: automatically disappears after clicking the area outside the menu. Specific configuration items as follows:

##${prefix} renderMode('canvas' | 'html') = 'html'

Menu rendering method, html is currently more complete, default using html rendering method.

##${prefix} defaultHeaderMenuItems(MenuListItem[]|Function)

Global settings for built-in drop-down menus, type is `MenuListItem[] | ((args:{col:number,row:number,table:BaseTableAPI})=>MenuListItem[])`.

Currently only valid for basic tables, it will enable the default drop-down menu function for each header cell.

{{ use: common-menu-list-item() }}

##${prefix} contextMenuItems(Array|Function)

Right-click menu. Declaration type:

```
MenuListItem[] | ((field: string, row: number, col: number, table?: BaseTableAPI) => MenuListItem[]);
```

{{ use: common-menu-list-item() }}

##${prefix} dropDownMenuHighlight(Array)

Set the selected state of the menu. Declaration type is `DropDownMenuHighlightInfo[]`.
.DropDownMenuHighlightInfo is defined as follows:

```
{
  /** Set the column number of the cell with the drop-down status */
  col?: number;
  /** Set the row number of the cell with the drop-down status */
  row?: number;
  /** Set the field name corresponding to the drop-down status, or set dimension information for pivot tables */
  field?: string | IDimensionInfo[];
  /** Specify the key value of the drop-down menu item */
  menuKey?: string;
}
```

{{ use: common-IDimensionInfo()}}

#${prefix} title(Object)

{{ use: common-title(
  prefix = '#' + ${prefix},
) }}

#${prefix} emptyTip(Object)

Table empty data prompt.

You can directly configure `boolean` or `IEmptyTip` type objects. The default value is false, which means no prompt information is displayed.

The IEmptyTip type is defined as follows:

{{ use: common-emptyTip(
prefix = '#' + ${prefix},
) }}

#${prefix} tooltip(Object)

Tooltip related configuration. Specific configuration items are as follows:

##${prefix} renderMode ('html') = 'html'

Html is currently more complete, default using html rendering method. Currently does not support canvas scheme, will support later.

##${prefix} isShowOverflowTextTooltip (boolean)

Whether to display overflow text content tooltip when hovering over the cell. Temporarily, renderMode needs to be configured as html to display, and canvas has not been developed yet.

##${prefix} overflowTextTooltipDisappearDelay (number)

The overflow text tooltip delays disappearance time. If you need to delay disappearance so that the mouse can move to the tooltip content, you can configure this configuration item.

##${prefix} confine (boolean) = true

Whether to confine the tooltip box within the canvas area, default is enabled. It is valid for renderMode:"html".

#${prefix} legends

Legend configuration, currently providing three types of legends, namely discrete legend (`'discrete'`), continuous color legend (`'color'`), and continuous size legend (`'size'`).

{{ use: component-legend-discrete(
  prefix = ${prefix}
)}}

{{ use: component-legend-color(
  prefix = ${prefix}
) }}

{{ use: component-legend-size(
  prefix = ${prefix}
) }}

#${prefix} axes
Specifically the same as the axis configuration of VChart, it can support [linear axis](https://visactor.io/vchart/option/barChart#axes-linear.type), [discrete axis](https://visactor.io/vchart/ option/barChart#axes-band.type) and [time axis](https://visactor.io/vchart/option/barChart#axes-time.type).

Supports axis configuration in four directions. By default, the upper axis is at the last row of the column header, the lower axis is at the frozen row at the bottom of the table, the left axis is at the last column of the row header, and the upper axis is at the rightmost fixed column of the header. If axes of a certain orientation are also configured in the spec of the indicator, the priority in the spec is higher.

Example:

```
{
  axes: [
      {
        orient: 'bottom'
      },
      {
        orient: 'left',
        title: {
          visible: true
        }
      },
      {
        orient: 'right',
        visible: true,
        grid: {
          visible: false
        }
      }
    ]
}
```

#${prefix} customRender(Function|Object)

Custom rendering in function or object form. Type: `ICustomRenderFuc | ICustomRenderObj`.

Where ICustomRenderFuc is defined as:

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '##' + ${prefix},
) }}

## overscrollBehavior(string) = 'auto'

Table scrolling behavior, can be set: 'auto'|'none', the default value is 'auto'.

```
'auto': Trigger the browser's default behavior when the table scrolls to the top or bottom;
'none': don't triggers the browser's default behavior when the table scrolls to the top or bottom;
```

#${prefix} customMergeCell(Function|Object)
Customize cell merging rules. When the incoming row and column numbers are within the target area, the merging rules are returned:

- text: Merge text in cells
- range: merged range
- style: style of merged cells
  Example:

```
  customMergeCell: (col, row, table) => {
    if (col > 0 && col < 8 && row > 7 && row < 11) {
      return {
        text: 'merge text',
        range: {
          start: {
            col: 1,
            row: 8
          },
          end: {
            col: 7,
            row: 10
          }
        },
        style: {
          bgColor: '#ccc'
        }
      };
    }
  }

```

`customMergeCell` can also be configured as an array of merge rules. Each item in the array is a merge rule. The configuration of the rule is the same as the return value of the `customMergeCell` callback function.

#${prefix} customCellStyle(Array)

```
{
   customCellStyle: {id: string;style: ColumnStyleOption}[]
}
```

Custom cell style

- id: the unique id of the custom style
- style: Custom cell style, which is the same as the `style` configuration in `column`. The final rendering effect is the fusion of the original style of the cell and the custom style.

#${prefix} customCellStyleArrangement(Array)

```
{
  customCellStyleArrangement:
  {
    cellPosition: {
      row?: number;
      col?: number;
      range?: {
        start: {row: number; col: number};
        end: {row: number; col: number}
      }
  };
  customStyleId: string}[]
}
```

Custom cell style assignment

- cellPosition: cell position information, supports configuration of single cells and cell areas
  - Single cell: `{ row: number, column: number }`
  - Cell range: `{ range: { start: { row: number, column: number }, end: { row: number, column: number} } }`
- customStyleId: Custom style id, the same as the id defined when registering the custom style

#${prefix} editor (string|Object|Function)

Global configuration cell editor

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

Among them, IEditor is the editor interface defined in @visactor/vtable-editors. For details, please refer to the source code: https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts .

#${prefix} headerEditor (string|Object|Function)

** `PivotChart` does not support setting this configuration item. **
Global configuration table header display title title editor

```
headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

#${prefix} editCellTrigger('doubleclick' | 'click' | 'api' |'keydown') = 'doubleclick'

The trigger timing for entering the editing state.

```

/** Edit triggering time: double click event | single click event | api to manually start editing | keydown event. Default is double click 'doubleclick' */
editCellTrigger?:'doubleclick' | 'click' | 'api' | 'keydown' | ('doubleclick' | 'click' | 'api' | 'keydown')[];
```

#${prefix} rowSeriesNumber(IRowSeriesNumber)

set row serial number.
{{ use: row-series-number(
    prefix = '###',
) }}

#${prefix} enableLineBreak(boolean) = false

Whether to enable line break, the default is false.

#${prefix} clearDOM(boolean) = true

Whether to clear the container DOM.

#${prefix} canvasWidth(number | 'auto')

Sets the width of the canvas directly. If 'auto' is set, the canvas will be stretched based on the table content.

If not set, the size of the table will be determined based on the container's width and height.

#${prefix} canvasHeight(number | 'auto')

Sets the height of the canvas directly. If 'auto' is set, the canvas will be stretched based on the table content.

If not set, the size of the table will be determined based on the container's width and height.

#${prefix} maxCanvasWidth(number)

The maximum width of the table canvas. Only effective when canvasWidth is set to 'auto'.

#${prefix} maxCanvasHeight(number)

The maximum height of the table canvas. Only effective when canvasHeight is set to 'auto'.

#${prefix} animationAppear(boolean|Object|)

Table entry animation configuration.

```
animationAppear?: boolean | {
  type?: 'all' | 'one-by-one';
  direction?: 'row' | 'column';
  duration?: number;
  delay?: number;
};
```

You can configure true to enable the default animation, or you can configure the animation parameters:

- `type` The type of the entry animation, currently supports `all` and `one-by-one`, and the default is `one-by-one`
- `direction` The direction of the entry animation, currently supports `row` and `column`, and the default is `row`
- `duration` The duration of a single animation, in milliseconds, for `one-by-one`, it is the duration of one animation, and the default is 500
- `delay` The delay of the animation, in milliseconds; for `one-by-one`, it is the time difference between the two animations, for `all`, it is the delay of all animations, and the default is 0

#${prefix} formatCopyValue((value: string) => string)

Format the value when copying.

#${prefix} resize(Object)

Resizing lineHeight/columnWidth interaction configuration, specific configuration items as follows:

#${prefix} columnResizeMode(string) = 'all'

Mouse hover over the cell right border can drag and adjust column width. This operation can trigger the following range:

- 'all' The entire column, including header and body cells, can adjust column width
- 'none' Disable adjustment
- 'header' Only adjustable in header cells
- 'body' Only adjustable in body cells

#${prefix} rowResizeMode(string) = 'none'

Mouse hover over the cell bottom border can drag and adjust row height. This operation can trigger the following range:

- 'all' The entire row, including header and body cells, can adjust row height
- 'none' Disable adjustment
- 'header' Only adjustable in header cells
- 'body' Only adjustable in body cells

##${prefix} disableDblclickAutoResizeColWidth(boolean) = false

Disable auto resize column width when double tapping the column border line

columnResizeType(string)

Only affects in PivotTable/PivotChard The range of effects when adjusting column width, configurable options:

- `column`: Adjusting the column width only adjusts the current column
- `indicator`: When adjusting the column width, the corresponding columns of the same indicator will be adjusted
- `indicatorGroup`: Adjust the width of all indicator columns under the same parent dimension
- `all`: All column widths are adjusted

##${prefix} rowResizeType(string)

Only affects in PivotTable/PivotChard Adjust the effective range of row height, configurable items:

- `row`: adjust the row height only adjust the current row
- `indicator`: rows corresponding to the same indicator will be adjusted when the row height is adjusted
- `indicatorGroup`: Adjust the height of all indicator rows under the same parent dimension
- `all`: All row heights are adjusted
