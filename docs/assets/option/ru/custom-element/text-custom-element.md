{{ target: текст-пользовательский-element }}

${prefix} тип (строка) ='текст'

**обязательный**

Element тип, here для текст.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} текст (строка | ((значение: строка) => строка))

**обязательный**

текст content, can be a строка или a функция that returns a строка.

${prefix} strхорошоe (строка | ((значение: строка) => строка))

текст strхорошоe цвет, can be a строка или a функция that returns a строка.

${prefix} fill (строка | ((значение: строка) => строка))

текст fill цвет, can be a строка или a функция that returns a строка.

${prefix} fontSize (число | ((значение: строка) => число))

текст шрифт размер, can be a число или a функция that returns a число.

${prefix} fontFamily (строка | ((значение: строка) => строка))

текст шрифт family, can be a строка или a функция that returns a строка.

${prefix} fontWeight (строка | число | ((значение: строка) => строка | число))

текст шрифт weight, can be a строка, число или a функция returning a строка или число.

${prefix} fontVariant (строка)

текст шрифт variant.

${prefix} fontStyle (строка)

текст шрифт style.

${prefix} ellipsis (логический|строка)

Whether к включить текст overflow ellipsis, can be a логический или a строка. If it's a строка, it means using a пользовательский ellipsis.

${prefix} maxLineширина (число)

The maximum ширина из the текст.

${prefix} textAlign (TextAlignType)

текст alignment method.

```
TextAlignType = 'лево' | 'право' | 'центр' | 'начало' | 'конец';
```

${prefix} textBaseline (TextBaselineType)

текст baseline.

```
тип TextBaselineType = 'верх' | 'середина' | 'низ' | 'alphabetic';
```

${prefix} lineвысота (число)

текст line высота.

${prefix} underline (число)

текст underline thickness.

${prefix} underlineDash (число[])

Dashed style для текст underlining.

${prefix} underlineOffset (число)

The distance between the текст underline и the текст.

${prefix} lineThrough (число)

текст strikethrough thickness.

${prefix} высотаLimit (число)

текст высота limit.

${prefix} lineClamp (число)

текст line число limit.

${prefix} ширина (число)

текст ширина.

${prefix} высота (число)

текст высота.

${prefix} фон (объект)

текст фон.

#${prefix} fill (строка)

фон цвет.

#${prefix} expandY (число)

Vertical expansion amount.

#${prefix} expandX (число)

Horizontal expansion amount.

#${prefix} cornerRadius (число)

граница corner radius.
