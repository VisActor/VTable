{{ target: text-custom-element }}

${prefix} type (string) ='text'

**必填**

元素类型，此处为文本。

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} text (string | ((value: string) => string))

**必填**

文本内容，可以是字符串或返回字符串的函数。

${prefix} stroke (string | ((value: string) => string))

文本描边颜色，可以是字符串或返回字符串的函数。

${prefix} fill (string | ((value: string) => string))

文本填充颜色，可以是字符串或返回字符串的函数。

${prefix} fontSize (number | ((value: string) => number))

文本字体大小，可以是数字或返回数字的函数。

${prefix} fontFamily (string | ((value: string) => string))

文本字体，可以是字符串或返回字符串的函数。

${prefix} fontWeight (string | number | ((value: string) => string | number))

文本字体粗细，可以是字符串、数字或返回字符串或数字的函数。

${prefix} fontVariant (string)

文本字体变体。

${prefix} fontStyle (string)

文本字体样式。

${prefix} ellipsis (boolean|string)

是否启用文本溢出省略号，可以是布尔值或字符串。如果是字符串，则表示使用自定义的省略号。

${prefix} maxLineWidth (number)

文本的最大宽度。

${prefix} textAlign (TextAlignType)

文本对齐方式。

```
TextAlignType = 'left' | 'right' | 'center' | 'start' | 'end';
```

${prefix} textBaseline (TextBaselineType)

文本基线。

```
type TextBaselineType = 'top' | 'middle' | 'bottom' | 'alphabetic';
```

${prefix} lineHeight (number)

文字行高。

${prefix} underline (number)

文本下划线的粗细。

${prefix} underlineDash (number[])

文本下划线的虚线样式。

${prefix} underlineOffset (number)

文本下划线距文字的距离。

${prefix} lineThrough (number)

文本删除线的粗细。

${prefix} heightLimit (number)

文本高度限制。

${prefix} lineClamp (number)

文本行数限制。

${prefix} width (number)

文本宽度。

${prefix} height (number)

文本高度。

${prefix} background (Object)

文本背景。

#${prefix} fill (string)

背景颜色。

#${prefix} expandY (number)

纵向扩展量。

#${prefix} expandX (number)

横向扩展量。

#${prefix} cornerRadius (number)

边框圆角半径。
