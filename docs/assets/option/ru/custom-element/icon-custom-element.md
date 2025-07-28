{{ target: иконка-пользовательский-element }}

${prefix} тип (строка) ='иконка'

**обязательный**

Element тип, which is an иконка в this case.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} svg (строка | ((значение: строка) => строка))

**обязательный**

The SVG строка из the иконка, it can be a строка или a функция returning a строка.

${prefix} ширина (число | строка | ((значение: строка) => число | строка))

**обязательный**

иконка ширина, it can be a число, a строка или a функция returning a число или a строка.

${prefix} высота (число | строка | ((значение: строка) => число | строка))

**обязательный**

иконка высота, it can be a число, a строка или a функция returning a число или a строка.

${prefix} навести (объект)

Effects when the mouse hovers over it.

#${prefix} x (число | строка)

The x coordinate из the навести effect.

#${prefix} y (число | строка)

The y coordinate из the навести effect.

#${prefix} ширина (число | строка | ((значение: строка) => число | строка))

The ширина из the навести effect, it can be a число, a строка или a функция returning a число или a строка.

#${prefix} высота (число | строка | ((значение: строка) => число | строка))

The высота из the навести effect, it can be a число, a строка или a функция returning a число или a строка.

#${prefix} bgColor (строка)

фон цвет из the mouse навести effect.

#${prefix} radius (число)

граница radius из the mouse навести effect.