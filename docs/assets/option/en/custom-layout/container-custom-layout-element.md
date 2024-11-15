{{ target: container-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix} width (number)

The width of the container.

${prefix} height (number)

The height of the container.

${prefix} direction ('row' | 'column') = 'row'

The main layout direction of the container, which can be 'row' (horizontal) or 'column' (vertical), default is 'row'.

${prefix} justifyContent ('start' | 'end' | 'center') = 'start'

The alignment method along the main axis, which can be 'start' (beginning), 'end' (ending), or 'center' (centered), default is 'start'.

${prefix} alignItems ('start' | 'end' | 'center') = 'start'

The alignment method along the cross axis, which can be 'start' (beginning), 'end' (ending), or 'center' (centered), default is 'start'.

${prefix} alignContent ('start' | 'end' | 'center')

The alignment method along the cross axis when the container has multiple axes, which can be 'start' (beginning), 'end' (ending), or 'center' (centered), default is undefined.

${prefix} showBounds (boolean) = false

Whether to display the container boundary box, default is false.