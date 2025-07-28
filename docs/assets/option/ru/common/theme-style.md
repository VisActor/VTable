{{ target: common-тема-style }}

{{ use: common-style(
  prefix = ${prefix},
) }}

#${prefix} навести(объект)

Effects when hovering over a cell

##${prefix} cellBgColor(ColorPropertyDefine)
фон цвет из the cell в the interaction
{{ use: common-цвет(
  prefix = ${prefix}
  ) }}

##${prefix} inlineRowBgColor(ColorPropertyDefine)
фон цвет из the entire row в the interaction
{{ use: common-цвет(
  prefix = ${prefix}
  ) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
фон цвет из the entire column в the interaction
{{ use: common-цвет(
  prefix = ${prefix}
  ) }}

#${prefix} выбрать(объект)

выбрать highlight style

##${prefix} inlineRowBgColor(ColorPropertyDefine)
The highlight цвет из the entire row when selected
{{ use: common-цвет(
prefix = ${prefix}
) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
The highlight цвет из the entire column when selected
{{ use: common-цвет(
prefix = ${prefix}
) }}

#${prefix} frameStyle(FrameStyle)

Outer граница style из the текущий section, such as the overall outer граница из the body или the overall outer граница из the header

{{ use: common-frame-style(
  prefix = '#'+${prefix}
  ) }}
