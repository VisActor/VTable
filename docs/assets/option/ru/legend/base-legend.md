{{ target: component-base-legend }}

<!-- ILegendCommonSpec legend common configuration -->

#${prefix} visible(boolean) = true

Whether to show the legend. Displayed by default, and the type defaults to `'discrete'`.

#${prefix} orient(string)

Legend position, optional values: `'left'`, `'top'`, `'right'`, `'bottom'`, respectively represent the four directions of left, top, right, and bottom.

#${prefix} position(string) = 'middle'

The alignment of the legend in the current row and column, start|center|end.

#${prefix} interactive(boolean) = true

Whether to enable the interaction of the legend, it is enabled by default.

#${prefix} filter(boolean) = true

Whether to perform data filtering, the default is true. After this property is turned off, the click event of the legend will not trigger data filtering.

#${prefix} title(Object)

Legend title configuration, which is not displayed by default.

##${prefix} visible(boolean) = false

Whether to display the title or not by default.

##${prefix} text(string|string[]|number|number[])

Legend title content, if line break is required, use array form, such as ['abc', '123'].

##${prefix} align(string) = 'start'

The alignment of the title in the current display area. The optional values are: `'start'`, `'center'`, `'end'`, representing the start, center, and end respectively.

##${prefix} space(number)

The distance between the title and the legend content.

##${prefix} padding(number|number[]|Object)

{{ use: common-padding(
  componentName='Legend Title'
) }}

##${prefix} textStyle(Object)

Legend text style configuration.

{{ use: graphic-text(
prefix = '##' + ${prefix}
) }}

##${prefix} shape(Object)

Graphical configuration for legend markers, not displayed by default.

###${prefix} visible(boolean) = false

Whether to display, the default is not displayed.

###${prefix} space(number)

The spacing between shape and text.

###${prefix} style(Object)

The style configuration of shape, you can configure the shape, size, color, etc. of shape.

{{ use: graphic-symbol(
  prefix = '###' + ${prefix}
) }}

##${prefix} background(Object)

The background panel configuration of the title, which is not displayed by default.

###${prefix} visible(boolean) = false

Whether to draw the title background.

###${prefix} style(Object)

Title background style configuration.

{{
  use: graphic-rect(
    prefix = '###' + ${prefix}
  )
}}

##${prefix} minWidth(number) = 30

The minimum width configuration of the title, in px.

##${prefix} maxWidth(number)

The maximum width configuration of the title, in pixels. When the text exceeds the maximum width, it will be omitted automatically.

#${prefix} background(Object)

The legend organizes the background configuration.

##${prefix} visible(boolean) = false

Whether to draw the legend background, the default is not drawn.

##${prefix} padding(number|number[]|Object)

{{ use: common-padding(
  componentName='Legend Background'
) }}

##${prefix} style(Object)

Legend background style configuration.

{{
  use: graphic-rect(
    prefix = '##' + ${prefix}
  )
}}
