{{ target: common-emptyTip }}

#${prefix} текст(строка)
Empty данные describes the content.

#${prefix} textStyle(объект)
Describes the текст style.

- цвет: строка configurable шрифт цвет;
- fontSize:число configurable шрифт размер;
- fontFamily: строка configurable шрифт;
  -fontWeight: строка | число;
- fontVariant?: строка; шрифт weight
- lineвысота?: число line высота
- underline?: число; underline
- lineThrough?: число; dash

#${prefix} иконка(объект)
Empty данные иконка.

- ширина?: число; иконка высота
- высота?: число; the высота из the иконка
- imвозраст?: строка; imвозраст URL или inline SVG content

#${prefix} displayMode('basedOnтаблица' | 'basedOnContainer')

- basedOnтаблица: показать empty данные description content based на таблица range;
- basedOnContainer: показать empty данные description content based на container range;