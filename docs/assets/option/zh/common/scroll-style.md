{{ target: common-scroll-style }}

#${prefix} scrollStyle(Object)

滚动条样式配置

##${prefix} scrollRailColor(string)

滚动条轨道的颜色

##${prefix} scrollSliderColor(string)
滚动条滑块的颜色

##${prefix} scrollSliderCornerRadius(number)
滚动条滑块的圆角半径

##${prefix} width(number)
滚动条宽度大小

##${prefix} visible(string)
滚动条是否可见，可配值：`'always' | 'scrolling' | 'none' | 'focus'`,分别对应：常驻显示|滚动时显示|不显示|聚焦在画布上时显示

##${prefix} hoverOn(boolean)
指定滚动条是悬浮在容器上，还是独立于容器。默认为 true 即悬浮于容器上。

##${prefix} barToSide(boolean)
是否显示到容器的边缘 尽管内容没有撑满的情况下. 默认 false

##${prefix} horizontalPadding(number | [number, number, number, number])
横向滚动条内边距，可配值：`number` | `[number, number, number, number]`

##${prefix} verticalPadding(number | [number, number, number, number])
竖向滚动条内边距，可配值：`number` | `[number, number, number, number]`
