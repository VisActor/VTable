{{ target: table-sheet }}

# VTableSheet

电子表格组件，配置对应的类型 IVTableSheetOptions，具体配置项如下：

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

### editable(boolean)

是否允许编辑该工作表。
- `true`: 允许编辑（默认）。
- `false`: 只读模式。
**优先级**：此配置优先级高于全局 `IVTableSheetOptions.editable`。

### keyboardShortcutPolicy(SheetKeyboardShortcutPolicy)

该工作表的快捷键策略配置。可用于覆盖全局的快捷键策略。
具体配置项参考全局配置中的 `keyboardShortcutPolicy`。

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

### sortState(Array<SortState> | SortState | null)

排序状态，设置当前的排序条件和状态。

SortState定义可参考[SortState](./ListTable#sortState)。
```
SortState {
  /** 排序依据字段 */
  field: number|string;
  /** 排序规则 */
  order: 'desc' | 'asc' | 'normal';
}
```

### theme(IThemeDefine)

工作表主题配置。

{{use:sheet-theme( prefix = '####', )}}

### dragOrder(Object)

拖拽列顺序和行顺序配置。

```typescript
dragOrder: {
  enableDragColumnOrder: boolean;
  enableDragRowOrder: boolean;
}
```

### columnWidthConfig

列宽配置。其中key为列索引，从0开始，width为要设置的列宽。

```typescript
columnWidthConfig: {
  key: string | number;
  width: number;
}
```

### rowHeightConfig

行高配置。其中key为行索引，从0开始，height为要设置的行高。

```typescript
rowHeightConfig: {
  key: number;
  height: number;
}
```

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

{{use:sheet-main-menu( prefix = '###', )}}

## theme(IThemeDefine)

主题配置. 所有sheet共享相同的主题配置。

{{use:sheet-theme( prefix = '###', )}}

## defaultRowHeight(number) = 25

默认行高。

## defaultColWidth(number) = 100
默认列宽。

## editable(boolean) = true

全局编辑能力开关。
- `true`: 默认所有工作表可编辑（除非工作表单独配置为只读）。
- `false`: 默认所有工作表只读（除非工作表单独配置为可编辑）。
只读模式下：
- 双击和按键无法进入编辑状态。
- 剪切、粘贴等修改性快捷键被禁用。
- Delete/Backspace 无法清空单元格。
- 右键菜单中的修改项被隐藏。

## keyboardShortcutPolicy(SheetKeyboardShortcutPolicy)

全局快捷键策略配置。定义了允许或禁用的快捷键行为。
常用属性：
- `copySelected` (boolean): 是否允许复制 (Ctrl+C)。默认 true。
- `cutSelected` (boolean): 是否允许剪切 (Ctrl+X)。只读模式下强制 false。
- `pasteValueToCell` (boolean): 是否允许粘贴 (Ctrl+V)。只读模式下强制 false。
- `selectAllOnCtrlA` (boolean): 是否允许全选 (Ctrl+A)。默认 true。
- `deleteRange` (boolean): 是否允许 Delete/Backspace 清空选区。只读模式下强制 false。

## dragOrder(Object)

拖拽列顺序和行顺序配置。

```typescript
dragOrder: {
  enableDragColumnOrder: boolean;
  enableDragRowOrder: boolean;
}
```

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

{{ target: sheet-main-menu }}

${prefix} show(boolean)

是否显示主菜单。

${prefix} items(Array<MainMenuItem>)

菜单项数组。

{{ use:sheet-main-menu-item( prefix = '#'+${prefix}, )}}

{{ target: sheet-main-menu-item }}

${prefix} name(string)

菜单项名称。

${prefix} menuKey(string)

菜单项唯一标识。菜单项唯一标识，如果配置了menuKey，点击菜单项时，会匹配内置逻辑（目前仅支持导入导出相关功能，且需要配置VTablePluginModules来启用）。

${prefix} description(string)

菜单项描述。

${prefix} onClick(Function)

菜单项点击回调。

${prefix} items(Array<MainMenuItem>)

子菜单项数组。