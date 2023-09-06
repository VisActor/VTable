{{ target: component-legend-discrete }}

#${prefix}  legends.discrete(string)

离散图例配置。可参考 VChart 中的[配置](https://visactor.io/vchart/option/barChart#legends-discrete.type)和[图例 demo](https://visactor.io/vchart/example)

##${prefix}  type(string) = 'discrete'

**可选**，离散图例类型声明，可选，因为图例类型默认为 `'discrete'`。

{{ use: component-base-legend(
  prefix = '#' + ${prefix} 
) }}

##${prefix}  defaultSelected(Array)

设置图例初始化时默认选中的图例项。数组中的元素为图例项的 name，如 `['图例1', '图例2']` 表示默认选中图例项名为 `'图例1'` 和 `'图例2'` 的图例项。

##${prefix}  select(boolean) = true

是否开启图例的选中功能，默认开启。

##${prefix}  selectedMode(string) = 'multiple'

图例的选中模式，可选值：`'multiple'`，`'single'`，分别代表多选和单选。

##${prefix}  hover(boolean) = true

是否开启 hover 交互。

##${prefix}  allowAllCanceled(boolean) = false

是否允许取消选中所有图例项，默认不允许，仅在 `selectedMode` 为 `'multiple'` 时有效。

##${prefix}  reversed(boolean) = false

是否反向图例项的排列顺序，默认不反向。

##${prefix}  maxWidth(number)

图例整体的最大宽度，决定水平布局的图例（orient 属性为 `'left'` | `'right'`）是否自动换行。

##${prefix}  maxRow(number)

仅当 `orient` 为 `'left'` | `'right'` 时生效，表示图例项的最大行数，超出最大行数的图例项会被隐藏。

##${prefix}  maxHeight(number)

图例整体的最大高度，决定垂直布局的图例（orient 属性为 `'top'` | `'bottom'`）是否自动换行。

##${prefix}  maxCol(number)

仅当 `orient` 为 `'top'` | `'bottom'` 时生效，表示图例项的最大列数，超出最大列数的图例项会被隐藏。

##${prefix}  item(Object)

图例项配置，包含图例项内部的图形、文本等配置。

###${prefix}  visible(boolean) = true

是否显示图例项，默认显示。

###${prefix}  spaceCol(number)

图例项的列间距，水平间距。

###${prefix}  spaceRow(number)

图例项的行间距，垂直间距。

###${prefix}  maxWidth(number|string)

图例项的最大宽度，默认为 null。可使用百分比，表示显示区域的宽度占比。

###${prefix}  width(number|string)

图例项的宽度，默认自动计算。可使用百分比，表示显示区域的宽度占比。

###${prefix}  height(number|string)

图例项的高度设置，不设置，默认自动计算。可使用百分比，表示显示区域的高度占比。

###${prefix}  padding(number|number[]|Object)

{{ use: common-padding(
  componentName='图例项'
) }}

###${prefix}  background(Object)

图例项的背景配置。

####${prefix}  visible(boolean) = false

是否展示图例项背景。

####${prefix}  style(Object)

图例项背景的样式配置。

{{ use: graphic-rect(
  prefix = '#####'
) }}

####${prefix}  state(Object)

图例项背景在不同的交互状态下的样式配置，目前图例组件支持的交互状态有：

- `'selected'`：选中态
- `'unSelected'`：非选中状态
- `'selectedHover'`：选中并 hover 状态
- `'unSelectedHover'`：非选中并 hover 状态

#####${prefix}  selected(Object)

背景选中态的样式配置。

{{ use: graphic-rect(
  prefix = '######'
) }}

#####${prefix}  unSelected(Object)

背景非选中状态的样式配置。

{{ use: graphic-rect(
  prefix = '######'
) }}

#####${prefix}  selectedHover(Object)

背景选中并 hover 状态的样式配置。

{{ use: graphic-rect(
  prefix = '######'
) }}

#####${prefix}  unSelectedHover(Object)

背景非选中并 hover 状态的样式配置。

{{ use: graphic-rect(
  prefix = '######'
) }}

###${prefix}  shape(Object)

图例项的 shape 图标的配置。

####${prefix}  visible(boolean) = false

是否展示图例项的 shape 图标。

####${prefix}  space(number)

shape 同后面 label 的间距。

####${prefix}  style(Object)

shape 图标的样式配置。

{{ use: graphic-symbol(
  prefix = '#####'
) }}

####${prefix}  state(Object)

图例项 shape 在不同的交互状态下的样式配置，目前图例组件支持的交互状态有：

- `'selected'`：选中态
- `'unSelected'`：非选中状态
- `'selectedHover'`：选中并 hover 状态
- `'unSelectedHover'`：非选中并 hover 状态

#####${prefix}  selected(Object)

图例项 shape 选中态的样式配置。

{{ use: graphic-symbol(
  prefix = '######'
) }}

#####${prefix}  unSelected(Object)

图例项 shape 状态的样式配置。

{{ use: graphic-symbol(
  prefix = '######'
) }}

#####${prefix}  selectedHover(Object)

图例项 shape 选中并 hover 状态的样式配置。

{{ use: graphic-symbol(
  prefix = '######'
) }}

#####${prefix}  unSelectedHover(Object)

图例项 shape 非选中并 hover 状态的样式配置。

{{ use: graphic-symbol(
  prefix = '######'
) }}

###${prefix}  label(Object)

图例项的文本配置。

####${prefix}  space(number)

图例项 label 同后面 value 的间距。

####${prefix}  formatMethod(Function)

label 的文本格式化方法，可以自定义 label 的显示文本。函数的参数为：

```ts
/**
 * @params text 原始文本
 * @params item 图例项的绘制数据
 * @params index 图例项的索引
 */
(text: StringOrNumber, item: LegendItemDatum, index: number) => any;
```

图例项的绘制数据类型为：

```ts
export type LegendItemDatum = {
  /**
   * 该条数据的唯一标识，可用于动画或者查找
   */
  id?: string;
  /** 显示文本 */
  label: string;
  /** 显示数据 */
  value?: string | number;
  /** 图例项前的 shape 形状定义 */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
  };
  [key: string]: any;
};
```

####${prefix}  style(Object)

图例项 label 的样式配置。

{{ use: graphic-text(
  prefix = '#####'
) }}

####${prefix}  state(Object)

图例项 label 在不同的交互状态下的样式配置，目前图例组件支持的交互状态有：

- `'selected'`：选中态
- `'unSelected'`：非选中状态
- `'selectedHover'`：选中并 hover 状态
- `'unSelectedHover'`：非选中并 hover 状态

#####${prefix}  selected(Object)

图例项 label 选中态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

#####${prefix}  unSelected(Object)

图例项 label 非选中状态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

#####${prefix}  selectedHover(Object)

图例项 label 选中并 hover 状态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

#####${prefix}  unSelectedHover(Object)

图例项 label 非选中并 hover 状态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

###${prefix}  value(Object)

图例项的 value 配置。

####${prefix}  space(number)

图例项 value 同后面元素的间距。

####${prefix}  alignRight(boolean) = false

是否将 value 对齐到图例项整体的右侧，**仅当设置图例项宽度 `itemWidth` 时生效**。

####${prefix}  formatMethod(Function)

value 的文本格式化方法，可以自定义 value 的显示文本。函数的参数为：

```ts
/**
 * @params text 原始文本
 * @params item 图例项的绘制数据
 * @params index 图例项的索引
 */
(text: StringOrNumber, item: LegendItemDatum, index: number) => any;
```

图例项的绘制数据类型为：

```ts
export type LegendItemDatum = {
  /**
   * 该条数据的唯一标识，可用于动画或者查找
   */
  id?: string;
  /** 显示文本 */
  label: string;
  /** 显示数据 */
  value?: string | number;
  /** 图例项前的 shape 形状定义 */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
  };
  [key: string]: any;
};
```

####${prefix}  style(Object)

图例项 value 的样式配置。

{{ use: graphic-text(
  prefix = '#####'
) }}

####${prefix}  state(Object)

图例项 value 在不同的交互状态下的样式配置，目前图例组件支持的交互状态有：

- `'selected'`：选中态
- `'unSelected'`：非选中状态
- `'selectedHover'`：选中并 hover 状态
- `'unSelectedHover'`：非选中并 hover 状态

#####${prefix}  selected(Object)

图例项 value 选中态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

#####${prefix}  unSelected(Object)

图例项 value 非选中状态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

#####${prefix}  selectedHover(Object)

图例项 value 选中并 hover 状态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

#####${prefix}  unSelectedHover(Object)

图例项 value 非选中并 hover 状态的样式配置。

{{ use: graphic-text(
  prefix = '######'
) }}

###${prefix}  focusIconStyle(Object)

聚焦按钮样式配置。

{{ use: graphic-symbol(
  prefix = '####'
) }}

##${prefix}  autoPage(boolean) = true

是否开启自动翻页，默认开启。

##${prefix}  pager(Object)

翻页器配置。

###${prefix}  layout(string)

翻页器的布局方式，可选值为 `'horizontal'` 和 `'vertical'`。默认值逻辑为：

- 图例 `orient` 为 `'left'` 或者 `'right'` 时，默认为 `'vertical'`。
- 图例 `orient` 为 `'top'` 或者 `'bottom'` 时，默认为 `'horizontal'`。

###${prefix}  defaultCurrent(number)

默认当前页数。

###${prefix}  padding(number|number[]|Object)

{{ use: common-padding(
  componentName='翻页器'
) }}

###${prefix}  space(number)

翻页器同图例的间距。

###${prefix}  animation(boolean) = true

是否开启动画。

###${prefix}  animationDuration(number) = 450

动画时长，单位为 ms。

###${prefix}  animationEasing(string) = 'quadIn'

动画缓动效果。

###${prefix}  textStyle(Object)

文本样式配置。

{{ use: graphic-text(
  prefix = '####'
) }}

###${prefix}  handler(Object)

翻页器按钮的样式配置。

####${prefix}  space(number) = 8

按钮同文本内容区的间距，默认为 8。

####${prefix}  preShape(string)

翻页器上一页按钮形状。

####${prefix}  nextShape(string)

翻页器下一页按钮形状。

####${prefix}  style(Object)

翻页器按钮的样式配置。

{{ use: graphic-symbol(
  prefix = '#####'
) }}

####${prefix}  state(Object)

翻页器按钮在不同的交互状态下的样式配置，目前翻页器支持的交互状态有：

- `'hover'`：hover 状态
- `'disable'`：不可用状态样式

#####${prefix}  hover(Object)

翻页器按钮 hover 状态的样式配置。

{{ use: graphic-symbol(
  prefix = '######'
) }}

#####${prefix}  disable(Object)

翻页器按钮不可用状态的样式配置。

{{ use: graphic-symbol(
  prefix = '######'
) }}

##${prefix}  data(Array)

用于离散图例数据的自定义配置。`data: LegendItemDatum[]`

```ts
// 图例数据的类型
type LegendItemDatum = {
  /**
   * 该条数据的唯一标识，可用于动画或者查找
   */
  id?: string;
  /** 显示文本 */
  label: string;
  /** 显示数据 */
  value?: string | number;
  /** 图例项前的 shape 形状定义 */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
    stroke?: boolean;
  };
  [key: string]: any;
};
```

{{ use: common-layout-item(
  prefix = '##',
  defaultLayoutType = 'normal',
  defaultLayoutLevel = 50,
  defaultLayoutZIndex = 500,
  noOrient = true
) }}
