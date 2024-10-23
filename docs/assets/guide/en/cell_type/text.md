# Table Display Text Type (Text) Introduction

In table applications, text-type data is the most common and basic form of data display. From simple table content to complex style adjustments, it all revolves around text data display. As the basic display form of data analytics, a good text type setting can provide users with a better reading experience. This tutorial will introduce the application of text types in VTable and its related configuration items in detail.

In VTable, you can customize fields and styles according to actual needs, so as to achieve flexible and diverse text type display effects.

## Introduction to style configuration

VTable supports setting various styles for text type data. The following are the style configuration items for text type:

- `textAlign`: Defines the horizontal alignment of text within cells, which can be set to`left`,`center`,`right`.
- `textBaseline`: Defines the vertical alignment of text within cells, which can be set to`top`,`middle`,`bottom`.
- `textOverflow`: Set the omitted form of the text, which can be configured as:`'clip' | 'ellipsis' | string`, representing truncated text, using`...`Represents omitted text, other strings instead of omitted text. If `autoWrapText` Line wrapping is set, the configuration has no effect.
- `color`: Defines the color of the text.
- `fontSize`: Defines the size of the text.
- `fontFamily`: Defines the font of the text.
- `fontWeight`: Defines the font weight of the text.
- `fontVariant`: Defines the font weight of the text.
- `fontStyle`: Defines the font style of the text.
- `textOverflow`: Set the omitted form of the text, it should be noted that if autoWrapText is set with line wrapping, the configuration is invalid.
- `lineHeight`: Set the text font height for the cell text content.
- `underline`: Set the underscore for the text content of the cell.
- `underlineDash`: Dashed style of underline.
- `underlineOffset`: The distance between underline and text.
- `lineThrough`: Set the dash for the cell text content.
- `textStick`: Set whether the text of the cell has an adsorption effect \[The text can dynamically adjust the position when scrolling].Can be set to true to enable, or set to 'horizontal' or 'vertical' to specify in which direction to snap only.
- `textStickBaseOnAlign`: When the cell text has an adsorption effect [the text can dynamically adjust its position when scrolling], the basis for adsorption is the horizontal alignment of the cell. For example, when `textStickBaseOnAlign` is `true` and `textAlign` is `'center'`, the text will be adsorbed to the horizontal center of the cell; otherwise, it will be adsorbed to the left or right edge of the cell (depending on the scroll position)
- `autoWrapText`: Sets whether cells wrap themselves.
- `lineClamp`: Set the maximum number of rows in a cell, you can set number or'auto ', if set to'auto', it will be automatically calculated

Note: The above styles also apply to the hyperlinke data format content.

## Example:

```javascript livedemo
{
  cellType: 'text',
  field: 'productName',
  title: '商品名称',
  style: {
    textAlign: 'left',
    textBaseline: 'middle',
    textOverflow: 'ellipsis',
    color: '#333',
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    fontStyle: 'italic'
  }
}
```

Combined with the above examples, you can configure the display effect of text types in VTable according to actual needs. By reasonably adjusting the style of the text and related configuration items, it can provide users with a clear and easy-to-understand table display effect.
