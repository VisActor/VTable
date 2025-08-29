{{ target: table-sheet }}

# VTableSheet

电子表格组件，配置对应的类型 IVTableSheetOptions，具体配置项如下：

## width(number)

表格宽度，单位为像素。

## height(number)

表格高度，单位为像素。

## sheets(Array<ISheetDefine>)

工作表定义数组，每个工作表的配置如下：

### sheetTitle(string)

工作表标题，显示在底部标签栏中。

### sheetKey(string)

工作表的唯一标识符。

### columnCount(number)

列数，默认为20。

### rowCount(number)

行数，默认为100。

### columns(Array<IColumnDefine>)

列定义数组，每列的配置继承自VTable的ColumnDefine，具体可参考VTable的[ColumnDefine](./ListTable-columns-text#cellType)。

并扩展了以下属性：

#### filter(boolean)

是否启用筛选功能。

其他配置可参考VTable的[ColumnDefine](./ListTable-columns-text#cellType)。

### data(Array<Array<string|number>>)

表格数据，二维数组格式。

### active(boolean)

是否是当前活动工作表。

### cellMerge(CustomMergeCellArray)

单元格合并配置，格式为：

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

冻结行数。

### frozenColCount(number)

冻结列数。

### showHeader(boolean)

是否显示表头。

### firstRowAsHeader(boolean)

是否将第一行作为表头。

### formulas(Record<string, string>)

公式定义，键为单元格地址（如"A1"），值为公式内容（如"=SUM(B1:B5)"）。

### filter(boolean | IFilterConfig)

筛选配置，可以是布尔值或详细配置对象。

{{ use: sheet-filter-config }}

### filterState(IFilterState)

筛选状态，设置当前的筛选条件和状态。

### theme(IThemeDefine)

工作表主题配置。

{{use:sheet-theme( prefix = '####', )}}

## showToolbar(boolean) = false

是否显示工具栏。

## showFormulaBar(boolean) = true

是否显示公式栏。

## showSheetTab(boolean) = true

是否显示工作表切换栏。

## VTablePluginModules(Array)

插件配置数组，每个插件配置包含：

```typescript
{
  module: any; // 插件模块
  moduleOptions?: any; // 插件选项
  disabled?: boolean; // 是否禁用插件
}
```

## mainMenu(Object)

主菜单配置。

### show(boolean)

是否显示主菜单。

### items(Array<MainMenuItem>)

菜单项数组。

## theme(IThemeDefine)

主题配置. 所有sheet共享相同的主题配置。

{{use:sheet-theme( prefix = '###', )}}

## defaultRowHeight(number) = 25

默认行高。

## defaultColWidth(number) = 100

默认列宽。

{{ target: sheet-filter-config }}

${prefix} filterModes(Array<'byValue' | 'byCondition'>)

指定筛选器支持的筛选模式（按值、按条件、或两者）。

{{ target:sheet-theme }}

${prefix} rowSeriesNumberCellStyle(Object)

行号单元格样式。

${prefix} colSeriesNumberCellStyle(Object)

列号单元格样式。

${prefix} tableTheme(ITableThemeDefine)

表格主题配置。与VTable的[ITableThemeDefine](./ListTable#theme.underlayBackgroundColor)配置相同。
