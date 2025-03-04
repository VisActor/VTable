{{ target: base-icon }}

${prefix} type ('text' | 'svg' | 'path' | 'image')
The content type of the icon, such as svg text. Can be used to restrict different types of property definitions.

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
The distance between the icon and the element on the right, or the distance between the icon and the cell boundary.

${prefix} marginLeft (number)
The distance between the icon and the element on the left, or the distance between the icon and the cell boundary.

${prefix} name (string)
The name of the icon, which will be used as the key for the internal cache.

${prefix} funcType (IconFuncTypeEnum)

When resetting the icon inside VTable, you need to specify the functional type of the icon.

Especially for functional icons with switchable states, please be sure to configure funcType, such as sorting function with funcType configured as sort, and name configured as sort_normal, sort_downward, or sort_upward. In this way, the corresponding icon inside can be accurately replaced.

IconFuncTypeEnum enumeration type definition:

```
enum IconFuncTypeEnum {
  pin = 'pin',
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

Responds to hover hotzone size and hover effect background color.

#${prefix} width (number)
The width of the hover hotzone.

#${prefix} height (number)
The height of the hover hotzone.

#${prefix} bgColor (string)
The background color for the hover effect.

#${prefix} image (string)
The image for the hover effect.

${prefix} cursor (string)
The specific cursor style that appears when the mouse hovers over the icon.

${prefix} visibleTime ('always' | 'mouseenter_cell' | 'click_cell')
Visibility, default is 'always'. Optional values are 'always', 'mouseenter_cell', or 'click_cell', etc. Suggestion: If you need to use 'mouseenter_cell' or 'click_cell', it is recommended to set positionTyle to absoluteRight (i.e., not occupying space), otherwise the occupied type will affect the visual display.

${prefix} tooltip (Object)
The tooltip, a description of the button. Currently only supports hover behavior.

#${prefix} title (string)
The title of the tooltip.

#${prefix} placement (Placement)
The position of the tooltip, optional values are top, left, right, or bottom.
Placement enumeration type definition:

```
 enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}
```

#${prefix} style (Object)
The style of the tooltip. If not configured, the theme style will be used.

##${prefix} font (string)
The font of the tooltip.

##${prefix} color (string)
The text color of the tooltip.

##${prefix} padding (number[])
The padding of the tooltip. The format is [top, right, bottom, left].

##${prefix} bgColor (string)
The background color of the tooltip.

##${prefix} arrowMark (boolean)
Whether to show the arrow in the tooltip.

${prefix} interactive (boolean)
Whether it is interactive, default is true. Currently, the known non-interactive buttons are dropdown state menus.
