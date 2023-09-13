{{ target: custom-layout }}

ICustomLayoutObj is defined as:

${prefix} rootContainer (Container)

Root container.

Container is a class that needs to be instantiated by the user to act as a container. The container can invoke the add interface to add custom child elements. The types of child elements that can be added to this container are: `Text`|`Image`|`Icon`|`Rect`|`Circle`|`Line`|`Arc`|`Group`. [Refer the demo for the usage of custom layout](../demo/custom-render/custom-cell-layout)

The parameters of the constructor of the Container class are containerOptions, and the specific configuration items are:

{{ use: container-custom-layout-element(
    prefix =  '#'+${prefix},
) }}

${prefix} renderDefault (boolean) = false

Whether to render the default content, only drawn when set to true, the default value is false.