{{ target: common-theme-style }}

{{ use: common-style(
  prefix = ${prefix},
) }}

#${prefix} hover(Object)

Effects when hovering over a cell

##${prefix} cellBgColor(ColorPropertyDefine)
Background color of the cell in the interaction
{{ use: common-color(
  prefix = ${prefix}
  ) }}

##${prefix} inlineRowBgColor(ColorPropertyDefine)
Background color of the entire row in the interaction
{{ use: common-color(
  prefix = ${prefix}
  ) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
Background color of the entire column in the interaction
{{ use: common-color(
  prefix = ${prefix}
  ) }}

#${prefix} frameStyle(FrameStyle)

Outer border style of the current section, such as the overall outer border of the body or the overall outer border of the header

{{ use: common-frame-style(
  prefix = '#'+${prefix}
  ) }}