{{ target: common-option-secondary }}

#${prefix} widthMode('standard' | 'adaptive' | 'autoWidth') = 'standard'

表格列宽度的计算模式，可以是 'standard'（标准模式）、'adaptive'（自适应容器宽度模式）或 'autoWidth'（自动宽度模式），默认为 'standard'。

- 'standard'：使用 width 属性指定的宽度作为列宽度。
- 'adaptive'：使用表格容器的宽度分配列宽度。
- 'autoWidth'：根据列头和 body 单元格中内容的宽度自动计算列宽度，忽略 width 属性的设置。

#${prefix} heightMode('standard' | 'adaptive' | 'autoHeight') = 'standard'

表格行高的计算模式，可以是 'standard'（标准模式）、'adaptive'（自适应容器高度模式）或 'autoHeight'（自动行高模式），默认为 'standard'。

- 'standard'：采用 `defaultRowHeight` 及 `defaultHeaderRowHeight` 作为行高。
- 'adaptive'：使用容器的高度分配每行高度。
- 'autoHeight'：根据内容自动计算行高，计算依据 fontSize 和 lineHeight(文字行高)，以及 padding。相关搭配设置项`autoWrapText`自动换行，可以根据换行后的多行文本内容来计算行高。

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

##${prefix} copySelected(boolean) = false
开启快捷键复制，与浏览器的快捷键一致。

##${prefix} pasteValueToCell(boolean) = false
开启快捷键粘贴，与浏览器的快捷键一致。

##${prefix} moveFocusCellOnTab(boolean) = true
开启 tab 键交互 默认为 true。开启 tab 键移动选中单元格，如果当前是在编辑单元格 则移动到下一个单元格也是编辑状态

##${prefix} editCellOnEnter(boolean) = true
开启 enter 键交互 默认 true 如果选中单元格可编辑则进入单元格编辑。

##${prefix} moveEditCellOnArrowKeys(boolean) = false

默认不开启即 false。

开启这个配置的话，如果当前是在编辑中的单元格，方向键可以移动到下个单元格并进入编辑状态，而不是编辑文本内字符串的光标移动 。

上下左右方向键切换选中单元格不受该配置影响，

#${prefix} eventOptions(Object)

事件触发相关问题设置，具体配置项：

##${prefix} preventDefaultContextMenu(boolean) = true
组织鼠标右键的默认行为

#${prefix} columnResizeMode(string) = 'all'

鼠标 hover 到单元格右边界可拖拽调整列宽。该操作可触发的范围：

- 'all' 整列包括表头和 body 处的单元格均可调整列宽
- 'none' 禁止调整
- 'header' 只能在表头处单元格调整
- 'body' 只能在 body 单元格调整

#${prefix} dragHeaderMode(string) = 'all'

控制拖拽表头移动位置的开关。选中某个单元格后，鼠标拖拽该单元格可触发移动。 可换位单元格范围限定：

- 'all' 所有表头均可换位
- 'none' 不可换位
- 'column' 只有换列表头可换位
- 'row' 只有换行表头可换位

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

#${prefix} tooltip(Object)

tooltip 相关配置。具体配置如下：
##${prefix} renderMode ('html') = 'html'

html 目前实现较完整，先默认使用 html 渲染方式。目前暂不支持 canvas 方案，后续会支持上

##${prefix} isShowOverflowTextTooltip (boolean)

代替原来 hover:isShowTooltip 配置。暂时需要将 renderMode 配置为 html 才能显示，canvas 的还未开发。

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
'none': 表格滚动到顶部或者底部时, 触发浏览器默认行为;
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
