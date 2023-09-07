# Title Introduction to the use of table coordinate axes
The axis component in the VTable table library allows you to configure the axis in the cell in the perspective view. This tutorial will guide you on how to use this feature effectively.

## Example and configuration introduction
Here is an example configuration:

```
axes: [
  {
    type: 'band',
    visible: true,
    orient: 'bottom',
    domainLine: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: '#989999'
      }
    },
    title: {
      visible: false,
      text: 'region',
      style: {
        fontSize: 12,
        fill: '#363839',
        fontWeight: 'normal'
      }
    },
    label: {
      visible: true,
      space: 4,
      style: {
        fontSize: 12,
        fill: '#6F6F6F',
        angle: 0,
        fontWeight: 'normal'
      }
    }
  },
  {
    type: 'linear',
    orient: 'left',
    visible: true,
    domainLine: {
      visible: true,
      style: {
        lineWidth: 1,
        stroke: 'rgba(255, 255, 255, 0)'
      }
    },
    title: {
      visible: true,
      text: 'title',
      style: {
        fontSize: 12,
        fill: '#363839',
        fontWeight: 'normal'
      }
    },
    label: {
      visible: true,
      space: 8,
      style: {
        fontSize: 12,
        maxLineWidth: 174,
        fill: '#6F6F6F',
        angle: 0,
        fontWeight: 'normal'
      },
    },
  }
],
```
In the example above, the lower horizontal discrete axis and the left vertical continuous axis are configured separately. Now let's walk through the options available for customization:

- type: The type of coordinate axis. Currently, it supports two types: `band` and `linear`, which correspond to discrete and continuous coordinate axes respectively.
- orient: The position of the coordinate axis, which can be set to `top`, `bottom`, `left` or `right`, indicating that the axis cell is located at the top, bottom, left or right of the perspective. In the example, we set the discrete axis to `bottom`, relative to the bottom of the perspective, and the continuous axis to `left`, relative to the left side of the perspective.
- visible: Whether the coordinate axis is displayed, supports two configurations of `true` and `false`.
- domainLine: the main axis of the coordinate axis, supports the following configurations:
  - visible: Whether the main axis is displayed, supports two configurations of `true` and `false`.
  - style: the style of the main axis, the following configurations are supported:
    - lineWidth: main axis line width.
    - stroke: main axis line color.
- title: The title of the axis, supports the following configurations:
  - visible: Whether the title is displayed, supports two configurations of `true` and `false`.
  - text: The text content of the title.
  - style: The style of the title, supports the following configurations:
    - fontSize: text size.
    - fill: text color.
    - fontWeight: text thickness.
- laebl: axis label, supports the following configurations:
  - visible: whether the label is displayed, supports `true` and `false` two configurations.
  - space: the distance between the label and the axis.
  - style: The style of the label, which supports the following configurations:
    - fontSize: text size.
    - maxLineWidth: text display maximum width
    - fill: text color.
    - angle: text selection angle
    - fontWeight: text thickness.


Please note that the above example only shows a subset of the axis component's configuration options! For more configuration, please go to [option description](https://visactor.io/vtable/option/PivotChart#axes)