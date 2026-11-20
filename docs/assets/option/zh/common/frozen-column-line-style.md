{{ target: common-frozen-column-line-style }}

#${prefix} frozenColumnLine(Object)

冻结列效果

##${prefix} shadow(Object)

冻结列阴影效果

###${prefix} width(number)
阴影整体宽度

###${prefix} startColor(string)
开始颜色

###${prefix} endColor(string)
结束颜色

###${prefix} visible(string)
阴影显示时机，默认为 `always`。

- always: 总是显示
- scrolling: 滚动时显示
- overflow: 仅在冻结边界外有被遮挡的表格主体内容时显示。左侧阴影在滚离起点后显示，右侧阴影在右边仍有内容时显示；停止滚动后保持，滚到对应边缘立即隐藏。没有冻结列或主体没有水平溢出时不显示。
