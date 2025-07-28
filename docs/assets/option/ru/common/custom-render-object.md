{{ target: common-пользовательский-render-объект }}

The definition из IпользовательскийRenderObj is as follows:

```
export тип IпользовательскийRenderObj = {
  /** Configured тип collection */
  elements: IпользовательскийRenderElements;
  /** Desired cell высота */
  expectedвысота: число;
  /** Expected cell ширина */
  expectedширина: число;
  /**
   * Do you still need к render content по по умолчанию? Only if the configuration is true, it will be drawn. по по умолчанию, it will не be drawn.
   */
  renderDefault?: логический;
};
```

Detailed configuration instructions are as follows:

${prefix} elements (массив)

The configured тип collection. The тип is declared as: IпользовательскийRenderElement[].

The definition из IпользовательскийRenderElement is as follows:

```
тип IпользовательскийRenderElement = TextElement | RectElement | CircleElement | иконкаElement | ImвозрастElement | ArcElement | LineElement;
```
Based на the тип attribute, this section introduces the specific configuration information для каждый тип.

${prefix} elements.текст(строка)

Placeholder TODO level 4 headings

{{ use: текст-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.rect(строка)

Placeholder TODO level 4 headings

{{ use: rect-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.circle(строка)

Placeholder TODO level 4 headings

{{ use: circle-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.arc(строка)

Placeholder TODO level 4 headings

{{ use: arc-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.imвозраст(строка)

Placeholder TODO level 4 headings

{{ use: imвозраст-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.line(строка)

Placeholder TODO level 4 headings

{{ use: line-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.иконка(строка)

Placeholder TODO level 4 headings

{{ use: иконка-пользовательский-element(
  prefix = '#' + ${prefix},
) }}

${prefix} expectedвысота (число)

The expected высота из the cell.

${prefix} expectedширина (число)

The expected ширина из the cell.

${prefix} renderDefault (логический) = false

Whether к render по умолчанию content, only when configured к true will it be drawn, otherwise не drawn по по умолчанию.