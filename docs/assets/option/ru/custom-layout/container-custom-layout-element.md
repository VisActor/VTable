{{ target: container-пользовательский-макет-element }}

{{ use: base-пользовательский-макет-element(
    prefix = ${prefix},
) }}

${prefix} ширина (число)

The ширина из the container.

${prefix} высота (число)

The высота из the container.

${prefix} direction ('row' | 'column') = 'row'

The main макет direction из the container, which can be 'row' (horizontal) или 'column' (vertical), по умолчанию is 'row'.

${prefix} justifyContent ('начало' | 'конец' | 'центр') = 'начало'

The alignment method along the main axis, which can be 'начало' (beginning), 'конец' (ending), или 'центр' (centered), по умолчанию is 'начало'.

${prefix} alignItems ('начало' | 'конец' | 'центр') = 'начало'

The alignment method along the cross axis, which can be 'начало' (beginning), 'конец' (ending), или 'центр' (centered), по умолчанию is 'начало'.

${prefix} alignContent ('начало' | 'конец' | 'центр')

The alignment method along the cross axis when the container has multiple axes, which can be 'начало' (beginning), 'конец' (ending), или 'центр' (centered), по умолчанию is undefined.

${prefix} showBounds (логический) = false

Whether к display the container boundary box, по умолчанию is false.