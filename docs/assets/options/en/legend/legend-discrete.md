{{ target: component-legend-discrete }}

#${prefix}  legends.discrete(string)

Discrete legend configuration. Please refer to [Configuration](https://visactor.io/vchart/option/barChart#legends-discrete.type) and [Legend demo](https://visactor.io/vchart/example) in VChart

##${prefix}  type(string) = 'discrete'

**Optional**, discrete legend type declaration, optional because legend type defaults to `'discrete'`.

{{ use: component-base-legend(
  prefix = '#' + ${prefix} 
) }}

##${prefix}  defaultSelected(Array)

Sets the legend item that is selected by default when the legend is initialized. The elements in the array are the names of the legend items, such as `['Legend 1', 'Legend 2']` means that the legend items named `'Legend 1'` and `'Legend 2'` are selected by default.

##${prefix}  select(boolean) = true

Whether to enable the selection function of the legend, which is enabled by default.

##${prefix}  selectedMode(string) = 'multiple'

The selection mode of the legend, optional values: `'multiple'`, `'single'`, respectively represent multiple selection and single selection.

##${prefix}  hover(boolean) = true

Whether to enable hover interaction.

##${prefix}  allowAllCanceled(boolean) = false

Whether to allow unchecking all legend items, the default is not allowed, only valid when `selectedMode` is `'multiple'`.

##${prefix}  reversed(boolean) = false

Whether to reverse the order of legend items, the default is not reversed.

##${prefix}  maxWidth(number)

The maximum width of the legend as a whole, which determines whether the legend of the horizontal layout (orient property is `'left'` | `'right'`) automatically wraps.

##${prefix}  maxRow(number)

It only takes effect when `orient` is `'left'` | `'right'`, which indicates the maximum number of rows of legend items, and legend items exceeding the maximum number of rows will be hidden.

##${prefix}  maxHeight(number)

The maximum height of the legend as a whole, which determines whether the legend of the vertical layout (orient attribute is `'top'` | `'bottom'`) automatically wraps.

##${prefix}  maxCol(number)

It only takes effect when `orient` is `'top'` | `'bottom'`, indicating the maximum number of columns of legend items, and legend items exceeding the maximum number of columns will be hidden.

##${prefix}  item(Object)

Legend item configuration, including graphics, text and other configurations inside the legend item.

####visible(boolean) = true

Whether to display the legend item, it is displayed by default.

###${prefix}  spaceCol(number)

Column spacing, horizontal spacing of legend items.

###${prefix}  spaceRow(number)

Row spacing, vertical spacing of legend items.

###${prefix}  maxWidth(number|string)

The maximum width of the legend item, defaults to null. Percentage can be used to indicate the proportion of the width of the display area.

###${prefix}  width(number|string)

The width of the legend item, calculated automatically by default. Percentage can be used to indicate the proportion of the width of the display area.

####height(number|string)

The height setting of the legend item, if not set, it will be automatically calculated by default. Percentage can be used to represent the height ratio of the display area.

###${prefix}  padding(number|number[]|Object)

{{ use: common-padding(
  componentName='Legend item'
) }}

###${prefix}  background(Object)

Background configuration for legend items.

#####visible(boolean) = false

Whether to show the legend item background.

####${prefix}  style(Object)

Style configuration for legend item background.

{{ use: graphic-rect(
  prefix = '#####'
) }}

####${prefix}  state(Object)

The style configuration of the legend item background in different interaction states. Currently, the interaction states supported by the legend component are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected and hover state
- `'unSelectedHover'`: unselected and hover state

#####${prefix}  selected(Object)

The style configuration of the background selected state.

{{ use: graphic-rect(
  prefix = '######'
) }}

######unSelected(Object)

Style configuration for the background unselected state.

{{ use: graphic-rect(
  prefix = '######'
) }}

######selectedHover(Object)

Style configuration for background selected and hover state.

{{ use: graphic-rect(
  prefix = '######'
) }}

######unSelectedHover(Object)

The style configuration of background unselected and hover state.

{{ use: graphic-rect(
  prefix = '######'
) }}

###${prefix}  shape(Object)

Configuration of the shape icon for the legend item.

#####visible(boolean) = false

Whether to display the shape icon of the legend item.

####${prefix}  space(number)

The distance between the shape and the following label.

####${prefix}  style(Object)

The shape configuration for the icon.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

####${prefix}  state(Object)

The style configuration of the legend item shape in different interaction states. Currently, the interaction states supported by the legend component are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected and hover state
- `'unSelectedHover'`: unselected and hover state

#####${prefix}  selected(Object)

Legend item shape The style configuration of the selected state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

######unSelected(Object)

Style configuration for the legend item shape state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

######selectedHover(Object)

The legend item shape is selected and the style configuration of the hover state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

######unSelectedHover(Object)

The legend item shape is not selected and the style configuration of the hover state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

####label(Object)

Text configuration for legend entries.

####${prefix}  space(number)

The distance between the legend item label and the following value.

####${prefix}  formatMethod(Function)

The text formatting method of the label, which can customize the display text of the label. The parameters of the function are:

```ts
/**
 * @params text original text
 * @params item The drawing data of the legend item
 * @params index index of legend item
 */
(text: StringOrNumber, item: LegendItemDatum, index: number) => any;
```

The plot data types for legend items are:

```ts
export type LegendItemDatum = {
  /**
   * The unique identifier of this piece of data, which can be used for animation or search
   */
  id?: string;
  /** display text */
  label: string;
  /** Display Data */
  value?: string | number;
  /** The shape definition before the legend item */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
  };
  [key: string]: any;
};
```

####${prefix}  style(Object)

Style configuration for legend item label.

{{ use: graphic-text(
  prefix = '#####'
) }}

####${prefix}  state(Object)

The style configuration of the legend item label in different interaction states. Currently, the interaction states supported by the legend component are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected and hover state
- `'unSelectedHover'`: unselected and hover state

#####${prefix}  selected(Object)

The style configuration of the selected state of the legend item label.

{{ use: graphic-text(
  prefix = '######'
) }}

######unSelected(Object)

The style configuration of the unselected state of the legend item label.

{{ use: graphic-text(
  prefix = '######'
) }}

######selectedHover(Object)

The style configuration of the legend item label selected and hover state.

{{ use: graphic-text(
  prefix = '######'
) }}

######unSelectedHover(Object)

The style configuration of the legend item label unselected and hover state.

{{ use: graphic-text(
  prefix = '######'
) }}

###${prefix}  value(Object)

The value configuration of the legend item.

####${prefix}  space(number)

The distance between the legend item value and the following elements.

####${prefix}  alignRight(boolean) = false

Whether to align the value to the right side of the overall legend item, **only takes effect when setting the legend item width `itemWidth`**.

####${prefix}  formatMethod(Function)

The text formatting method of value, you can customize the display text of value. The parameters of the function are:

```ts
/**
 * @params text original text
 * @params item The drawing data of the legend item
 * @params index index of legend item
 */
(text: StringOrNumber, item: LegendItemDatum, index: number) => any;
```

The plot data types for legend items are:

```ts
export type LegendItemDatum = {
  /**
   * The unique identifier of this piece of data, which can be used for animation or search
   */
  id?: string;
  /** display text */
  label: string;
  /** Display Data */
  value?: string | number;
  /** The shape definition before the legend item */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
  };
  [key: string]: any;
};
```

####${prefix}  style(Object)

Style configuration for legend item value.

{{ use: graphic-text(
  prefix = '#####'
) }}

####${prefix}  state(Object)

The style configuration of the legend item value in different interaction states. Currently, the interaction states supported by the legend component are:

- `'selected'`: selected state
- `'unSelected'`: unselected state
- `'selectedHover'`: selected and hover state
- `'unSelectedHover'`: unselected and hover state

#####${prefix}  selected(Object)

The style configuration of the legend item value selected state.

{{ use: graphic-text(
  prefix = '######'
) }}

######unSelected(Object)

Legend item value Style configuration for unselected state.

{{ use: graphic-text(
  prefix = '######'
) }}

######selectedHover(Object)

The style configuration of legend item value selected and hover state.

{{ use: graphic-text(
  prefix = '######'
) }}

######unSelectedHover(Object)

The legend item value is not selected and the style configuration of the hover state.

{{ use: graphic-text(
  prefix = '######'
) }}

###${prefix}  focusIconStyle(Object)

Focus button style configuration.

{{ use: graphic-symbol(
  prefix = '####'
) }}

##${prefix}  autoPage(boolean) = true

Whether to enable automatic page turning, it is enabled by default.

###pager(Object)

Page turner configuration.

###${prefix}  layout(string)

The layout of the page turner, optional values are `'horizontal'` and `'vertical'`. The default value logic is:

- When legend `orient` is `'left'` or `'right'`, it defaults to `'vertical'`.
- When the legend `orient` is `'top'` or `'bottom'`, it defaults to `'horizontal'`.

###${prefix}  defaultCurrent(number)

The default is the current page number.

###${prefix}  padding(number|number[]|Object)

{{ use: common-padding(
  componentName='Page Turner'
) }}

###${prefix}  space(number)

The spacing between the page turner and the legend.

###${prefix}  animation(boolean) = true

Whether to enable animation.

###${prefix}  animationDuration(number) = 450

Animation duration, in ms.

###${prefix}  animationEasing(string) = 'quadIn'

Animation easing effect.

####textStyle(Object)

Text style configuration.

{{ use: graphic-text(
  prefix = '####'
) }}

###${prefix}  handler(Object)

Style configuration for page turner buttons.

####${prefix}  space(number) = 8

The distance between the button and the text content area, the default is 8.

####${prefix}  preShape(string)

Page turner previous page button shape.

####${prefix}  nextShape(string)

Page turner next page button shape.

####${prefix}  style(Object)

Style configuration for page turner buttons.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

####${prefix}  state(Object)

The style configuration of the page turner button in different interaction states. Currently, the interaction states supported by the page turner are:

- `'hover'`: hover state
- `'disable'`: Disabled state style

#####${prefix}  hover(Object)

Style configuration for page turner button hover state.

{{ use: graphic-symbol(
  prefix = '######'
) }}

#####${prefix}  disable(Object)

Style configuration for the unavailable state of the page turner button.

{{ use: graphic-symbol(
  prefix = '######'
) }}

##${prefix}  data(Array)

Custom configuration for discrete legend data. `data: LegendItemDatum[]`

```ts
// type of legend data
type LegendItemDatum = {
  /**
   * The unique identifier of this piece of data, which can be used for animation or search
   */
  id?: string;
  /** display text */
  label: string;
  /** Display Data */
  value?: string | number;
  /** The shape definition before the legend item */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
    stroke?: boolean;
  };
  [key: string]: any;
};
```

{{ use: common-layout-item(
  prefix = '##',
  defaultLayoutType = 'normal',
  defaultLayoutLevel = 50,
  defaultLayoutZIndex = 500,
  noOrient = true
) }}
