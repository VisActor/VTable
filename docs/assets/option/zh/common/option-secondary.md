{{ target: common-option-secondary }}

#${prefix} widthMode('standard' | 'adaptive' | 'autoWidth') = 'standard'

表格列宽度的计算模式，可以是 'standard'（标准模式）、'adaptive'（自适应容器宽度模式）或 'autoWidth'（自动宽度模式），默认为 'standard'。

- 'standard'：使用 width 属性指定的宽度作为列宽度。
- 'adaptive'：使用表格容器的宽度分配列宽度。
- 'autoWidth'：根据列头和 body 单元格中内容的宽度自动计算列宽度，忽略 width 属性的设置。

#${prefix} heightMode('standard' | 'adaptive' | 'autoHeight') = 'standard'

表格行高的计算模式，可以是 'standard'（标准模式）、'adaptive'（自适应容器高度模式）或 'autoHeight'（自动行高模式），默认为 'standard'。

- 'standard'：采用 `defaultRowHeight` 及 `defaultHeaderRowHeight` 作为行高。
- 'adaptive'：使用容器的高度分配每行高度，基于每行内容计算后的高度比例来分配。
- 'autoHeight'：根据内容自动计算行高，计算依据 fontSize 和 lineHeight(文字行高)，以及 padding。相关搭配设置项`autoWrapText`自动换行，可以根据换行后的多行文本内容来计算行高。

#${prefix} widthAdaptiveMode('only-body' | 'all') = 'only-body'

adaptive 模式下宽度的适应策略，默认为 'only-body'。

- 'only-body'：只有 body 部分的列参与宽度适应计算，表头部分宽度不变。
- 'all'：所有列参与宽度适应计算。

#${prefix} heightAdaptiveMode('only-body' | 'all') = 'only-body'

adaptive 模式下高度的适应策略，默认为 'only-body'。

- 'only-body'：只有 body 部分的行参与高度适应计算，表头部分高度不变。
- 'all'：所有列参与高度适应计算。

#${prefix} columnWidthComputeMode('normal' | 'only-header' | 'only-body') = 'normal'

计算内容宽度时限定区域参与计算：

- 'only-header'：只计算表头内容。
- 'only-body'：只计算 body 单元格内容。
- 'normal'：正常计算，即计算表头和 body 单元格内容。

#${prefix} autoWrapText(boolean) = false

是否自动换行

#${prefix} autoFillWidth(boolean) = false
配置项 autoFillWidth，用于控制是否自动撑满容器宽度。区别于宽度模式`widthMode`的`adaptive`的自适应容器的效果，autoFillWidth 控制的是只有当列数较少的时候，表格可以自动撑满容器宽度，但是当列数超过容器的时候根据真实情况来定列宽可出现滚动条。

#${prefix} autoFillHeight(boolean) = false
配置项 autoFillHeight，用于控制是否自动撑满容器高度。区别于高度模式`heightMode`的`adaptive`的自适应容器的效果，autoFillHeight 控制的是只有当行数较少的时候，表格可以自动撑满容器高度，但是当行数超过容器的时候根据真实情况来定行高可出现滚动条。

#${prefix} maxCharactersNumber(number) = 200

单元格中可显示最大字符数 默认 200

#${prefix} maxOperatableRecordCount(number)

最大可操作的记录数 如 copy 操作可复制出最大数据条目数

#${prefix} limitMaxAutoWidth(boolean|number) = 450

计算列宽时 指定最大列宽 可设置 boolean 或者具体的值 默认为 450

#${prefix} limitMinWidth(boolean|number) = 10

最小列宽限制。如设置为 true 则拖拽改变列宽时限制列宽最小为 10px，设置为 false 则不进行限制。或者直接将其设置为某个数字值。默认为 10px。

#${prefix} frozenColCount(number) = 0

冻结列数

#${prefix} frozenRowCount(number) = 0

冻结行数（包含表头）

#${prefix} rightFrozenColCount(number) = 0

右侧冻结列数

#${prefix} bottomFrozenRowCount(number) = 0

底部冻结行数

#${prefix} allowFrozenColCount(number) = 0

允许冻结列数，表示前多少列会出现冻结操作按钮（基本表格生效）

#${prefix} showFrozenIcon(boolean) = true

是否显示固定列图钉（基本表格生效）

#${prefix} defaultRowHeight(number) = 40

默认行高

#${prefix} defaultHeaderRowHeight(Array|number)

列表头默认行高 可以按逐行设置 如果没有就取 defaultRowHeight

#${prefix} defaultColWidth(number) = 80

列宽默认值

#${prefix} defaultHeaderColWidth(Array|number)

行表头默认列宽 可以按逐列设置 如果没有就取 defaultColWidth

#${prefix} keyboardOptions(Object)

快捷键功能设置，具体配置项：

##${prefix} selectAllOnCtrlA(boolean) = false
开启快捷键全选。
支持 `boolean` 或者具体配置类型`SelectAllOnCtrlAOption`。

```
export interface SelectAllOnCtrlAOption {
  disableHeaderSelect?: boolean; //快捷键全选时，是否禁止选中表头。
  disableRowSeriesNumberSelect?: boolean;  //快捷键全选时，是否禁止选中行序列号。
}
```

##${prefix} copySelected(boolean) = false
开启快捷键复制，与浏览器的快捷键一致。

##${prefix} pasteValueToCell(boolean) = false
开启快捷键粘贴，与浏览器的快捷键一致。粘贴生效仅针对配置了编辑 editor 的单元格

##${prefix} moveFocusCellOnTab(boolean) = true
开启 tab 键交互 默认为 true。开启 tab 键移动选中单元格，如果当前是在编辑单元格 则移动到下一个单元格也是编辑状态

##${prefix} moveFocusCellOnEnter(boolean) = false
开启 enter 键交互 默认 fasle。 按下 enter 键选择下一个单元格。和 editCellOnEnter 互斥，同时设置为 true 优先级高于 editCellOnEnter。

##${prefix} editCellOnEnter(boolean) = true
开启 enter 键交互 。默认 true 如果选中单元格按下 enter 键进入单元格编辑

##${prefix} moveEditCellOnArrowKeys(boolean) = false
默认不开启即 false。开启这个配置的话，如果当前是在编辑中的单元格，方向键可以移动到下个单元格并进入编辑状态，而不是编辑文本内字符串的光标移动。上下左右方向键切换选中单元格不受该配置影响，

##${prefix} moveEditCellOnArrowKeys(boolean) = false

默认不开启即 false。

开启这个配置的话，如果当前是在编辑中的单元格，方向键可以移动到下个单元格并进入编辑状态，而不是编辑文本内字符串的光标移动 。

上下左右方向键切换选中单元格不受该配置影响，

#${prefix} eventOptions(Object)

事件触发相关问题设置，具体配置项：

##${prefix} preventDefaultContextMenu(boolean) = true
阻止鼠标右键的默认行为

#${prefix} excelOptions(Object)

对齐 excel 高级能力

##${prefix} fillHandle(boolean) = false

填充柄，设置为 true 后，当选中单元格后，填充柄会显示在单元格右下方，可以拖动填充柄来编辑单元格的值。或者双击填充柄来改变需要编辑单元格的值。

#${prefix} columnResizeMode(string) = 'all'

鼠标 hover 到单元格右边界可拖拽调整列宽。该操作可触发的范围：

- 'all' 整列包括表头和 body 处的单元格均可调整列宽
- 'none' 禁止调整
- 'header' 只能在表头处单元格调整
- 'body' 只能在 body 单元格调整

#${prefix} rowResizeMode(string) = 'all'

鼠标 hover 到单元格下边界可拖拽调整行高。该操作可触发的范围：

- 'all' 整列包括表头和 body 处的单元格均可调整列宽
- 'none' 禁止调整
- 'header' 只能在表头处单元格调整
- 'body' 只能在 body 单元格调整

#${prefix} dragHeaderMode(string) = 'none'

控制拖拽表头移动位置的开关。选中某个单元格后，鼠标拖拽该单元格可触发移动。 可换位单元格范围限定：

- 'all' 所有表头均可换位
- 'none' 不可换位
- 'column' 只有换列表头可换位
- 'row' 只有换行表头可换位


#${prefix} dragSortRow(boolean) = false

控制拖拽行移动位置的开关。点击某个单元格后，鼠标拖拽该单元格可触发移动。

#${prefix} hover(Object)

hover 交互配置，具体配置项如下：

##${prefix} highlightMode('cross'|'column'|'row'|'cell') = 'cross'
hover 交互响应模式：十字交叉、整列、整行或者单个单元格。

##${prefix} disableHover(boolean) = false
不响应鼠标 hover 交互。

##${prefix} disableHeaderHover(boolean) = false
单独设置表头不响应鼠标 hover 交互。

#${prefix} select(Object)

选择单元格交互配置，具体配置项如下：

##${prefix} headerSelectMode ('inline' | 'cell') = 'inline'

点击表头单元格时连带 body 整行或整列选中 或仅选中当前单元格，默认或整行或整列选中。

可选值：'inline' | 'cell'。

##${prefix} disableSelect (boolean) = false

不响应鼠标 select 交互。

##${prefix} disableHeaderSelect (boolean) = false

单独设置表头不响应鼠标 select 交互。

##${prefix} blankAreaClickDeselect(boolean) = false

点击空白区域是否取消选中。

##${prefix} outsideClickDeselect(boolean) = true

点击外部区域是否取消选中。

##${prefix} disableDragSelect(boolean) = true

拖拽选择单元格时是否禁用框选。

#${prefix} theme(Object)

{{ use: common-theme(
  prefix = '#' + ${prefix},
) }}

#${prefix} menu(Object)

下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失。具体配置项如下：
##${prefix} renderMode('canvas' | 'html') = 'html'

menu 渲染方式，html 目前实现较完整，先默认使用 html 渲染方式。

##${prefix} defaultHeaderMenuItems(MenuListItem[])

内置下拉菜单的全局设置项，类型为`MenuListItem[]`。目前只针对基本表格有效，会对每个表头单元格开启默认的下拉菜单功能。

{{ use: common-menu-list-item() }}

##${prefix} contextMenuItems(Array|Function)

右键菜单。声明类型：

```
MenuListItem[] | ((field: string, row: number) => MenuListItem[]);
```

{{ use: common-menu-list-item() }}

##${prefix} dropDownMenuHighlight(Array)

设置选中状态的菜单。声明类型为`DropDownMenuHighlightInfo[]`。
DropDownMenuHighlightInfo 的定义如下：

```
{
  /** 设置下拉状态所在单元格列号 */
  col?: number;
  /** 设置下拉状态所在单元格行号 */
  row?: number;
  /** 设置下拉状态对应的字段名，或者透视表的话需设置维度信息 */
  field?: string | IDimensionInfo[];
  /** 指定下拉菜单项的key值 */
  menuKey?: string;
}
```

{{ use: common-IDimensionInfo()}}

#${prefix} title(Object)

{{ use: common-title(
  prefix = '#' + ${prefix},
) }}

#${prefix} emptyTip(Object)

表格空数据提示。

可以直接配置`boolean` 或者 `IEmptyTip`类型对象， 默认为 false，不显示提示信息。

`IEmptyTip`类型定如如下：

{{ use: common-emptyTip(
  prefix = '#' + ${prefix},
) }}

#${prefix} tooltip(Object)

tooltip 相关配置。具体配置如下：
##${prefix} renderMode ('html') = 'html'

html 目前实现较完整，先默认使用 html 渲染方式。目前暂不支持 canvas 方案，后续会支持上

##${prefix} isShowOverflowTextTooltip (boolean)

是否需要在 hover 到单元格时显示溢出文本内容 tooltip。暂时需要将 renderMode 配置为 html 才能显示，canvas 的还未开发。

##${prefix} overflowTextTooltipDisappearDelay (number)

溢出文本 tooltip 延时消失时间，如果需要延迟消失以使得鼠标可以移动到 tooltip 内容上，可以配置该配置项。

##${prefix} confine (boolean) = true

是否将 tooltip 框限制在画布区域内，默认开启。针对 renderMode:"html" 有效。

#${prefix} legends

图例配置，目前提供了三种图例类型，分别是离散图例（`'discrete'`），连续型颜色图例（`'color'`），连续型尺寸图例（`'size'`）。

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

具体同 VChart 的轴配置，可支持[线性轴](https://visactor.io/vchart/option/barChart#axes-linear.type)，[离散轴](https://visactor.io/vchart/option/barChart#axes-band.type)和[时间轴](https://visactor.io/vchart/option/barChart#axes-time.type)。

支持四个方向的轴配置，默认上轴在列表头的最后一行，下轴在表格底部的冻结一行，左轴在行表头的最后一列，上轴在表头最右侧固定的一列。如果在 indicator 的 spec 中同时也配置了某一方位的 axes，spec 中的优先级较高。

示例：

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

自定义渲染 函数形式或者对象形式。类型为：`ICustomRenderFuc | ICustomRenderObj`。

[示例链接](../demo/custom-render/custom-render) [教程链接](../guide/custom_define/custom_render)

其中 ICustomRenderFuc 定义为：

```
 type ICustomRenderFuc = (args: CustomRenderFunctionArg) => ICustomRenderObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: common-custom-render-object(
  prefix = '##' + ${prefix},
) }}

## overscrollBehavior(string) = 'auto'

表格滚动行为，可设置：'auto'|'none'，默认值为'auto'。

```
'auto': 表格滚动到顶部或者底部时，触发浏览器默认行为;
'none': 表格滚动到顶部或者底部时, 禁止触发浏览器默认行为;
```

#${prefix} customMergeCell(Function)
自定义单元格合并规则，传入的行列号在目标区域内时，返回合并规则：

- text: 合并单元格内的文字
- range: 合并的范围
- style: 合并单元格的样式
  示例：

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

#${prefix} customCellStyle(Array)

```
{
  customCellStyle: {id: string;style: ColumnStyleOption}[]
}
```

自定义单元格样式

- id: 自定义样式的唯一 id
- style: 自定义单元格样式，与`column`中的`style`配置相同，最终呈现效果是单元格原有样式与自定义样式融合

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

自定义单元格样式分配

- cellPosition: 单元格位置信息，支持配置单个单元格与单元格区域
  - 单个单元格：`{ row: number, column: number }`
  - 单元格区域：`{ range: { start: { row: number, column: number }, end: { row: number, column: number} } }`
- customStyleId: 自定义样式 id，与注册自定义样式时定义的 id 相同

#${prefix} rowSeriesNumber(IRowSeriesNumber)

配置行序号。
{{ use: row-series-number(
    prefix = '###',
) }}

#${prefix} editor(string|Object|Function)

全局配置单元格编辑器

```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

其中 IEditor 是@visactor/vtable-editors 中定义的编辑器接口，具体可以参看源码：https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts。

#${prefix} headerEditor (string|Object|Function)

全局配置表头显示标题 title 的编辑器

```
headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

#${prefix} editCellTrigger('doubleclick' | 'click' | 'api' | 'keydown') = 'doubleclick'

进入编辑状态的触发时机。

```

/** 编辑触发时机:双击事件 | 单击事件 | api 手动开启编辑 | 键入新值。默认为双击'doubleclick' /
editCellTrigger?: 'doubleclick' | 'click' | 'api' | 'keydown' | ('doubleclick' | 'click' | 'api' | 'keydown')[];

```

#${prefix} enableLineBreak(boolean) = false

是否开启换行符解析，开启后，单元格内容中包含换行符时，会自动解析换行。

#${prefix} clearDOM(boolean) = true

是否清空容器 DOM。

#${prefix} canvasWidth(number)

直接设置 canvas 的宽度. 不根据容器宽高来决定表格的尺寸

#${prefix} canvasHeight(number)

直接设置 canvas 的高度. 不根据容器宽高来决定表格的尺寸

#${prefix} animationAppear(boolean|Object|)

表格的入场动画配置。

```
animationAppear?: boolean | {
  type?: 'all' | 'one-by-one';
  direction?: 'row' | 'column';
  duration?: number;
  delay?: number;
};
```

可以配置 true 开启默认动画，也可以配置动画的参数：

- `type` 入场动画的类型，目前支持 `all` 和 `one-by-one`两种，默认为 `one-by-one`
- `direction` 入场动画的方向，目前支持 `row` 和 `column`两种，默认为 `row`
- `duration` 单个动画的时长，单位为毫秒，`one-by-one` 时，为一次动画的时长，默认为 500
- `delay` 动画的延迟，单位为毫秒；`one-by-one` 时为两次动画直接的时间差，`all` 时为所有动画的延迟，默认为 0

#${prefix} formatCopyValue((value: string) => string)

设置复制内容格式化函数。
