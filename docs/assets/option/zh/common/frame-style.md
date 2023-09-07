{{ target: common-frame-style }}

#${prefix} borderColor(ColorsDef)
边框颜色
{{ use: common-colorsDef(
  prefix = ${prefix}
  ) }}
#${prefix} borderLineWidth(LineWidthsDef)
边框粗细
{{ use: common-lineWidthsDef(
  prefix = ${prefix}
  ) }}
#${prefix} borderLineDash(LineDashsDef)
边框线条样式
{{ use: common-lineDashsDef(
  prefix = ${prefix}
  ) }}
