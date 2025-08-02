{{ target: circle-пользовательский-element }}

${prefix} тип (строка) ='circle'

**обязательный**

Element тип, в this case, a circle.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} radius (число | строка | ((значение: строка) => число | строка))

**обязательный**

Circle radius, can be a число, строка, или a функция that returns a число или строка.

${prefix} strхорошоe (строка | ((значение: строка) => строка))

Circle strхорошоe цвет, can be a строка или a функция that returns a строка.

${prefix} fill (строка | ((значение: строка) => строка))

Circle fill цвет, can be a строка или a функция that returns a строка.