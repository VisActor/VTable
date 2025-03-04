{{ target: base-dimension-type }}

${prefix} dimensionKey(string)

**必填** 维度的唯一标识，对应数据集的字段名称

${prefix} title(string)

**必填** 维度名称，角头可配置显示维度名称

${prefix} headerFormat(FieldFormat)

维度值的 format

```
type FieldFormat = (title: string, col:number, row:number,table: PivotTable) => any;
```

${prefix} width(number|string)

维度作为行表头时起作用，表示该维度单元格的宽度。
列宽指定，可为具体数值，或者'auto',再或者百分比如'20%'。
如果指定'auto',则会根据整列文本长度自动调整列宽；
如果指定百分比，则会根据表格总宽度调整当前列宽；

${prefix} maxWidth(number|string)

维度作为行表头时起作用，表示该维度单元格的最大宽度

${prefix} minWidth(number|string)

维度作为行表头时起作用，表示该维度单元格的最小宽度

${prefix} headerStyle(IStyleOption|Function)

表头单元格样式，类型声明：

```
headerStyle?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

IStyleOption 类型结构如下：

{{ use: common-style(
  prefix = ${prefix},
  isImage = ${isImage},
) }}

${prefix} headerIcon(string|Object|Array|Function)

表头单元格图标配置

```
  headerIcon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

ColumnIconOption 的具体配置可以参考：https://visactor.io/vtable/option/ListTable-columns-text#icon

${prefix} description(string|Function)
表头 hover 时的描述信息 会以 tooltip 形式展示出来

```
 description?: string | ((args: CellInfo) => string);
```

${prefix} cornerDescription(string)

描述信息 hover 时提示信息

${prefix} headerCustomRender(Function|Object)

表头单元格自定义渲染函数，可以指定表头的渲染方式。可具体参考[基本表格自定义渲染配置](../option/ListTable-columns-text#headerCustomRender)

${prefix} headerCustomLayout(Function)

表头单元格自定义布局元素定义，该自定义形式适合内容复杂布局的单元格。

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} dropDownMenu(MenuListItem[]|Function)
下拉菜单项配置。下拉菜单项可以是一级菜单项或者二级菜单项，只要有一个配置即可。

具体类型为 `MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[])`。

{{ use: common-menu-list-item() }}

${prefix} cornerDropDownMenu(Array)
角头单元格显示下拉按钮及下拉菜单项配置。下拉菜单项可以是一级菜单项或者二级菜单项，只要有一个配置即可。具体类型为 MenuListItem[]。

${prefix} cornerHeaderIcon(string|Object|Array|Function)

透视表角头单元格图标配置

```
  cornerHeaderIcon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

ColumnIconOption 的具体配置可以参考：https://visactor.io/vtable/option/ListTable-columns-text#icon

${prefix} dragHeader(boolean)
是否可以拖拽表头

${prefix} drillDown(boolean)
显示向下钻取图标 点击后会有对应事件

${prefix} drillUp(boolean)
显示向上钻取图标 点击后会有对应事件

${prefix} showSort(boolean|Function)
维度值单元格是否显示排序 icon，点击并无数据排序逻辑

```
  showSort?: boolean | ((args: { row: number; col: number; table: BaseTableAPI }) => boolean);
```

${prefix} sort(boolean)
对应的维度角头单元格是否显示排序图标。

排序规则：

如果在 dataConfig.sortRules 中配置了该维度的排序规则，则按照 dataConfig.sortRules 中的规则进行排序。

如果没有在 dataConfig.sortRules 中配置该维度的排序规则，则默认按照维度值字符串的自然排序。

${prefix} showSortInCorner(boolean)

在角头的维度名称单元格中是否显示排序，点击并无数据排序逻辑
