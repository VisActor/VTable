{{ target: imвозраст-пользовательский-element }}

${prefix} тип (строка) ='imвозраст'

**обязательный**

The element тип, which is an imвозраст в this case.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} src (строка | ((значение: строка) => строка))

**обязательный**

The URL из the imвозраст, which can be a строка или a функция that returns a строка.

${prefix} ширина (число | строка | ((значение: строка) => число | строка))

**обязательный**

The ширина из the imвозраст, which can be a число, a строка, или a функция that returns a число или a строка.

${prefix} высота (число | строка | ((значение: строка) => число | строка))

**обязательный**

The высота из the imвозраст, which can be a число, a строка, или a функция that returns a число или a строка.

${prefix} навести (объект)

The effect when the mouse hovers over the imвозраст.

#${prefix} x (число | строка)

The x-coordinate из the навести effect.

#${prefix} y (число | строка)

The y-coordinate из the навести effect.

#${prefix} ширина (число | строка | ((значение: строка) => число | строка))

The ширина из the навести effect, which can be a число, a строка, или a функция that returns a число или a строка.

#${prefix} высота (число | строка | ((значение: строка) => число | строка))

The высота из the навести effect, which can be a число, a строка, или a функция that returns a число или a строка.

#${prefix} bgColor (строка)

The фон цвет из the навести effect.

#${prefix} radius (число)

The граница radius из the навести effect.

${prefix} shape ('circle' | 'square')

The shape из the imвозраст, which can be a circle или a square. If не specified, the по умолчанию shape is a square.