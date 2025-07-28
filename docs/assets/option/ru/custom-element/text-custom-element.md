{{ target: text-custom-element }}

${prefix} type (string) ='text'

**Required**

Element type, here for text.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} text (string | ((value: string) => string))

**Required**

Text content, can be a string or a function that returns a string.

${prefix} stroke (string | ((value: string) => string))

Text stroke color, can be a string or a function that returns a string.

${prefix} fill (string | ((value: string) => string))

Text fill color, can be a string or a function that returns a string.

${prefix} fontSize (number | ((value: string) => number))

Text font size, can be a number or a function that returns a number.

${prefix} fontFamily (string | ((value: string) => string))

Text font family, can be a string or a function that returns a string.

${prefix} fontWeight (string | number | ((value: string) => string | number))

Text font weight, can be a string, number or a function returning a string or number.

${prefix} fontVariant (string)

Text font variant.

${prefix} fontStyle (string)

Text font style.

${prefix} ellipsis (boolean|string)

Whether to enable text overflow ellipsis, can be a boolean or a string. If it's a string, it means using a custom ellipsis.

${prefix} maxLineWidth (number)

The maximum width of the text.

${prefix} textAlign (TextAlignType)

Text alignment method.

```
TextAlignType = 'left' | 'right' | 'center' | 'start' | 'end';
```

${prefix} textBaseline (TextBaselineType)

Text baseline.

```
type TextBaselineType = 'top' | 'middle' | 'bottom' | 'alphabetic';
```

${prefix} lineHeight (number)

Text line height.

${prefix} underline (number)

Text underline thickness.

${prefix} underlineDash (number[])

Dashed style for text underlining.

${prefix} underlineOffset (number)

The distance between the text underline and the text.

${prefix} lineThrough (number)

Text strikethrough thickness.

${prefix} heightLimit (number)

Text height limit.

${prefix} lineClamp (number)

Text line number limit.

${prefix} width (number)

Text width.

${prefix} height (number)

Text height.

${prefix} background (Object)

Text background.

#${prefix} fill (string)

Background color.

#${prefix} expandY (number)

Vertical expansion amount.

#${prefix} expandX (number)

Horizontal expansion amount.

#${prefix} cornerRadius (number)

Border corner radius.
