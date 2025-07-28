{{ target: common-emptyTip }}

#${prefix} text(string)
Empty data describes the content.

#${prefix} textStyle(object)
Describes the text style.

- color: string configurable font color;
- fontSize:number configurable font size;
- fontFamily: string configurable font;
  -fontWeight: string | number;
- fontVariant?: string; font weight
- lineHeight?: number line height
- underline?: number; underline
- lineThrough?: number; dash

#${prefix} icon(object)
Empty data icon.

- width?: number; icon height
- height?: number; the height of the icon
- image?: string; image URL or inline SVG content

#${prefix} displayMode('basedOnTable' | 'basedOnContainer')

- basedOnTable: show empty data description content based on table range;
- basedOnContainer: show empty data description content based on container range;