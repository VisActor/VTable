{{ target: common-style }}

#${prefix} bgColor(ColorPropertyDefine)

Define the background color of the cell

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} padding(Object)
Define the cell's padding
{{ use: common-paddings(
  prefix = ${prefix},
) }}
#${prefix} textAlign(CanvasTextAlign)
Define the horizontal alignment of the text inside the cell

#${prefix} textBaseline(CanvasTextBaseline)
Define the vertical alignment of the text inside the cell

#${prefix} color(ColorPropertyDefine)
Define the text color of the cell
{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} strokeColor(ColorPropertyDefine)
Define the text stroke color of the cell
{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} fontSize(FontSizePropertyDefine)
Define the text size of the cell
{{ use: common-font-size(
  prefix = ${prefix},
) }}

#${prefix} fontFamily(FontFamilyPropertyDefine)
Define the text font of the cell
{{ use: common-font-family(
  prefix = ${prefix},
) }}

#${prefix} fontWeight(FontWeightPropertyDefine)
Define the font weight of the text in the cell
{{ use: common-font-weight(
  prefix = ${prefix}
  ) }}

#${prefix} fontVariant(FontVariantPropertyDefine)
Define the font variant of the text in the cell
{{ use: common-font-variant(
  prefix = ${prefix}
  ) }}

#${prefix} fontStyle(FontStylePropertyDefine)
Define the font style of the text in the cell
{{ use: common-font-style(
  prefix = ${prefix}
  ) }}

#${prefix} textOverflow(string)
Set the text ellipsis style. This is invalid if autoWrapText is set to autoLineBreak.

#${prefix} borderColor(ColorsPropertyDefine)
Set the border color of the cell
{{ use: common-colors(
  prefix = ${prefix}
  ) }}

#${prefix} borderLineWidth(LineWidthsPropertyDefine)
Set the border width of the cell
{{ use: common-lineWidths(
  prefix = ${prefix}
  ) }}

#${prefix} borderLineDash(LineDashsPropertyDefine)
Set the border dashed style of the cell
{{ use: common-lineDashs(
  prefix = ${prefix}
  ) }}

#${prefix} lineHeight(number)
Set the text font line height of the text content in the cell

#${prefix} underline(UnderlinePropertyDefine)
Set the underline for the text content of the cell
{{ use: common-underline(
  prefix = ${prefix}
  ) }}
#${prefix} underlineDash(LineDashPropertyDefine)
Set the dashed underline style for cell text content
{{ use: common-underlineDash(
  prefix = ${prefix}
  ) }}

#${prefix} underlineOffset(number)
Set the distance between underline and text for cell text content
#${prefix} lineThrough(LineThroughPropertyDefine)
Set the line-through for the text content of the cell
{{ use: common-lineThrough(
  prefix = ${prefix}
  ) }}

#${prefix} linkColor(ColorPropertyDefine)
Set the text color for links
{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} cursor(CursorPropertyDefine)
Mouse cursor style when hovering over the cell
{{ use: common-cursor(
  prefix = ${prefix}
  ) }}

#${prefix} textStick(boolean | 'horizontal' | 'vertical')
Set whether the text in the cell has a sticking effect 【Text can dynamically adjust its position when scrolling】.Can be set to true to enable, or set to 'horizontal' or 'vertical' to specify in which direction to snap only.

#${prefix} textStickBaseOnAlign(boolean)
When the cell text has an adsorption effect [the text can dynamically adjust its position when scrolling], the basis for adsorption is the horizontal alignment of the cell. For example, when `textStickBaseOnAlign` is `true` and `textAlign` is `'center'`, the text will be adsorbed to the horizontal center of the cell; otherwise, it will be adsorbed to the left or right edge of the cell (depending on the scroll position)

#${prefix} marked(MarkedPropertyDefine)
Set whether the cell has a marked style
{{ use: common-marked(
  prefix = ${prefix}
  ) }}
#${prefix} autoWrapText(boolean)
Set whether the cell's text should automatically wrap

#${prefix} lineClamp(number|string)
Set the maximum number of lines for the cell, can be a number or 'auto'. If set to 'auto', it will be calculated automatically

{{ if: ${isImage} }}

#${prefix} margin(number)

** Configuration specific to image type ** Image positioning margin within the cell

{{ /if }}

{{ if: ${isProgressbar} }}

#${prefix} showBar(boolean|Function)

Whether to display the progress bar

```
 showBar?:boolean | ((args: StylePropertyFunctionArg) => boolean)
```

#${prefix} barColor(ColorPropertyDefine)

Progress bar color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barBgColor(ColorPropertyDefine)

Progress bar background color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barHeight(number|string)

Progress bar height, can be a specific height value or a percentage.

#${prefix} barBottom(number|string)

Progress bar distance from the bottom of the cell, can be a specific height value or a percentage.

#${prefix} barPadding(Array)

Padding inside the progress bar, can be a specific height value or a percentage. Type: `number|string`.

#${prefix} barPositiveColor(ColorPropertyDefine)

Progress bar positive color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barNegativeColor(ColorPropertyDefine)

Progress bar negative color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barAxisColor(ColorPropertyDefine)

Progress bar axis color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barRightToLeft(boolean)

Whether the progress bar direction is from right to left

#${prefix} showBarMark(boolean)

Whether to display progress bar marks

#${prefix} barMarkPositiveColor(ColorPropertyDefine)

Progress bar positive mark color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barMarkNegativeColor(ColorPropertyDefine)

Progress bar negative mark color

{{ use: common-color(
  prefix = ${prefix},
) }}

#${prefix} barMarkWidth(number)

Progress bar mark width

#${prefix} barMarkPosition(string)

Progress bar mark position, can be set to `'right' | 'bottom'`, default is `'right'`.

{{ /if }}

{{ if: ${isCheckbox} }}

{{ use: common-checkbox-style (
  prefix = ${prefix}
  ) }}

{{ /if }}

{{ if: ${isRadio} }}

{{ use: common-radio-style (
  prefix = ${prefix}
  ) }}

{{ /if }}

{{ if: ${isSwitch} }}

{{ use: common-switch-style (
  prefix = ${prefix}
  ) }}

{{ /if }}

{{ if: ${isButton} }}

{{ use: common-button-style (
  prefix = ${prefix}
  ) }}

{{ /if }}
