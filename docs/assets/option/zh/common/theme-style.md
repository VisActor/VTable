{{ target: common-theme-style }}

{{ use: common-style(
  prefix = ${prefix},
) }}

#${prefix} hover(Object)

hover 单元格时的效果

##${prefix} cellBgColor(ColorPropertyDefine)
交互所在单元格的背景颜色
{{ use: common-color(
  prefix = ${prefix}
  ) }}

##${prefix} inlineRowBgColor(ColorPropertyDefine)
交互所在整行的背景颜色
{{ use: common-color(
  prefix = ${prefix}
  ) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
交互所在整列的背景颜色
{{ use: common-color(
  prefix = ${prefix}
  ) }}

#${prefix} select(Object)

选择高亮样式

##${prefix} inlineRowBgColor(ColorPropertyDefine)
选中时整行高亮颜色
{{ use: common-color(
  prefix = ${prefix}
  ) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
选中时整列高亮颜色
{{ use: common-color(
  prefix = ${prefix}
  ) }}

#${prefix} frameStyle(FrameStyle)

当前部分的外边框样式，如 body 整体外边框，或者表头整体外边框

{{ use: common-frame-style(
  prefix = '#'+${prefix}
  ) }}
