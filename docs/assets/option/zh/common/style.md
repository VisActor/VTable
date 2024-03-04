{{ target: common-style }}

#${prefix} bgColor(ColorPropertyDefine)
  
定义单元格的背景色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} padding(Object)
定义单元格的内边距
{{ use: common-paddings(
  prefix = ${prefix},
) }}
#${prefix} textAlign(CanvasTextAlign)
定义单元格内文字的水平对齐方式

#${prefix} textBaseline(CanvasTextBaseline)
定义单元格内文字的垂直对齐方式

#${prefix} color(ColorPropertyDefine)
定义单元格的文字颜色
{{ use: common-color(
  prefix = ${prefix},
) }}


#${prefix} fontSize(FontSizePropertyDefine)
定义单元格的文字大小
{{ use: common-font-size(
  prefix = ${prefix},
) }}

#${prefix} fontFamily(FontFamilyPropertyDefine)
定义单元格的文字字体
{{ use: common-font-family(
  prefix = ${prefix},
) }}

#${prefix} fontWeight(FontWeightPropertyDefine)
定义单元格的文字字体粗细
{{ use: common-font-weight(
  prefix = ${prefix}
  ) }}

#${prefix} fontVariant(FontVariantPropertyDefine)
定义单元格的文字字体粗细
{{ use: common-font-variant(
  prefix = ${prefix}
  ) }}

#${prefix} fontStyle(FontStylePropertyDefine)
定义单元格的文字字体样式
{{ use: common-font-style(
  prefix = ${prefix}
  ) }}

#${prefix} textOverflow(string)
设置文本的省略形式。如果autoWrapText设置了自动换行，这个无效。

#${prefix} borderColor(ColorsPropertyDefine)
为单元格设置边框的颜色
{{ use: common-colors(
  prefix = ${prefix}
  ) }}

#${prefix} borderLineWidth(LineWidthsPropertyDefine)
为单元格设置边框的宽度
{{ use: common-lineWidths(
  prefix = ${prefix}
  ) }}

#${prefix} borderLineDash(LineDashsPropertyDefine)
为单元格设置边框的线条虚线样式
{{ use: common-lineDashs(
  prefix = ${prefix}
  ) }}

#${prefix} lineHeight(number)
为单元格文本内容设置文字行高

#${prefix} underline(UnderlinePropertyDefine)
为单元格文本内容设置下划线
{{ use: common-underline(
  prefix = ${prefix}
  ) }}
#${prefix} lineThrough(LineThroughPropertyDefine)
为单元格文本内容设置中划线
{{ use: common-lineThrough(
  prefix = ${prefix}
  ) }}

#${prefix} linkColor(ColorPropertyDefine)
设置link类型的文本颜色
{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} cursor(CursorPropertyDefine)
鼠标hover到单元格的鼠标样式
{{ use: common-cursor(
  prefix = ${prefix}
  ) }}

#${prefix} textStick(boolean)
设置单元格的文本是否带有吸附效果【当滚动时文本可动态调整位置】

#${prefix} marked(MarkedPropertyDefine)
设置单元格是否有标记样式
{{ use: common-marked(
  prefix = ${prefix}
  ) }}
#${prefix} autoWrapText(boolean)
设置单元格是否自动换行

#${prefix} lineClamp(number|string)
设置单元格的最大行数, 可设置number或者'auto',如果设置为'auto', 则会自动计算

{{ if: ${isImage} }}

#${prefix} margin(number)

** image类型专有配置 ** 图片定位在单元格中的边距

{{ /if }}

{{ if: ${isProgressbar} }}

#${prefix} showBar(boolean|Function)

是否显示进度条

```
 showBar?:boolean | ((args: StylePropertyFunctionArg) => boolean)
 ```

#${prefix} barColor(ColorPropertyDefine)

进度条颜色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barBgColor(ColorPropertyDefine)

进度条背景颜色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barHeight(number|string)

进度条高度，可设置具体高度值或者百分比。

#${prefix} barBottom(number|string)

进度条距单元格底部距离，可设置具体高度值或者百分比。

#${prefix} barPadding(Array)

进度条内边距padding，可设置具体高度值或者百分比。类型：`number|string`。

#${prefix} barPositiveColor(ColorPropertyDefine)

进度条正向颜色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barNegativeColor(ColorPropertyDefine)

进度条负向颜色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barAxisColor(ColorPropertyDefine)

进度条坐标轴轴颜色

{{ use: common-color(
  prefix = ${prefix},
) }}


#${prefix} barRightToLeft(boolean)

进度条方向是否从右到左

#${prefix} showBarMark(boolean)

是否显示进度条标记

#${prefix} barMarkPositiveColor(ColorPropertyDefine)

进度条标记正向颜色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barMarkNegativeColor(ColorPropertyDefine)

进度条标记负向颜色

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barMarkWidth(number)

进度条标记宽度

#${prefix} barMarkPosition(string)

进度条标记位置，可设置`'right' | 'bottom'`，默认`'right'`。

{{ /if }}

{{ if: ${isCheckbox} }}

{{ use: common-checkbox-style (
  prefix = ${prefix}
  ) }}

{{ /if }}