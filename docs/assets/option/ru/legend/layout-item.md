{{ target: common-layout-item }}

<!-- ILayoutItemSpec -->

#${prefix} layoutType(string) = ${defaultLayoutType}

The layout type of the current module, if configured as `absolute`, the current element will be laid out absolutely with the upper left corner of the chart as the origin.

Currently supported layout types are as follows:

- `'region'`: the drawing area of the chart, generally only the region module is of this type
- `'region-relative'`: modules related to the region position, such as axes, datazoom, etc.
- `'normal'`: Normal placeholder elements, such as legends, titles, etc.
- `'absolute'`: Absolute layout elements, such as tooltip, markline, etc.

#${prefix} layoutLevel(number) = ${defaultLayoutLevel}

Layout order level, the higher the level, the higher the layout priority, such as a scene with both a title and a legend at the top, it is expected that the title will be placed at the top first, and then the legend will be placed.

{{ if: !${noOrient} }}
#${prefix} orient(string)

Module layout location. Optional location:

- 'left'
- 'top'
- 'right'
- 'bottom'

{{ /if }}

#${prefix} padding(ILayoutNumber|Array|Object) = 0

The layout spacing configuration of the module (four directions of up, down, left, and right) supports non-object configuration, array configuration and object configuration.

In the case of non-object configuration, the configuration value will be applied to the four directions of up, down, left, and right at the same time, and the properties are as follows:

{{ use: common-layout-number }}

When configuring an array, each item in the array supports ILayoutNumber , using an example:

```ts
padding: [5]; // top right bottom left padding are 5px
padding: ['10%']; // The top and bottom padding is 10% of the height of the chart view area, and the left and right padding is 10% of the width of the chart view area
padding: [5, 10]; // The top and bottom padding is 5px, and the left and right padding is 10px
padding: [
  5, // top padding is 5px
  '10%', // Left and right padding is 10% of the width of the chart view area
  10 // Bottom padding is 10px
];
padding: [
  5, // The top padding is 5px,
  '10%', // Right padding is 10% of the width of the chart view area,
  '5%', // Bottom padding is 5% of the height of the chart view area
  (rect: ILayoutRect) => rect.height * 0.1 + 10 // The left padding is 0.1 + 10 of the height of the chart view area
];
```

The properties of the object configuration are as follows:

{{ use: common-layout-padding(
  prefix = '#' + ${prefix}
) }}

Example usage:

```ts
padding: 10, // top right bottom left padding is 10px
padding: '10%' // The top, right, bottom, and left paddings are 10% of the width and height of the relative **chart view area**
padding: {
  top: 10, // top padding 10px
  left: ({ width }) => width * 0.1, // left padding is 0.1 of layout width
  right: '10%' // Right padding is 0.1 of layout width
}
```

#${prefix} width(ILayoutNumber)

The layout width configuration for the module.

{{ use: common-layout-number }}

#${prefix} minWidth(ILayoutNumber)

The minimum layout width configuration for modules. This configuration has no effect when width is configured.

{{ use: common-layout-number }}

#${prefix} maxWidth(ILayoutNumber)

The maximum layout width configuration for modules. This configuration has no effect when width is configured.

{{ use: common-layout-number }}

#${prefix} height(ILayoutNumber)

The layout of the modules is highly configurable.

{{ use: common-layout-number }}

#${prefix} minHeight(ILayoutNumber)

The minimum layout width configuration for modules. This configuration has no effect when height is configured.

{{ use: common-layout-number }}

#${prefix} maxHeight(ILayoutNumber)

The maximum layout width configuration for modules. This configuration has no effect when height is configured.

{{ use: common-layout-number }}

#${prefix} offsetX(ILayoutNumber)

The offset of the module's layout position in the X direction.

{{ use: common-layout-number }}

#${prefix} offsetY(ILayoutNumber)

The offset of the module's layout position in the Y direction.

{{ use: common-layout-number }}

#${prefix} zIndex(number) = ${defaultLayoutZIndex}

The display level of the modules. When two modules overlap, the one with the higher level will be displayed on top.

#${prefix} clip(boolean)

Whether the module clips drawing content outside the layout area.

#${prefix} left(ILayoutNumber)

The distance from the left side of the diagram in the absolute layout of the module. Note **Only takes effect when layoutType === 'absolute' **.

{{ use: common-layout-number }}

#${prefix} right(ILayoutNumber)

The distance from the right side of the diagram in the absolute layout of the module. Note **Only takes effect when layoutType === 'absolute' **.

{{ use: common-layout-number }}

#${prefix} top(ILayoutNumber)

The distance from the top of the chart in the absolute layout of the module. Note **Only takes effect when layoutType === 'absolute' **.

{{ use: common-layout-number }}

#${prefix} bottom(ILayoutNumber)

The distance from the bottom of the chart in the absolute layout of the module. Note **Only takes effect when layoutType === 'absolute' **.

{{ use: common-layout-number }}

#${prefix} center(boolean)

With module absolute layout, the element will be placed in the middle of the diagram. Note **Only takes effect when layoutType === 'absolute', and the padding property will be ignored**.
