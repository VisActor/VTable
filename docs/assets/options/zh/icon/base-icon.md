{{ target: base-icon }}

${prefix} type ('font' | 'svg' | 'path' | 'image')
icon 是何种内容类型，如 svg font。可用来约束不同类型的属性定义。

${prefix} width (number)
icon 的宽度。

${prefix} height (number)
icon 的高度。

${prefix} positionType (IconPosition)
IconPosition 枚举类型。

${prefix} marginRight (number)
和右侧元素间隔距离，或者与单元格边界的间隔距离。

${prefix} marginLeft (number)
和左侧元素间隔距离，或者与单元格边界的间隔距离。

${prefix} name (string)
icon 的名称，会作为内部缓存的 key。

${prefix} funcType (IconFuncTypeEnum)

重置VTable内部的icon时需要指定 icon 的功能类型。

特别是具有切换状态的功能性的图标请务必配置上funcType，例如排序功能 funcType 配置 sort，name 配置 sort_normal 或 sort_downward，或 sort_upward。这样才能准确替换到内部相应的icon图标。

IconFuncTypeEnum枚举类型定义：
```
enum IconFuncTypeEnum {
  frozen = 'frozen',
  sort = 'sort',
  dropDown = 'dropDown',
  dropDownState = 'dropDownState',
  play = 'play',
  damagePic = 'damagePic',
  expand = 'expand',
  collapse = 'collapse',
  drillDown = 'drillDown',
  drillUp = 'drillUp'
}
```

${prefix} hover (Object)

响应 hover 热区大小，及 hover 效果背景色。

#${prefix} width (number)
响应 hover 热区的宽度。

#${prefix} height (number)
响应 hover 热区的高度。

#${prefix} bgColor (string)
hover 效果的背景颜色。

#${prefix} image (string)
hover 效果的图像。

${prefix} cursor (string)
鼠标 hover 到图标上后出现的具体鼠标样式。

${prefix} visibleTime ('always' | 'mouseenter_cell' | 'click_cell')
是否可见，默认为 'always'。可选值为 'always'、'mouseenter_cell' 或 'click_cell' 等。建议：如需使用 'mouseenter_cell' 或 'click_cell'，建议将 positionTyle 设为 absoluteRight（即不占位），否则占位的类型会影响视觉展示。

${prefix} tooltip (Object)
气泡框，按钮的解释信息，目前只支持 hover 行为触发。

#${prefix} title (string)
气泡框的标题。

#${prefix} placement (Placement)
气泡框位置，可选值为 top、left、right 或 bottom。
Placement枚举类型定义：
```
 enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}
```

#${prefix} style (Object)
气泡框的样式。如果不配置，会使用 theme 中的样式。

##${prefix} font (string)
气泡框的字体。

##${prefix} color (string)
气泡框的文字颜色。

##${prefix} padding (number[])
气泡框的内边距。格式为 [top, right, bottom, left]。

##${prefix} bgColor (string)
气泡框的背景颜色。

##${prefix} arrowMark (boolean)
气泡框是否显示箭头。

${prefix} interactive (boolean)
是否可交互，默认为 true。目前已知不可交互按钮为下拉菜单状态。