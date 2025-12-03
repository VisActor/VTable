{{ target: rect-пользовательский-element }}

${prefix} тип (строка) ='rect'

**обязательный**

Element тип, в this case, a rectangle.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} ширина (число | строка | ((значение: строка) => число | строка))

**обязательный**

Rectangle ширина, can be a число, строка, или a функция that returns a число или строка.

${prefix} высота (число | строка | ((значение: строка) => число | строка))

**обязательный**

Rectangle высота, can be a число, строка, или a функция that returns a число или строка.

${prefix} strхорошоe (строка | ((значение: строка) => строка))

Rectangle strхорошоe цвет, can be a строка или a функция that returns a строка.

${prefix} fill (строка | ((значение: строка) => строка))

Rectangle fill цвет, can be a строка или a функция that returns a строка.

${prefix} radius (число | строка | ((значение: строка) => число | строка))

Rectangle corner radius, can be a число, строка, или a функция that returns a число или строка.