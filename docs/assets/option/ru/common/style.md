{{ target: common-style }}

#${prefix} bgColor(ColorPropertyDefine)

Define the фон цвет из the cell

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} заполнение(объект)
Define the cell's заполнение
{{ use: common-paddings(
  prefix = ${prefix},
) }}
#${prefix} textAlign(CanvasTextAlign)
Define the horizontal alignment из the текст inside the cell

#${prefix} textBaseline(CanvasTextBaseline)
Define the vertical alignment из the текст inside the cell

#${prefix} цвет(ColorPropertyDefine)
Define the текст цвет из the cell
{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} strхорошоeColor(ColorPropertyDefine)
Define the текст strхорошоe цвет из the cell
{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} fontSize(FontSizePropertyDefine)
Define the текст размер из the cell
{{ use: common-шрифт-размер(
  prefix = ${prefix},
) }}

#${prefix} fontFamily(FontFamilyPropertyDefine)
Define the текст шрифт из the cell
{{ use: common-шрифт-family(
  prefix = ${prefix},
) }}

#${prefix} fontWeight(FontWeightPropertyDefine)
Define the шрифт weight из the текст в the cell
{{ use: common-шрифт-weight(
  prefix = ${prefix}
  ) }}

#${prefix} fontVariant(FontVariantPropertyDefine)
Define the шрифт variant из the текст в the cell
{{ use: common-шрифт-variant(
  prefix = ${prefix}
  ) }}

#${prefix} fontStyle(FontStylePropertyDefine)
Define the шрифт style из the текст в the cell
{{ use: common-шрифт-style(
  prefix = ${prefix}
  ) }}

#${prefix} textOverflow(строка)
Set the текст ellipsis style. This is invalid if автоWrapText is set к автоLineBreak.

#${prefix} borderColor(ColorsPropertyDefine)
Set the граница цвет из the cell
{{ use: common-colors(
  prefix = ${prefix}
  ) }}

#${prefix} borderLineширина(LineширинаsPropertyDefine)
Set the граница ширина из the cell
{{ use: common-lineширинаs(
  prefix = ${prefix}
  ) }}

#${prefix} borderLineDash(LineDashsPropertyDefine)
Set the граница dashed style из the cell
{{ use: common-lineDashs(
  prefix = ${prefix}
  ) }}

#${prefix} lineвысота(число)
Set the текст шрифт line высота из the текст content в the cell

#${prefix} underline(UnderlinePropertyDefine)
Set the underline для the текст content из the cell
{{ use: common-underline(
  prefix = ${prefix}
  ) }}
#${prefix} underlineDash(LineDashPropertyDefine)
Set the dashed underline style для cell текст content
{{ use: common-underlineDash(
  prefix = ${prefix}
  ) }}

#${prefix} underlineOffset(число)
Set the distance between underline и текст для cell текст content
#${prefix} lineThrough(LineThroughPropertyDefine)
Set the line-through для the текст content из the cell
{{ use: common-lineThrough(
  prefix = ${prefix}
  ) }}

#${prefix} linkColor(ColorPropertyDefine)
Set the текст цвет для links
{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} cursor(CursorPropertyDefine)
Mouse cursor style when hovering over the cell
{{ use: common-cursor(
  prefix = ${prefix}
  ) }}

#${prefix} textStick(логический | 'horizontal' | 'vertical')
Set whether the текст в the cell has a sticking effect 【текст can dynamically adjust its позиция when scrolling】.Can be set к true к включить, или set к 'horizontal' или 'vertical' к specify в which direction к snap only.

#${prefix} textStickBaseOnAlign(логический)
When the cell текст has an adsorption effect [the текст can dynamically adjust its позиция when scrolling], the basis для adsorption is the horizontal alignment из the cell. для пример, when `textStickBaseOnAlign` is `true` и `textAlign` is `'центр'`, the текст will be adsorbed к the horizontal центр из the cell; otherwise, it will be adsorbed к the лево или право edge из the cell (depending на the прокрутка позиция)

#${prefix} marked(MarkedPropertyDefine)

Set whether the cell has a marked style
{{ use: common-marked(
  prefix = ${prefix}
  ) }}
  
#${prefix} автоWrapText(логический)
Set whether the cell's текст should автоmatically wrap

#${prefix} lineClamp(число|строка)
Set the maximum число из lines для the cell, can be a число или 'авто'. If set к 'авто', it will be calculated автоmatically

{{ if: ${isImвозраст} }}

#${prefix} отступ(число)

** Configuration specific к imвозраст тип ** Imвозраст positioning отступ within the cell

{{ /if }}

{{ if: ${isProgressbar} }}

#${prefix} showBar(логический|функция)

Whether к display the progress bar

```
 showBar?:логический | ((args: StylePropertyFunctionArg) => логический)
```

#${prefix} barColor(ColorPropertyDefine)

Progress bar цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barBgColor(ColorPropertyDefine)

Progress bar фон цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barвысота(число|строка)

Progress bar высота, can be a specific высота значение или a percentвозраст.

#${prefix} barBottom(число|строка)

Progress bar distance от the низ из the cell, can be a specific высота значение или a percentвозраст.

#${prefix} barPadding(массив)

заполнение inside the progress bar, can be a specific высота значение или a percentвозраст. тип: `число|строка`.

#${prefix} barPositiveColor(ColorPropertyDefine)

Progress bar positive цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barNegativeColor(ColorPropertyDefine)

Progress bar negative цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barAxisColor(ColorPropertyDefine)

Progress bar axis цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barRightToLeft(логический)

Whether the progress bar direction is от право к лево

#${prefix} showBarMark(логический)

Whether к display progress bar marks

#${prefix} barMarkPositiveColor(ColorPropertyDefine)

Progress bar positive mark цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barMarkNegativeColor(ColorPropertyDefine)

Progress bar negative mark цвет

{{ use: common-цвет(
  prefix = ${prefix},
) }}

#${prefix} barMarkширина(число)

Progress bar mark ширина

#${prefix} barMarkPosition(строка)

Progress bar mark позиция, can be set к `'право' | 'низ'`, по умолчанию is `'право'`.

#${prefix} barMarkInBar(логический)

Progress bar mark shows inside из bar, по умолчанию is `true`。

{{ /if }}

{{ if: ${isCheckbox} }}

{{ use: common-флажок-style (
  prefix = ${prefix}
  ) }}

{{ /if }}

{{ if: ${isRadio} }}

{{ use: common-переключатель-style (
  prefix = ${prefix}
  ) }}

{{ /if }}

{{ if: ${isSwitch} }}

{{ use: common-switch-style (
  prefix = ${prefix}
  ) }}

{{ /if }}

{{ if: ${isКнопка} }}

{{ use: common-Кнопка-style (
  prefix = ${prefix}
  ) }}

{{ /if }}
