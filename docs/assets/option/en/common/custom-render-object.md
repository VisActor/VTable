{{ target: common-custom-render-object }}

The definition of ICustomRenderObj is as follows:

${prefix} elements (Array)

The configured type collection. The type is declared as: ICustomRenderElement[].

The definition of ICustomRenderElement is as follows:

```
type ICustomRenderElement = TextElement | RectElement | CircleElement | IconElement | ImageElement | ArcElement;
```
Based on the type attribute, this section introduces the specific configuration information for each type.

${prefix} elements.text(string)

Placeholder TODO level 4 headings

{{ use: text-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.rect(string)

Placeholder TODO level 4 headings

{{ use: rect-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.circle(string)

Placeholder TODO level 4 headings

{{ use: circle-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.arc(string)

Placeholder TODO level 4 headings

{{ use: arc-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.image(string)

Placeholder TODO level 4 headings

{{ use: image-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.icon(string)

Placeholder TODO level 4 headings

{{ use: icon-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} expectedHeight (number)

The expected height of the cell.

${prefix} expectedWidth (number)

The expected width of the cell.

${prefix} renderDefault (boolean) = false

Whether to render default content, only when configured to true will it be drawn, otherwise not drawn by default.