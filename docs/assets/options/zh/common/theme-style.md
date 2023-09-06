{{ target: common-theme-style }}

{{ use: common-style(
  prefix = ${prefix},
) }}

#${prefix} hover(Object)

hover单元格时的效果

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

#${prefix} frameStyle(FrameStyle)

当前部分的外边框样式，如body整体外边框，或者表头整体外边框

{{ use: common-frame-style(
  prefix = '#'+${prefix}
  ) }}