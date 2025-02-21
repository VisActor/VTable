{{ target: base-icon }}

${prefix} type ('text' | 'svg' | 'path' | 'image')
Specify the content type of the icon, such as svg text. Can be used to constrain the definition of different types of attributes.

${prefix} width (number)
The width of the icon.

${prefix} height (number)
The height of the icon.

${prefix} positionType (IconPosition)
IconPosition enumeration type.

```
/**
* Icon location
* inlineFront: the front of the text content,
* inlineEnd: after the text content
*
*/
export enum IconPosition {
  /**Button on the left side of the cell and affected by padding */
  left = 'left',
  /**The button on the right side of the cell is affected by padding, such as the pin chart */
  right = 'right',
  /**The icon fixed on the right side does not occupy space, is not affected by padding, and may cover the content, such as dropDown */
  absoluteRight = 'absoluteRight',
  /**The icon on the left side of the cell content block follows the text positioning and does not wrap with the text */
  contentLeft = 'contentLeft',
  /**The icon on the right side of the cell content block follows the text positioning and does not wrap with the text */
  contentRight = 'contentRight',
  /**Free positioning in the cell */
  absolute = 'absolute',

  /**The icon in front of the text line content follows the text positioning and wraps with the text */
  inlineFront = 'inlineFront',
  /**The icon after the text line content, positioned with the text, and wrapped with the text. For example, the sort chart is placed in the first line of the text content */
  inlineEnd = 'inlineEnd',
}
```

${prefix} marginRight (number)
The spacing distance from the right element, or the spacing distance from the cell boundary.

${prefix} marginLeft (number)
The spacing distance from the left element, or the spacing distance from the cell boundary.

${prefix} name (string)
The name of the icon, which will be used as the key for internal caching.

${prefix} funcType (IconFuncTypeEnum)

When resetting the icon inside VTable, you need to specify the functional type of the icon.

Especially for functional icons with toggleable states, please be sure to configure funcType, such as sorting function with funcType set to sort, and name set to sort_normal, sort_downward, or sort_upward. This way, the corresponding icon can be replaced accurately.

IconFuncTypeEnum enumeration definition:

```
enum IconFuncTypeEnum {
  frozen = 'frozen',
  sort = 'sort',
  dropDown = 'dropDown',
  dropDownState = 'dropDownState',
  play = 'play',
  damagePic = 'damagePic',
  expand = 'expand',
  collapse = 'collapse',
  drillDown = 'drillDown',
  drillUp = 'drillUp'
}
```

${prefix} hover (Object)

Size of hover response hotzone and hover effect background color.

#${prefix} width (number)
Width of the hover response hotzone.

#${prefix} height (number)
Height of the hover response hotzone.

#${prefix} bgColor (string)
Background color for hover effect.

#${prefix} image (string)
Image for hover effect.

${prefix} cursor (string)
Specific mouse style when hovering over the icon.

${prefix} visibleTime ('always' | 'mouseenter_cell' | 'click_cell')
Visibility, default to 'always'. Optional values are 'always', 'mouseenter_cell', or 'click_cell'. Recommendation: If you need to use 'mouseenter_cell' or 'click_cell', it is recommended to set positionTyle to absoluteRight (i.e., non-occupying) to avoid visual display issues.

${prefix} tooltip (Object)
Tooltip, button explanation information, currently only supports hover behavior triggering.

#${prefix} title (string)
Title of the tooltip.

#${prefix} placement (Placement)
Tooltip position, optional values are top, left, right, or bottom.
Placement enumeration definition:

```
 enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}
```

#${prefix} disappearDelay (number)
The delay time for the tooltip to disappear. If you need to move the mouse to the tooltip, please configure this parameter.

#${prefix} style (Object)
The style of the tooltip. If not configured, the theme style will be used.

##${prefix} font (string)
Tooltip font.

##${prefix} color (string)
Tooltip text color.

##${prefix} padding (number[])
Tooltip padding. Format is [top, right, bottom, left].

##${prefix} bgColor (string)
Tooltip background color.

##${prefix} arrowMark (boolean)
Whether the tooltip displays an arrow.

##${prefix} maxWidth (number)
The maximum width of the tooltip.

##${prefix} maxHeight (number)
The maximum height of the tooltip.

${prefix} interactive (boolean)
Whether it is interactive, default is true. Currently known non-interactive buttons are dropdown menu states.
