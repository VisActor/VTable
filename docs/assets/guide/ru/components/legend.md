# Legend Introduction to the use of table legend components
The legend component in the VTable table library allows you to configure the supporting legends of the table and apply different types to them. This tutorial will guide you on how to use this feature effectively.

## Example and configuration introduction
The following is an example discrete legend configuration:

```
legends: {
  type: 'discrete',
  data: [
    {
      label: 'line_5',
      shape: {
        fill: '#1664FF',
        symbolType: 'circle'
      }
    },
    {
      label: 'bar_12',
      shape: {
        fill: '#1AC6FF',
        symbolType: 'square'
      }
    }
  ],
  orient: 'bottom',
  position: 'start'
}
```
In the example above, we configured a discrete legend for the chart. The example legend is below the table, shown to the left; there are two items in the chart, and we configured a name, shape, and color for each legend item. Now let's introduce the options configured in the example one by one:

- type: the type of the legend, currently supports `discrete` discrete legend, `color` color legend and `size` shape legend three legend types.
- orient: the position of the legend relative to the table. Can be set to `top`, `bottom`, `left` or `right`, indicating that the title is positioned at the top, bottom, left or right of the table. In the example, we set it to `bottom`, indicating that the legend position is relative to the bottom of the table.
- position: the alignment of the legend. Can be set to `start`, `middle` or `end`, indicating the alignment direction of the legend content. In the example, we set it to `start`, which means that the legend content is aligned to the left.
- data: Items displayed in the legend. Configured in the project:
  - label: text label displayed in the legend
  - shape: The shape shown in the legend. Configured in shape:
    - fill: the color shown in the legend
    - symbolType: the shape shown in the legend

The following is an example color legend configuration:
```
legends: {
  orient: 'bottom',
  type: 'color',
  colors: ['red', 'green'],
  value: [0, 100],
  max: 120,
  min: 0
}
```
The following configuration is used in the color legend:
- type: type of legend, set to `color`
- colors: The color range of the color legend, which is an array composed of a set of color strings.
- vlaue: The numerical range displayed by the color legend, which is an array composed of two numbers, the start data and the end data.
- max: the maximum value of the color legend
- min: the minimum value of the color legend

The following is an example shape legend configuration:
```
legends: {
  orient: 'right',
  type: 'size',
  sizeRange: [10, 50],
  value: [0, 100],
  max: 120,
  min: 0
}
```
The following configuration is used in the shape legend:
- type: type of legend, set to `size`
- sizeRange: The shape range of the shape legend, which is an array consisting of two numbers, the start size and the end size.
- value: The numerical range displayed by the shape legend, which is an array composed of two numbers, the start data and the end data.
- max: the maximum value of the shape legend
- min: the minimum value of the shape legend

Note that the above example only shows some of the configuration options for the legend component! For more configuration, go to [option description](https://visactor.io/vtable/option/PivotChart#legends-discrete.type)