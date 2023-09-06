{{ target: common-frame-style }}

#${prefix} borderColor(ColorsDef)
Border Color
{{ use: common-colorsDef(
  prefix = ${prefix}
  ) }}
#${prefix} borderLineWidth(LineWidthsDef)
Border Thickness
{{ use: common-lineWidthsDef(
  prefix = ${prefix}
  ) }}
#${prefix} borderLineDash(LineDashsDef)
Border Line Style
{{ use: common-lineDashsDef(
  prefix = ${prefix}
  ) }}