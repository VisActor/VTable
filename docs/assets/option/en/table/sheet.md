{{ target: table-sheet }}

# VTableSheet

Spreadsheet component, configuration type is IVTableSheetOptions, with the following configuration options:

## sheets(Array<ISheetDefine>)

Worksheet definition array, each worksheet has the following configuration:

### sheetTitle(string)

Worksheet title, displayed in the bottom tab bar.

### sheetKey(string)

Unique identifier for the worksheet.

### columnCount(number)

Number of columns, default is 20.

### rowCount(number)

Number of rows, default is 100.

### columns(Array<IColumnDefine>)

Column definition array, each column's configuration inherits from VTable's ColumnDefine, refer to VTable's [ColumnDefine](./ListTable-columns-text#cellType) for details.

The following properties are extended:

#### filter(boolean)

Whether to enable filtering functionality.

For other configurations, refer to VTable's [ColumnDefine](./ListTable-columns-text#cellType).

### data(Array<Array<string|number>>)

Table data in two-dimensional array format.

### active(boolean)

Whether this is the currently active worksheet.

### cellMerge(CustomMergeCellArray)

Cell merge configuration, in the format:

```typescript
type CustomMergeCellArray = Array<{
    text?: string;
    range: {
      start: {col: number,row: number};
      end: {col: number,row: number};
    }
}>;
```

### frozenRowCount(number)

Number of frozen rows.

### frozenColCount(number)

Number of frozen columns.

### showHeader(boolean)

Whether to display the header.

### firstRowAsHeader(boolean)

Whether to use the first row as the header.

### formulas(Record<string, string>)

Formula definitions, where keys are cell addresses (e.g., "A1") and values are formula content (e.g., "=SUM(B1:B5)").

### filter(boolean | IFilterConfig)

Filter configuration, can be a boolean value or a detailed configuration object.

{{ use: sheet-filter-config }}

### filterState(IFilterState)

Filter state, sets the current filter conditions and state.

### theme(IThemeDefine)

Worksheet theme configuration.

{{use:sheet-theme( prefix = '####', )}}

## showToolbar(boolean) = false

Whether to display the toolbar.

## showFormulaBar(boolean) = true

Whether to display the formula bar.

## showSheetTab(boolean) = true

Whether to display the worksheet tab bar.

## VTablePluginModules(Array)

Plugin configuration array, each plugin configuration includes:

```typescript
{
  module: any; // Plugin module
  moduleOptions?: any; // Plugin options
  disabled?: boolean; // Whether to disable the plugin
}
```

## mainMenu(Object)

Main menu configuration.

{{use:sheet-main-menu( prefix = '###', )}}

## theme(IThemeDefine)

Theme configuration. All sheets share the same theme configuration.

{{use:sheet-theme( prefix = '###', )}}

## defaultRowHeight(number) = 25

Default row height.

## defaultColWidth(number) = 100

Default column width.

{{ target: sheet-filter-config }}

${prefix} filterModes(Array<'byValue' | 'byCondition'>)

Specifies the filter modes supported by the filter (by value, by condition, or both).

{{ target:sheet-theme }}

${prefix} rowSeriesNumberCellStyle(Object)

Row number cell style.

${prefix} colSeriesNumberCellStyle(Object)

Column number cell style.

${prefix} tableTheme(ITableThemeDefine)

Table theme configuration. Same as VTable's [ITableThemeDefine](./ListTable#theme.underlayBackgroundColor) configuration.

{{ target: sheet-main-menu }}

${prefix} show(boolean)

Whether to display the main menu.

${prefix} items(Array<MainMenuItem>)

Menu items array.

{{ use:sheet-main-menu-item( prefix = '#'+${prefix}, )}}

{{ target: sheet-main-menu-item }}

${prefix} name(string)

Menu item name.

${prefix} menuKey(string)

Unique identifier for the menu item. If menuKey is configured, when the menu item is clicked, it will match built-in logic (currently only supports import/export related functions, and requires VTablePluginModules to be configured to enable).

${prefix} description(string)

Menu item description.

${prefix} onClick(Function)

Menu item click callback.

${prefix} items(Array<MainMenuItem>)

Submenu items array.