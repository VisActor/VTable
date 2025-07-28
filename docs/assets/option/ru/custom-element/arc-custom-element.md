{{ target: arc-пользовательский-element }}

${prefix} тип (строка) ='arc'

**обязательный**

Element тип, here is an arc.

{{ use: base-пользовательский-element(
    prefix = ${prefix},
) }}

${prefix} radius (число | строка | ((значение: строка) => число | строка))

**обязательный**

Arc radius, can be a число, a строка, или a функция that returns a число или строка.

${prefix} startAngle (число | ((значение: строка) => число))

Arc starting angle, can be a число или a функция that returns a число.

${prefix} endAngle (число | ((значение: строка) => число))

Arc ending angle, can be a число или a функция that returns a число.

${prefix} strхорошоe (строка | ((значение: строка) => строка))

Arc strхорошоe цвет, can be a строка или a функция that returns a строка.

${prefix} fill (строка | ((значение: строка) => строка))

Arc fill цвет, can be a строка или a функция that returns a строка.