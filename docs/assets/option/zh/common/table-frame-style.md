{{ target: common-table-frame-style }}

#${prefix} frameStyle(FrameStyle)

表格外边框样式

{{ use: common-frame-style(
  prefix = '#'+${prefix}
  ) }}

##${prefix} shadowBlur(number)

阴影宽度

##${prefix} shadowOffsetX(number)

阴影x方向偏移

##${prefix} shadowOffsetY(number)

阴影Y方向偏移

##${prefix} shadowColor(string)

阴影颜色

##${prefix} cornerRadius(number)

边框圆角半径