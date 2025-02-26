{{ target: base-indicator-type }}

${prefix} indicatorKey(string)

**必填** 指标的唯一标识

${prefix} title(string)

指标名

${prefix} format(FieldFormat)

指标值格式化

```
type FieldFormat = (value: number|string, col:number, row:number, table:PivotTable) => any;
```

${prefix} headerFormat(FieldFormat)

指标名称的 format

```
type FieldFormat = (title: number|string, col:number, row:number, table:PivotTable) => any;
```

${prefix} width(number|string)

指标列宽指定，如果指标以行来展示则该配置不生效。
列宽指定，可为具体数值，或者'auto',再或者百分比如'20%'。
如果指定'auto',则会根据整列文本长度自动调整列宽；
如果指定百分比，则会根据表格总宽度调整当前列宽；

${prefix} maxWidth(number|string)

该指标列宽最大值

${prefix} minWidth(number|string)

该指标列宽最小值

${prefix} headerType(string) = 'text'

指定表头类型，可选：`'text'|'link'|'image'|'video'`，默认 `'text'`。

${prefix} headerStyle(TODO)

表头单元格样式，配置项根据 headerType 不同有略微差别。每种 headerStyle 的配置项可参考：

- headerType 为'text'，对应[headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- headerType 为'link'，对应[headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- headerType 为'image'，对应[headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)
- headerType 为'video'，对应[headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)

${prefix} style

body 单元格样式，类型声明：

```
style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

IStyleOption 类型结构如下：

{{ use: common-style(
  prefix = ${prefix},
  isImage = ${isImage},
  isProgressbar = ${isProgressbar},
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

ColumnIconOption 可参考[定义](/zh/option.html#PivotTable-indicators-text.icon.ColumnIconOption定义：)

${prefix} icon(string|Object|Array|Funciton)

body 单元格图标配置。

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
type 配置成 'image'。需要配置图片地址在 src 中
{{ use: image-icon(  prefix = '##' + ${prefix}) }}

#${prefix}SvgIcon(Object)
type 配置成 'svg'。需要配置 svg 地址或者 svg 完整文件字符串在 svg 中
{{ use: svg-icon(  prefix = '##' + ${prefix}) }}

#${prefix}TextIcon(Object)
type 配置成 'text'。需要配置文本内容在 content 中
{{ use: text-icon(  prefix = '##' + ${prefix}) }}

${prefix} headerCustomRender(Function|Object)
指标名称表头自定义渲染内容定义。可具体参考[基本表格自定义渲染配置](../option/ListTable-columns-text#headerCustomRender)

${prefix} headerCustomLayout(Function)

指标名称表头单元格自定义布局元素。

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} customRender(Function|Object)

指标值 body 单元格自定义渲染内容定义，函数形式或者对象形式。类型为：`ICustomRenderFuc | ICustomRenderObj`。

[示例链接](../demo/custom-render/custom-render) [教程链接](../guide/custom_define/custom_render)

其中 ICustomRenderFuc 定义为：

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '#' + ${prefix},
) }}

${prefix} customLayout(Function)

指标值 body 单元格自定义布局元素。

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

${prefix} showSort(boolean|Function)
是否显示排序 icon，无数据排序逻辑

```
  showSort?: boolean | ((args: { row: number; col: number; table: BaseTableAPI }) => boolean);
```

${prefix} hide(boolean|Function)
指标隐藏 默认 false

```
  hide?:  boolean | ((args: { dimensionPaths: IDimensionInfo[]; table: BaseTableAPI }) => boolean);
```

${prefix} disableColumnResize(boolean)
是否禁用调整列宽,如果是转置表格或者是透视表的指标是行方向指定 那该配置不生效

${prefix} editor (string|Object|Function)

配置该指标单元格编辑器

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

其中 IEditor 是@visactor/vtable-editors 中定义的编辑器接口，具体可以参看源码：https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts。
