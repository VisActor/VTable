{{ target: base-cell-type }}

${prefix} headerType(string) = 'text'

指定表头类型，可选：`'text'|'link'|'image'|'video'|'checkbox'`，默认 `'text'`。

${prefix} field(string)

**必填** 指定表头字段，对应数据源属性

${prefix} fieldFormat(FieldFormat)

配置数据格式化

```
type FieldFormat = (record: any) => any;
```

${prefix} width(number|string)

列宽指定，可为具体数值，或者'auto',再或者百分比如'20%'。
如果指定'auto',则会根据整列文本长度自动调整列宽；
如果指定百分比，则会根据表格总宽度调整当前列宽；

${prefix} maxWidth(number|string)

限制该列最大列宽

${prefix} minWidth(number|string)

限制该列最小列宽

${prefix} title(string)

表头名称

${prefix} headerStyle(IStyleOption|Function)

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
  isCheckbox = ${isCheckbox},
  isRadio = ${isRadio},
  isSwitch = ${isSwitch},
  isButton = ${isButton},
) }}

${prefix} headerIcon(string|Object|Array)

表头单元格图标配置。可配置类型有：

```
string | ColumnIconOption | (string | ColumnIconOption)[];
```

ColumnIconOption 具体配置可参考[定义](./ListTable-columns-text#icon.ColumnIconOption)

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

${prefix} sort(boolean|Function)

是否支持排序，也可以定义函数来指定排序规则

${prefix} showSort(boolean)

是否显示 sort 排序 icon，无真正的排序逻辑。如果设置了 sort 字段 则可以省略这个

${prefix} disableHover(bolean)
该列不支持 hover 交互行为

${prefix} disableSelect(boolean | ((col: number, row: number, table: BaseTableAPI) => boolean))
该列不支持选中

${prefix} disableHeaderHover(bolean)
该列表头不支持 hover 交互行为

${prefix} disableHeaderSelect(boolean)
该列表头不支持选中

${prefix} description(string)
表头 hover 时的描述信息 会以 tooltip 形式展示出来

${prefix} dropDownMenu(MenuListItem[])
下拉菜单项配置。下拉菜单项可以是一级菜单项或者二级菜单项，只要有一个配置即可。

具体类型为 `MenuListItem[] `。

{{ use: common-menu-list-item() }}

${prefix} headerCustomRender(Function|Object)

表头单元格自定义渲染，函数形式或者对象形式。类型为：`ICustomRenderFuc | ICustomRenderObj`。

[示例链接](../demo/custom-render/custom-render) [教程链接](../guide/custom_define/custom_render)

其中 ICustomRenderFuc 定义为：

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '#' + ${prefix},
) }}

${prefix} headerCustomLayout(Function)
表头单元格自定义布局元素定义，该自定义形式适合内容复杂布局的单元格。

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} customRender(Function|Object)
body 单元格表头单元格自定义渲染，函数形式或者对象形式。类型为：`ICustomRenderFuc | ICustomRenderObj`。

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

body 单元格自定义布局元素定义，该自定义形式适合内容复杂布局的单元格。

定义为如下函数：

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
    prefix =  '#'+${prefix},
) }}

${prefix} dragHeader(boolean)
是否可以拖拽表头

${prefix} columnWidthComputeMode(string)
列宽计算模式:`'normal' | 'only-header' | 'only-body'`，only-header 只考虑表头的内容 only-body 只考虑 body 的内容 normal 能被显示出来的所有内容

${prefix} disableColumnResize(boolean)
是否禁用调整列宽,如果是转置表格或者是透视表的指标是行方向指定 那该配置不生效

${prefix} tree (boolean)
该列是否展示为树形结构，需要结合 records 数据结构才能实现，需要展开的节点配置`children`来容纳子节点数据。如：

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

配置该列单元格编辑器

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

其中 IEditor 是@visactor/vtable-editors 中定义的编辑器接口，具体可以参看源码：https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts。

${prefix} headerEditor (string|Object|Function)

配置该列表头显示标题 title

```
headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

${prefix} columns (Array)
同上层的列配置数组，嵌套结构来描述列分组关系。

${prefix} hideColumnsSubHeader(boolean) = false
是否隐藏子表头的 header 标题，默认不隐藏。

${prefix} aggregation(Aggregation | CustomAggregation | Array)

非必填。

数据聚合配置，对该列数据进行汇总分析。

全局 option 也可以配置，对每一列都配置聚合规则。

可参考[教程文档](https://visactor.io/vtable/guide/data_analysis/list_table_dataAnalysis)

${prefix} hide(boolean) = false
非必填。

是否隐藏列
