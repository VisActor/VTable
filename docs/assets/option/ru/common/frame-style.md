{{ target: common-frame-style }}

#${prefix} borderColor(ColorsDef)
граница цвет
{{ use: common-colorsDef(
  prefix = ${prefix}
  ) }}
#${prefix} borderLineширина(LineширинаsDef)
граница Thickness
{{ use: common-lineширинаsDef(
  prefix = ${prefix}
  ) }}
#${prefix} borderLineDash(LineDashsDef)
граница Line Style
{{ use: common-lineDashsDef(
  prefix = ${prefix}
  ) }}