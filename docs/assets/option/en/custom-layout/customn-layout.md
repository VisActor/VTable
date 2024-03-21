{{ target: custom-layout }}

The ICustomLayoutObj type is defined as follows

```
export type ICustomLayoutObj = {
  rootContainer: Container | any;
  /**
   * Do you still need to render content by default? Only if the configuration is true, it will be drawn. By default, it will not be drawn.
   */
  renderDefault?: boolean;
  /**
   * Whether to also enable padding in style
   */
  enableCellPadding?: boolean;
};
```

Detailed configuration instructions are as follows:

${prefix} rootContainer (Container)

root container.

The `VTable.CustomLayout.Group` class needs to be instantiated by the user to act as a container. The container can call the add interface to add custom child elements. The sub-element types that can be added to this container are: `Text`|`Image`|`Icon`|`Rect`|`Circle`|`Line`|`Arc`|`Group`.

[Please refer to the example for using custom layout](../demo/custom-render/custom-cell-layout)

For details, please refer to the tutorial: [Custom rendering automatic layout](../guide/custom_define/custom_layout)

The parameter of the constructor of the Container class is containerOptions, and the specific configuration items are:

${prefix} renderDefault (boolean) = false

Whether the content needs to be rendered by default, it will be drawn only if the configuration is true, and the default value is false.
